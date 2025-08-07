#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { EnhancedPermissionSystem } from "./enhanced-permission-system";
import { createInterface } from 'readline';
import * as fs from 'fs';

interface TestSession {
  sessionId: string;
  testName: string;
  startTime: Date;
  messageCount: number;
  cost: number;
}

class ContextPreservingTester {
  private permissionSystem = new EnhancedPermissionSystem();
  private testSessions: TestSession[] = [];
  private currentSessionId: string | null = null;

  async askAboutContextContinuation(): Promise<boolean> {
    if (!this.currentSessionId) return false;

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      console.log('\n🔄 CONTEXT CONTINUATION');
      console.log(`   Current session: ${this.currentSessionId}`);
      console.log(`   Previous tests: ${this.testSessions.length}`);
      
      rl.question('❓ Continue from previous context? (y/n): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase().startsWith('y'));
      });
    });
  }

  async runContextAwareTest(
    testName: string,
    prompt: string,
    options: {
      maxTurns?: number;
      continuePrevious?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    sessionId?: string;
    cost: number;
    duration: number;
    error?: string;
  }> {
    console.log('\n🧪 STARTING CONTEXT-AWARE TEST');
    console.log('='.repeat(60));
    console.log(`📋 Test: ${testName}`);
    
    // Check if we should continue previous context
    let shouldContinue = options.continuePrevious;
    if (shouldContinue === undefined) {
      shouldContinue = await this.askAboutContextContinuation();
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
          session_id: `test-${testName}-${Date.now()}`
        };
        await conversationComplete;
      }

      // Configure SDK options for context preservation
      const sdkOptions: any = {
        maxTurns: options.maxTurns || 5,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          return await this.permissionSystem.getUserPermission(toolName, parameters);
        }
      };

      // Add context continuation if requested
      if (shouldContinue && this.currentSessionId) {
        sdkOptions.continue = true;
        console.log(`🔄 Continuing from session: ${this.currentSessionId}`);
      } else {
        console.log('🆕 Starting fresh session');
      }

      console.log(`📤 Test Prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`);
      console.log('='.repeat(60));

      let finalSessionId: string | undefined;
      let finalCost = 0;

      for await (const message of query({
        prompt: createPromptStream(),
        abortController,
        options: sdkOptions
      })) {
        messages.push(message);
        
        if (message.type === 'assistant') {
          console.log('📥 Processing test response...');
        } else if (message.type === 'system') {
          finalSessionId = message.session_id;
          console.log(`🆔 Session ID: ${finalSessionId}`);
        } else if (message.type === 'result') {
          const duration = Date.now() - startTime;
          finalCost = message.total_cost_usd;
          
          if (conversationDone) conversationDone();
          
          // Record this test session
          if (finalSessionId) {
            this.testSessions.push({
              sessionId: finalSessionId,
              testName,
              startTime: new Date(),
              messageCount: message.num_turns,
              cost: finalCost
            });
            this.currentSessionId = finalSessionId;
          }
          
          console.log('\n' + '='.repeat(60));
          console.log(`${message.subtype === 'success' ? '✅ TEST PASSED' : '❌ TEST FAILED'}: ${testName}`);
          console.log(`⏱️  Duration: ${Math.round(duration/1000)}s`);
          console.log(`💰 Cost: $${finalCost.toFixed(6)}`);
          console.log(`🔄 Turns: ${message.num_turns}`);
          console.log(`🆔 Session: ${finalSessionId}`);
          console.log(`🔗 Context: ${shouldContinue ? 'CONTINUED' : 'NEW'}`);
          console.log('='.repeat(60));
          
          return {
            success: message.subtype === 'success',
            sessionId: finalSessionId,
            cost: finalCost,
            duration,
          };
        }
      }

      throw new Error('Test completed without result message');
      
    } catch (error) {
      if (conversationDone) conversationDone();
      
      return {
        success: false,
        cost: 0,
        duration: Date.now() - startTime,
        error: String(error)
      };
    }
  }

  printSessionSummary(): void {
    console.log('\n📊 CONTEXT-PRESERVING TEST SUMMARY');
    console.log('='.repeat(70));
    
    const totalCost = this.testSessions.reduce((sum, s) => sum + s.cost, 0);
    const totalMessages = this.testSessions.reduce((sum, s) => sum + s.messageCount, 0);
    
    console.log(`🧪 Total tests: ${this.testSessions.length}`);
    console.log(`💰 Total cost: $${totalCost.toFixed(6)}`);
    console.log(`💬 Total messages: ${totalMessages}`);
    console.log(`🆔 Current session: ${this.currentSessionId || 'None'}`);
    
    if (this.testSessions.length > 0) {
      console.log('\n📋 Test Session Details:');
      this.testSessions.forEach((session, index) => {
        console.log(`${index + 1}. ${session.testName}`);
        console.log(`   🆔 Session: ${session.sessionId}`);
        console.log(`   💰 Cost: $${session.cost.toFixed(6)}`);
        console.log(`   💬 Messages: ${session.messageCount}`);
        console.log(`   📅 Started: ${session.startTime.toLocaleTimeString()}`);
      });
    }
    
    console.log('\n🔗 Context Preservation Benefits:');
    console.log('   ✅ Claude remembers previous interactions');
    console.log('   📚 Build upon earlier work in same session');
    console.log('   💾 Efficient context reuse reduces costs');
    console.log('   🎯 More coherent multi-step workflows');
    
    console.log('='.repeat(70));
  }

  saveSessionData(): void {
    try {
      const sessionData = {
        currentSessionId: this.currentSessionId,
        testSessions: this.testSessions,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(
        '.claude-test-sessions.json',
        JSON.stringify(sessionData, null, 2)
      );
      console.log('💾 Session data saved to .claude-test-sessions.json');
    } catch (error) {
      console.log('⚠️  Could not save session data:', error);
    }
  }
}

async function runContextPreservingTests() {
  console.log('🚀 CONTEXT-PRESERVING CLAUDE CODE TEST SUITE');
  console.log('='.repeat(70));
  console.log('Features:');
  console.log('✅ Session continuity across multiple tests');
  console.log('✅ Context preservation and memory');
  console.log('✅ Cost tracking per session');
  console.log('✅ Enhanced permission system integration');
  console.log('='.repeat(70));
  
  const tester = new ContextPreservingTester();
  
  // Test 1: Initial setup with context creation
  await tester.runContextAwareTest(
    'Context Setup and File Creation',
    'Hello! My name is Hassan and I\'m testing context preservation in Claude Code SDK. Please create a file called "context-demo.md" with information about this test session. Remember my name for future interactions.',
    { maxTurns: 3, continuePrevious: false }
  );
  
  // Test 2: Context continuation - should remember name and previous work
  await tester.runContextAwareTest(
    'Context Memory Test',
    'Do you remember my name? Can you also check if the file we created exists and add a timestamp to it showing when this second interaction happened?',
    { maxTurns: 3, continuePrevious: true }
  );
  
  // Test 3: Complex workflow with context
  await tester.runContextAwareTest(
    'Multi-step Context Workflow',
    'Based on our previous interactions, create a project structure with a directory called "hassan-sdk-test", put our markdown file in there, and create a summary of all our interactions so far.',
    { maxTurns: 5, continuePrevious: true }
  );
  
  // Test 4: Context validation
  await tester.runContextAwareTest(
    'Context Validation and Cleanup',
    'Let\'s verify everything we\'ve built together. List all the files we\'ve created, show me the contents of our main files, and give me a summary of what we\'ve accomplished in this session.',
    { maxTurns: 4, continuePrevious: true }
  );

  tester.printSessionSummary();
  tester.saveSessionData();
  
  console.log('\n💡 Next Steps:');
  console.log('   🔄 Use --continue flag to resume this conversation');
  console.log('   📋 Use --resume with session ID for specific session');
  console.log('   📊 Check .claude-test-sessions.json for session history');
}

if (require.main === module) {
  runContextPreservingTests().catch(error => {
    console.error('💥 Context-preserving test failed:', error);
    process.exit(1);
  });
}