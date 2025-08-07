#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

interface ToolUseRequest {
  tool_name: string;
  parameters: Record<string, any>;
  description: string;
}

async function getUserPermission(toolRequest: ToolUseRequest): Promise<PermissionResult> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`\n🔧 Claude Code wants to use the following tool:`);
  console.log(`   Tool: ${toolRequest.tool_name}`);
  console.log(`   Description: ${toolRequest.description}`);
  console.log(`   Parameters:`, JSON.stringify(toolRequest.parameters, null, 2));
  
  return new Promise((resolve) => {
    rl.question('\n❓ Do you want to allow this tool usage? (y/n): ', (answer) => {
      rl.close();
      if (answer.toLowerCase().startsWith('y')) {
        resolve({
          behavior: 'allow',
          updatedInput: toolRequest.parameters
        });
      } else {
        resolve({
          behavior: 'deny',
          message: 'User denied permission for this tool usage'
        });
      }
    });
  });
}

async function main() {
  console.log("🚀 Testing file creation with direct Write tool call...\n");
  
  let conversationDone: (() => void) | undefined;
  
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();
    
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping...');
      abortController.abort();
      if (conversationDone) conversationDone();
      process.exit(0);
    });

    // More direct prompt to force tool usage
    const promptText = `Create a file called "test-output.txt" with the content "Success! File created via Claude Code SDK with TypeScript and proper permission handling."`;

    console.log("📤 Sending request to Claude Code:");
    console.log(`   Prompt: ${promptText}\n`);

    const conversationComplete = new Promise<void>(resolve => {
      conversationDone = resolve;
    });

    async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
      yield {
        type: 'user',
        message: { role: 'user', content: promptText },
        parent_tool_use_id: null,
        session_id: 'initial'
      };
      await conversationComplete;
    }

    for await (const message of query({
      prompt: createPromptStream(),
      abortController,
      options: { 
        maxTurns: 3,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          const toolRequest: ToolUseRequest = {
            tool_name: toolName,
            parameters,
            description: `Claude Code wants to use ${toolName} with the provided parameters`
          };
          
          const result = await getUserPermission(toolRequest);
          
          if (result.behavior === 'allow') {
            console.log(`✅ Permission granted for tool: ${toolName}`);
          } else {
            console.log(`❌ Permission denied for tool: ${toolName} - ${result.message}`);
          }
          
          return result;
        }
      }
    })) {
      messages.push(message);
      
      if (message.type === 'assistant') {
        console.log("📥 Assistant message:");
        console.log(JSON.stringify(message.message, null, 2));
        console.log("---");
      } else if (message.type === 'result') {
        console.log("🏁 Result:");
        console.log(`   Duration: ${message.duration_ms}ms`);
        console.log(`   Turns: ${message.num_turns}`);
        console.log(`   Cost: $${message.total_cost_usd}`);
        if (message.subtype === 'success') {
          console.log(`   Result: ${message.result}`);
        }
        console.log("---");
        if (conversationDone) conversationDone();
      } else if (message.type === 'system') {
        console.log("🔧 System initialized");
        console.log("---");
      }
    }

    console.log("\n✨ Test completed!");
    
  } catch (error) {
    console.error("💥 Error occurred:", error);
    if (conversationDone) {
      conversationDone();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}