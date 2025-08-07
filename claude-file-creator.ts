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
  console.log("🚀 Starting Claude Code SDK interaction...\n");
  
  // Keep the stream alive to prevent premature closing (fix for canUseTool callback issue)
  let conversationDone: (() => void) | undefined;
  
  try {
    const messages: SDKMessage[] = [];
    
    // Create an abort controller for graceful shutdown
    const abortController = new AbortController();
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping...');
      abortController.abort();
      process.exit(0);
    });

    // The prompt asking Claude Code to create a file
    const promptText = `Please create a new file called "example-output.txt" in the current directory. 
    Write a simple message in it like "Hello from Claude Code SDK! This file was created through TypeScript integration." 
    Make sure to ask for permission before creating the file.`;

    console.log("📤 Sending request to Claude Code:");
    console.log(`   Prompt: ${promptText}\n`);

    const conversationComplete = new Promise<void>(resolve => {
      conversationDone = resolve;
    });

    // Create async iterable for streaming input format required by canUseTool
    async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
      yield {
        type: 'user',
        message: { role: 'user', content: promptText },
        parent_tool_use_id: null,
        session_id: 'initial'
      };
      // Keep stream alive until conversation is done
      await conversationComplete;
    }

    // Query Claude Code with streaming
    for await (const message of query({
      prompt: createPromptStream(),
      abortController,
      options: { 
        maxTurns: 5,
        // Custom tool permission callback
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
      
      // Stream the response content as it comes in
      if (message.type === 'assistant') {
        console.log("📥 Assistant message:");
        console.log(JSON.stringify(message.message, null, 2));
        console.log("---");
      } else if (message.type === 'user') {
        console.log("👤 User message:");
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
        // Signal that conversation is complete
        if (conversationDone) conversationDone();
      } else if (message.type === 'system') {
        console.log("🔧 System message:");
        console.log(`   Model: ${message.model}`);
        console.log(`   Tools: ${message.tools.join(', ')}`);
        console.log(`   Permission Mode: ${message.permissionMode}`);
        console.log("---");
      }
    }

    console.log("\n✨ Conversation completed!");
    console.log(`📊 Total messages exchanged: ${messages.length}`);
    
    // Print final summary
    console.log("\n📋 Final conversation summary:");
    messages.forEach((msg, index) => {
      console.log(`${index + 1}. Type: ${msg.type}`);
      if (msg.type === 'assistant') {
        const content = JSON.stringify(msg.message.content);
        console.log(`   Content preview: ${content.substring(0, 100)}...`);
      }
    });

  } catch (error) {
    console.error("💥 Error occurred:", error);
    // Make sure to signal completion even on error
    if (conversationDone) {
      conversationDone();
    }
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}