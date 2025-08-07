#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { EnhancedPermissionSystem } from "./enhanced-permission-system";
import { createInterface } from 'readline';
import * as fs from 'fs';
import * as path from 'path';

interface SessionContext {
  sessionId: string | null;
  lastInteraction: Date;
  messageCount: number;
  totalCost: number;
  conversationSummary: string;
}

class ContextAwareClaudeSDK {
  private permissionSystem = new EnhancedPermissionSystem();
  private sessionFile = path.join(process.cwd(), '.claude-session-context.json');
  private currentContext: SessionContext | null = null;

  constructor() {
    this.loadSessionContext();
  }

  private loadSessionContext(): void {
    try {
      if (fs.existsSync(this.sessionFile)) {
        const data = fs.readFileSync(this.sessionFile, 'utf8');
        this.currentContext = JSON.parse(data);
        console.log('📂 Loaded existing session context');
        console.log(`   Session ID: ${this.currentContext?.sessionId || 'None'}`);
        console.log(`   Last interaction: ${this.currentContext?.lastInteraction || 'Never'}`);
        console.log(`   Messages: ${this.currentContext?.messageCount || 0}`);
        console.log(`   Total cost: $${this.currentContext?.totalCost || 0}`);
      } else {
        console.log('📝 No previous session found - starting fresh');
      }
    } catch (error) {
      console.log('⚠️  Could not load session context:', error);
      this.currentContext = null;
    }
  }

  private saveSessionContext(sessionId: string, messageCount: number, cost: number, summary?: string): void {
    this.currentContext = {
      sessionId,
      lastInteraction: new Date(),
      messageCount,
      totalCost: (this.currentContext?.totalCost || 0) + cost,
      conversationSummary: summary || this.currentContext?.conversationSummary || ''
    };

    try {
      fs.writeFileSync(this.sessionFile, JSON.stringify(this.currentContext, null, 2));
      console.log('💾 Session context saved');
    } catch (error) {
      console.log('⚠️  Could not save session context:', error);
    }
  }

  private async askUserAboutContext(): Promise<'new' | 'continue' | 'resume'> {
    if (!this.currentContext?.sessionId) {
      return 'new';
    }

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      console.log('\n🔄 CONTEXT MANAGEMENT OPTIONS:');
      console.log(`   Found previous session: ${this.currentContext?.sessionId}`);
      console.log(`   Last used: ${this.currentContext?.lastInteraction}`);
      console.log(`   Messages in conversation: ${this.currentContext?.messageCount}`);
      console.log(`   Total cost so far: $${this.currentContext?.totalCost}`);
      
      if (this.currentContext?.conversationSummary) {
        console.log(`   Summary: ${this.currentContext.conversationSummary}`);
      }

      const prompt = '\n❓ How do you want to handle context? (c=continue/r=resume/n=new): ';
      
      rl.question(prompt, (answer) => {
        rl.close();
        const response = answer.toLowerCase().trim();
        
        switch (response) {
          case 'c':
          case 'continue':
            console.log('🔄 Continuing from most recent conversation...');
            resolve('continue');
            break;
          case 'r': 
          case 'resume':
            console.log('📋 Resuming specific session...');
            resolve('resume');
            break;
          default:
            console.log('🆕 Starting new conversation...');
            resolve('new');
            break;
        }
      });
    });
  }

  async runContextAwareQuery(
    prompt: string, 
    options: {
      maxTurns?: number;
      contextMode?: 'auto' | 'new' | 'continue' | 'resume';
      sessionId?: string;
    } = {}
  ): Promise<{
    success: boolean;
    messages: SDKMessage[];
    sessionId?: string;
    cost: number;
    error?: string;
  }> {
    console.log('🚀 Context-Aware Claude Code SDK Query');
    console.log('='.repeat(50));
    
    // Determine context handling strategy
    let contextMode = options.contextMode || 'auto';
    if (contextMode === 'auto') {
      contextMode = await this.askUserAboutContext();
    }

    let conversationDone: (() => void) | undefined;
    const startTime = Date.now();
    
    try {
      const messages: SDKMessage[] = [];
      const abortController = new AbortController();

      const conversationComplete = new Promise<void>(resolve => {
        conversationDone = resolve;
      });

      async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
        yield {
          type: 'user',
          message: { role: 'user', content: prompt },
          parent_tool_use_id: null,
          session_id: options.sessionId || `context-aware-${Date.now()}`
        };
        await conversationComplete;
      }

      // Configure SDK options based on context mode
      const sdkOptions: any = {
        maxTurns: options.maxTurns || 5,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          return await this.permissionSystem.getUserPermission(toolName, parameters);
        }
      };

      // Add context preservation options
      if (contextMode === 'continue') {
        sdkOptions.continue = true;
        console.log('🔄 SDK configured to continue previous conversation');
      } else if (contextMode === 'resume' && (options.sessionId || this.currentContext?.sessionId)) {
        sdkOptions.resume = options.sessionId || this.currentContext?.sessionId;
        console.log(`📋 SDK configured to resume session: ${sdkOptions.resume}`);
      } else {
        console.log('🆕 SDK configured for new conversation');
      }

      console.log('\n📤 Sending query with context preservation...');
      console.log(`   Context mode: ${contextMode}`);
      console.log(`   Max turns: ${sdkOptions.maxTurns}`);
      if (sdkOptions.continue) console.log('   ✅ Will continue previous conversation');
      if (sdkOptions.resume) console.log(`   ✅ Will resume session: ${sdkOptions.resume}`);

      let finalSessionId: string | undefined;
      let finalCost = 0;

      for await (const message of query({
        prompt: createPromptStream(),
        abortController,
        options: sdkOptions
      })) {
        messages.push(message);
        
        if (message.type === 'assistant') {
          console.log('📥 Received assistant response...');
        } else if (message.type === 'system') {
          console.log('🔧 System initialized with context preservation');
          finalSessionId = message.session_id;
        } else if (message.type === 'result') {
          const duration = Date.now() - startTime;
          finalCost = message.total_cost_usd;
          finalSessionId = finalSessionId || message.session_id;
          
          if (conversationDone) conversationDone();
          
          console.log('\n🎯 CONTEXT-AWARE QUERY COMPLETE!');
          console.log('='.repeat(50));
          console.log(`⏱️  Duration: ${Math.round(duration/1000)}s`);
          console.log(`💰 This query cost: $${message.total_cost_usd}`);
          console.log(`🔄 Turns: ${message.num_turns}`);
          console.log(`📊 Messages: ${messages.length}`);
          console.log(`🆔 Session ID: ${finalSessionId}`);
          console.log(`✅ Success: ${message.subtype === 'success'}`);
          
          // Save session context for future use
          if (finalSessionId && message.subtype === 'success') {
            const summary = typeof message.result === 'string' ? 
              message.result.substring(0, 100) + '...' : 
              'Successful interaction';
            this.saveSessionContext(finalSessionId, message.num_turns, message.total_cost_usd, summary);
          }
          
          return {
            success: message.subtype === 'success',
            messages,
            sessionId: finalSessionId,
            cost: finalCost,
          };
        }
      }

      throw new Error('Query completed without result message');
      
    } catch (error) {
      if (conversationDone) conversationDone();
      
      console.error('💥 Context-aware query failed:', error);
      return {
        success: false,
        messages: [],
        cost: 0,
        error: String(error)
      };
    }
  }

  getSessionContext(): SessionContext | null {
    return this.currentContext;
  }

  clearSessionContext(): void {
    try {
      if (fs.existsSync(this.sessionFile)) {
        fs.unlinkSync(this.sessionFile);
      }
      this.currentContext = null;
      console.log('🗑️  Session context cleared');
    } catch (error) {
      console.log('⚠️  Could not clear session context:', error);
    }
  }

  printContextSummary(): void {
    console.log('\n📊 SESSION CONTEXT SUMMARY');
    console.log('='.repeat(30));
    if (this.currentContext) {
      console.log(`🆔 Session ID: ${this.currentContext.sessionId}`);
      console.log(`📅 Last interaction: ${this.currentContext.lastInteraction}`);
      console.log(`💬 Total messages: ${this.currentContext.messageCount}`);
      console.log(`💰 Total cost: $${this.currentContext.totalCost.toFixed(6)}`);
      console.log(`📝 Summary: ${this.currentContext.conversationSummary}`);
    } else {
      console.log('🆕 No active session context');
    }
    console.log('='.repeat(30));
  }
}

async function demonstrateContextPreservation() {
  console.log('🧪 CONTEXT PRESERVATION DEMONSTRATION');
  console.log('='.repeat(60));
  
  const sdk = new ContextAwareClaudeSDK();
  
  console.log('\n📋 This demo will show:');
  console.log('   🔄 Session continuity across multiple queries');
  console.log('   💾 Automatic context saving and loading');
  console.log('   🆔 Session ID preservation');
  console.log('   💰 Cost tracking across sessions');
  
  sdk.printContextSummary();

  // First query
  console.log('\n🔵 Running first context-aware query...');
  const result1 = await sdk.runContextAwareQuery(
    'Hello! Please create a simple text file called "context-test.txt" with a message about context preservation. Remember my name is Hassan and I\'m testing the Claude SDK.',
    { maxTurns: 3 }
  );

  if (result1.success) {
    console.log(`✅ First query completed successfully`);
    console.log(`🆔 Session ID: ${result1.sessionId}`);
    
    // Wait a moment then do a second query that should continue the context
    console.log('\n🔵 Running second context-aware query (should remember context)...');
    const result2 = await sdk.runContextAwareQuery(
      'Do you remember my name? And can you check if the file we created exists and read its contents?',
      { 
        maxTurns: 3,
        contextMode: 'continue' // Force continue mode for demo
      }
    );

    if (result2.success) {
      console.log(`✅ Second query completed - context preservation ${result2.sessionId === result1.sessionId ? 'SUCCESS' : 'PARTIAL'}`);
    }
  }

  sdk.printContextSummary();
  
  console.log('\n💡 Context preservation features:');
  console.log('   📂 Session data stored in .claude-session-context.json');
  console.log('   🔄 Use contextMode: "continue" for seamless conversations');
  console.log('   📋 Use contextMode: "resume" with specific session ID');
  console.log('   🆕 Use contextMode: "new" to start fresh');
  console.log('   💾 Automatic cost and message tracking');
}

if (require.main === module) {
  demonstrateContextPreservation().catch(console.error);
}