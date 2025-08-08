#!/usr/bin/env bun

/**
 * 🧪 QUICK FORMATTING TEST
 * 
 * Quick test to verify Claude Code SDK formatting works properly
 * and outputs valid markdown code blocks.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function quickFormattingTest() {
  console.log('🧪 QUICK FORMATTING TEST');
  console.log('='.repeat(30));
  
  console.log('\n🔹 Testing System Message Approach...');
  
  try {
    const systemMessage = "Always wrap JavaScript code in ```js blocks and JSON in ```json blocks. Include proper language tags.";
    
    for await (const message of query({
      prompt: "Create a simple JavaScript function that adds two numbers. Format your response using ```js code blocks for JavaScript and ```json blocks for JSON examples. Include proper language tags.",
      options: { maxTurns: 3 }
    })) {
      if (message.type === 'text') {
        console.log('✅ Claude Response:');
        console.log(message.text);
        
        // Check if response contains proper markdown code blocks
        const hasJsBlock = message.text.includes('```js');
        const hasJsonBlock = message.text.includes('```json');
        
        console.log('\n📋 Format Check:');
        console.log('   JavaScript blocks (```js): ' + (hasJsBlock ? '✅' : '❌'));
        console.log('   JSON blocks (```json): ' + (hasJsonBlock ? '✅' : '❌'));
        
        if (hasJsBlock && hasJsonBlock) {
          console.log('🎉 SUCCESS: Proper markdown code blocks detected!');
        } else {
          console.log('⚠️  WARNING: Some code blocks may be missing language tags');
        }
        
        return; // Exit after first text response
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (import.meta.main) {
  quickFormattingTest().catch(console.error);
}