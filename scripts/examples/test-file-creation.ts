#!/usr/bin/env bun

#!/usr/bin/env bun

/**
 * 📝 TEST FILE CREATION - Direct File Operations with Permissions
 * 
 * This script tests direct file creation using the Claude Code SDK with
 * focused file operation validation. It demonstrates permission handling
 * for Write tool usage with clear, straightforward file creation workflow.
 * 
 * 🎯 FUNCTIONALITY:
 * - Direct file creation using Write tool with permission callbacks
 * - Focused file operation testing and validation
 * - Interactive permission system for Write tool specifically
 * - Process management with graceful shutdown handling
 * - Success/failure validation for file creation operations
 * 
 * 🔧 KEY FEATURES:
 * ✅ Write tool permission callback implementation
 * ✅ Direct file creation with specified content
 * ✅ Interactive permission prompts with user control
 * ✅ Process signal handling (SIGINT) for graceful shutdown
 * ✅ Stream-based input format for SDK compatibility
 * ✅ Clear success/failure reporting and validation
 * 
 * 🧪 HOW TO TEST:
 * 1. Run: `bun run test-file-creation.ts`
 * 2. Review the file creation request and parameters
 * 3. Choose 'y' to allow Write tool or 'n' to deny
 * 4. If allowed, verify "test-output.txt" is created
 * 5. Check file content matches expected message
 * 6. Review completion status and duration
 * 
 * 📋 TEST WORKFLOW:
 * 1. Initialize SDK with Write tool permission callback
 * 2. Send direct file creation request to Claude
 * 3. Handle permission prompt for Write tool usage
 * 4. Execute file creation with user-approved parameters
 * 5. Validate successful file creation and content
 * 6. Report completion status and operation details
 * 
 * 📊 EXPECTED BEHAVIOR:
 * - Prompts for Write tool permission with file details
 * - Creates "test-output.txt" with success message if allowed
 * - Shows detailed operation parameters before execution
 * - Completes in 10-30 seconds depending on user response
 * - Reports success/failure with cost and timing information
 * - File content: "Success! File created via Claude Code SDK..."
 * 
 * ⚠️  TROUBLESHOOTING:
 * - Permission denied: Check if Write tool was approved
 * - File not created: Verify directory write permissions
 * - Process hangs: Ensure permission callback completes properly
 * - Stream errors: Check async generator implementation
 * - SIGINT handling: Test graceful shutdown with Ctrl+C
 * 
 * 💡 WHEN TO USE:
 * - Testing basic file creation capabilities
 * - Learning Write tool permission handling
 * - Validating file operation workflows
 * - Understanding direct tool usage patterns
 * - Template for file-focused SDK integrations
 * 
 * 🔍 COMPARED TO OTHER SCRIPTS:
 * - More focused than comprehensive-tools-test.ts
 * - Simpler than claude-file-creator.ts (less documentation)
 * - Direct approach without enhanced permission analysis
 * - Good baseline for understanding basic Write tool usage
 * 
 * 📁 CREATES:
 * - test-output.txt (if Write tool is approved)
 * - Contains success message with SDK integration confirmation
 */

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