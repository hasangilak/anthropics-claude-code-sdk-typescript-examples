#!/usr/bin/env bun

/**
 * 🚀 SIMPLE CLAUDE TEST - Basic SDK Integration Demo
 * 
 * This is the most basic Claude Code SDK example showing minimal integration
 * without permission callbacks. Perfect for understanding core SDK concepts
 * and verifying your installation works correctly.
 * 
 * 🎯 FUNCTIONALITY:
 * - Basic Claude Code SDK query without permission system
 * - Simple string prompt (not streaming input)
 * - Read-only operation using LS tool (safe, no permissions needed)
 * - Basic message handling and cost reporting
 * 
 * 🔧 FEATURES DEMONSTRATED:
 * ✅ Basic SDK import and setup
 * ✅ Simple query() function usage
 * ✅ Message stream handling
 * ✅ Cost and performance metrics
 * ✅ Error handling
 * ✅ AbortController for graceful shutdown
 * 
 * 🧪 HOW TO TEST:
 * 1. Run: `bun run simple-claude-test.ts`
 * 2. Wait for Claude to list directory files
 * 3. Observe streaming messages and final cost
 * 4. Should complete without permission prompts
 * 5. Check console output for file list
 * 
 * 📋 EXPECTED BEHAVIOR:
 * - No permission prompts (LS tool is auto-allowed)
 * - Shows directory contents in response
 * - Displays cost information (usually $0.01-0.02)
 * - Completes in 5-10 seconds
 * - Shows system initialization and result messages
 * 
 * ⚠️  TROUBLESHOOTING:
 * - If fails immediately: Check Claude Code installation
 * - If hangs: Verify network connection and API access
 * - If permission error: Check .claude/settings.local.json
 * - If cost is $0: Check API key configuration
 * 
 * 💡 WHEN TO USE:
 * - First time testing Claude Code SDK
 * - Verifying installation and setup
 * - Understanding basic message flow
 * - Template for simple read-only operations
 * 
 * 🔗 NEXT STEPS:
 * - Try claude-file-creator.ts for permission callbacks
 * - Try comprehensive-tools-test.ts for advanced features
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function main() {
  console.log("🚀 Testing basic Claude Code SDK interaction...\n");
  
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();
    
    // Test with a simple prompt first (no permission needed)
    const prompt = `Please list the files in the current directory using the LS tool.`;

    console.log("📤 Sending request to Claude Code:");
    console.log(`   Prompt: ${prompt}\n`);

    // Query Claude Code without canUseTool callback
    for await (const message of query({
      prompt,
      abortController,
      options: { 
        maxTurns: 3
      }
    })) {
      messages.push(message);
      
      if (message.type === 'assistant') {
        console.log("📥 Assistant message:");
        console.log(JSON.stringify(message.message, null, 2));
        console.log("---");
      } else if (message.type === 'system') {
        console.log("🔧 System initialized");
        console.log("---");
      } else if (message.type === 'result') {
        console.log("🏁 Completed successfully!");
        console.log(`   Duration: ${message.duration_ms}ms`);
        console.log(`   Cost: $${message.total_cost_usd}`);
        console.log("---");
      }
    }

    console.log("\n✨ Basic test completed!");
    
  } catch (error) {
    console.error("💥 Error occurred:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}