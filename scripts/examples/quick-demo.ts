#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

async function quickDemo() {
  console.log('🚀 Claude Code SDK - Quick Demo with Hooks');
  console.log('='.repeat(40));
  
  let conversationDone: (() => void) | undefined;
  
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();

    const conversationComplete = new Promise<void>(resolve => {
      conversationDone = resolve;
    });

    const demoPrompt = 'Create a simple test file called "demo-test.txt" with the message "Hello from Claude Code SDK with hooks!" and then list the directory contents.';

    console.log(`\n📤 Prompt: ${demoPrompt}\n`);

    async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
      yield {
        type: 'user',
        message: { role: 'user', content: demoPrompt },
        parent_tool_use_id: null,
        session_id: `quick-demo-${Date.now()}`
      };
      await conversationComplete;
    }

    const startTime = Date.now();

    for await (const message of query({
      prompt: createPromptStream(),
      abortController,
      options: { 
        maxTurns: 3,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          console.log(`\n🔧 Auto-allowing tool: ${toolName}`);
          return {
            behavior: 'allow' as const,
            updatedInput: parameters
          };
        }
      }
    })) {
      messages.push(message);
      
      if (message.type === 'assistant') {
        console.log('📥 Response received');
      } else if (message.type === 'result') {
        const duration = Date.now() - startTime;
        
        if (conversationDone) conversationDone();
        
        console.log('\n🎯 QUICK DEMO COMPLETE!');
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`💰 Cost: $${message.total_cost_usd}`);
        console.log(`✅ Success: ${message.subtype === 'success'}`);
        
        if (message.subtype === 'success') {
          console.log('\n🎵 Completion sound should play now (Stop hook)');
        }
        
        break;
      }
    }

  } catch (error) {
    console.error('💥 Quick demo failed:', error);
    if (conversationDone) conversationDone();
  }
}

if (require.main === module) {
  quickDemo().catch(console.error);
}