#!/usr/bin/env bun

/**
 * 🧪 TEST MIXED CONTENT SIMPLE
 * 
 * Simple test for mixed content: text → code → text → JSON pattern
 * Explicitly asks for formatted response, not tool usage.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function testMixedContentSimple() {
  console.log('🧪 TESTING MIXED CONTENT: TEXT → CODE → TEXT → JSON');
  console.log('='.repeat(55));
  
  try {
    const prompt = `I want you to respond with formatted text only (no tools). Create a simple example with this exact pattern:

1. Write some explanation text about functions
2. Show a JavaScript function using \`\`\`js blocks  
3. Write more explanation text
4. Show a JSON config using \`\`\`json blocks
5. End with concluding text

Please format your response as markdown text with proper code blocks - do not use any tools.`;

    console.log('📤 Testing text → JS code → text → JSON → text...');
    
    for await (const message of query({
      prompt,
      options: { maxTurns: 1 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          const response = textContent.text;
          
          console.log('✅ Mixed Content Response:');
          console.log('='.repeat(60));
          console.log(response);
          console.log('='.repeat(60));
          
          // Analyze the pattern
          console.log('\n📋 PATTERN ANALYSIS:');
          
          const jsBlocks = (response.match(/```js/g) || []).length;
          const javascriptBlocks = (response.match(/```javascript/g) || []).length;
          const jsonBlocks = (response.match(/```json/g) || []).length;
          const totalBlocks = Math.floor((response.match(/```/g) || []).length / 2);
          
          console.log('• JavaScript blocks: ' + (jsBlocks + javascriptBlocks));
          console.log('• JSON blocks: ' + jsonBlocks);
          console.log('• Total code blocks: ' + totalBlocks);
          
          // Check text between blocks
          const parts = response.split(/```[\s\S]*?```/);
          const textParts = parts.filter(p => p.trim().length > 10);
          console.log('• Text sections: ' + textParts.length);
          
          // Success criteria
          const hasJs = (jsBlocks + javascriptBlocks) > 0;
          const hasJson = jsonBlocks > 0;
          const hasMultipleText = textParts.length >= 3;
          const properPattern = hasJs && hasJson && hasMultipleText;
          
          console.log('\n🎯 SUCCESS CRITERIA:');
          console.log('• Has JavaScript code: ' + (hasJs ? '✅' : '❌'));
          console.log('• Has JSON config: ' + (hasJson ? '✅' : '❌'));
          console.log('• Has multiple text sections: ' + (hasMultipleText ? '✅' : '❌'));
          console.log('• Follows pattern: ' + (properPattern ? '✅' : '❌'));
          
          if (properPattern) {
            console.log('\n🎉 SUCCESS: Mixed content formatting works perfectly!');
            console.log('💡 Pattern: Text → ```js code → Text → ```json → Text ✅');
          } else {
            console.log('\n⚠️  Pattern needs refinement - trying different approach...');
          }
          
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 2: Even simpler request
  console.log('\n\n🔹 Test 2: Simple Mixed Format Request');
  console.log('-'.repeat(40));
  
  try {
    const prompt2 = `Show me a calculator function in JavaScript (use \`\`\`js), then show its configuration as JSON (use \`\`\`json). Add explanation text before, between, and after the code blocks. Do not use any tools - just provide formatted text response.`;

    console.log('📤 Testing simple mixed format...');
    
    for await (const message of query({
      prompt: prompt2,
      options: { maxTurns: 1 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          const response = textContent.text;
          
          console.log('✅ Simple Mixed Response:');
          console.log(response);
          
          const hasJsBlock = response.includes('```js') || response.includes('```javascript');
          const hasJsonBlock = response.includes('```json');
          const hasExplanation = response.split(/```[\s\S]*?```/).length > 2;
          
          console.log('\n📊 SIMPLE TEST RESULTS:');
          console.log('• JavaScript block present: ' + (hasJsBlock ? '✅' : '❌'));
          console.log('• JSON block present: ' + (hasJsonBlock ? '✅' : '❌'));
          console.log('• Has explanatory text: ' + (hasExplanation ? '✅' : '❌'));
          
          if (hasJsBlock && hasJsonBlock && hasExplanation) {
            console.log('\n🎉 SUCCESS: Simple mixed content works!');
          }
          
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Mixed Content Testing Complete!');
  console.log('💡 Testing: Text → Code → Text → JSON → Text patterns');
}

if (import.meta.main) {
  testMixedContentSimple().catch(console.error);
}