#!/usr/bin/env bun

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