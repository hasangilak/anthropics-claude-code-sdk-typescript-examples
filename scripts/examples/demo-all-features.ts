#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

async function getUserPermission(toolName: string, parameters: Record<string, any>): Promise<PermissionResult> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`\n🔧 Tool Request: ${toolName}`);
  console.log(`   Parameters:`, JSON.stringify(parameters, null, 2));
  
  return new Promise((resolve) => {
    rl.question('\n❓ Allow this tool? (y/n/a=allow all): ', (answer) => {
      rl.close();
      const response = answer.toLowerCase();
      
      if (response === 'a') {
        console.log('🔓 Auto-allowing all future tools...');
        // Store in global for demo
        (global as any).autoAllow = true;
      }
      
      if (response.startsWith('y') || response === 'a' || (global as any).autoAllow) {
        console.log(`✅ Permission granted: ${toolName}`);
        resolve({
          behavior: 'allow',
          updatedInput: parameters
        });
      } else {
        console.log(`❌ Permission denied: ${toolName}`);
        resolve({
          behavior: 'deny',
          message: 'User denied permission'
        });
      }
    });
  });
}

async function runDemo() {
  console.log('🚀 Claude Code SDK - Complete Feature Demo');
  console.log('='.repeat(50));
  console.log('This demo will showcase:');
  console.log('✅ TypeScript SDK Integration');
  console.log('✅ Real-time Streaming JSON Communication');
  console.log('✅ Interactive Permission System');
  console.log('✅ Multiple Tool Usage');
  console.log('✅ Hooks Integration (completion sound)');
  console.log('✅ File Operations');
  console.log('✅ Error Handling');
  console.log('='.repeat(50));
  
  let conversationDone: (() => void) | undefined;
  
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();
    const toolsUsed: string[] = [];

    const conversationComplete = new Promise<void>(resolve => {
      conversationDone = resolve;
    });

    const demoPrompt = `Please demonstrate multiple Claude Code capabilities:

1. Create a demo directory called "sdk-demo"
2. Create a JSON file with some sample data
3. List the current directory contents
4. Search for any files containing "demo" 
5. Create a summary file with what you accomplished

This will test Write, Bash, LS, Grep, and multiple tool coordination with permission system.`;

    console.log('\n📤 Demo Prompt:');
    console.log(demoPrompt);
    console.log('\n' + '='.repeat(50));

    async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
      yield {
        type: 'user',
        message: { role: 'user', content: demoPrompt },
        parent_tool_use_id: null,
        session_id: `demo-${Date.now()}`
      };
      await conversationComplete;
    }

    const startTime = Date.now();

    for await (const message of query({
      prompt: createPromptStream(),
      abortController,
      options: { 
        maxTurns: 8,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          if (!toolsUsed.includes(toolName)) {
            toolsUsed.push(toolName);
          }
          return await getUserPermission(toolName, parameters);
        }
      }
    })) {
      messages.push(message);
      
      if (message.type === 'assistant') {
        console.log('📥 Claude Response:');
        console.log('---');
        const content = message.message.content;
        if (Array.isArray(content)) {
          content.forEach(item => {
            if (item.type === 'text') {
              console.log(item.text);
            } else if (item.type === 'tool_use') {
              console.log(`🔧 Using tool: ${item.name}`);
            }
          });
        }
        console.log('---\n');
      } else if (message.type === 'result') {
        const duration = Date.now() - startTime;
        
        if (conversationDone) conversationDone();
        
        console.log('🎯 DEMO COMPLETE!');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`💰 Cost: $${message.total_cost_usd}`);
        console.log(`🔄 Turns: ${message.num_turns}`);
        console.log(`🔧 Tools Used: ${toolsUsed.join(', ')}`);
        console.log(`📊 Messages: ${messages.length}`);
        
        if (message.subtype === 'success') {
          console.log('✅ Demo completed successfully!');
          console.log('\n🎵 You should hear a completion sound now (Stop hook)');
        } else {
          console.log('❌ Demo had some issues');
        }
        
        console.log('\n📁 Check the created files:');
        console.log('   - sdk-demo/ directory');
        console.log('   - JSON files');  
        console.log('   - Summary file');
        
        console.log('='.repeat(50));
        break;
      } else if (message.type === 'system') {
        console.log('🔧 System initialized with tools and hooks');
      }
    }

  } catch (error) {
    console.error('💥 Demo failed:', error);
    if (conversationDone) conversationDone();
    process.exit(1);
  }
}

if (require.main === module) {
  runDemo().catch(console.error);
}