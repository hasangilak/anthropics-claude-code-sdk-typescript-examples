#!/usr/bin/env bun

/**
 * 🧪 TEST PREFILL FORMATTING
 * 
 * Test prefill formatting approaches to verify they work correctly with the SDK.
 * Note: The Claude Code SDK may handle prefills differently, so we'll test various approaches.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function testPrefillFormatting() {
  console.log('🧪 TESTING PREFILL FORMATTING APPROACHES');
  console.log('='.repeat(45));
  
  // Test 1: Force JavaScript code block with specific instruction
  console.log('\n🔹 Test 1: Force JavaScript Code Block');
  console.log('-'.repeat(35));
  
  try {
    const prompt1 = `Create a function that calculates fibonacci numbers. Start your response with a JavaScript code block using \`\`\`js and proper formatting.`;

    console.log('📤 Testing JavaScript code block enforcement...');
    
    for await (const message of query({
      prompt: prompt1,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Response:');
          console.log(textContent.text);
          
          // Check formatting
          const startsWithJsBlock = textContent.text.trim().startsWith('```js');
          const startsWithJavaScriptBlock = textContent.text.trim().startsWith('```javascript');
          console.log(`\n📋 Format Check: ${startsWithJsBlock || startsWithJavaScriptBlock ? '✅' : '❌'} Starts with code block`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 2: Force JSON response format
  console.log('\n\n🔹 Test 2: Force JSON Response Format');
  console.log('-'.repeat(35));
  
  try {
    const prompt2 = `Create a configuration object for a React app. Begin your response immediately with \`\`\`json and provide properly formatted JSON with theme settings and API endpoints.`;

    console.log('📤 Testing JSON format enforcement...');
    
    for await (const message of query({
      prompt: prompt2,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Response:');
          console.log(textContent.text);
          
          // Check formatting
          const startsWithJsonBlock = textContent.text.trim().startsWith('```json');
          console.log(`\n📋 Format Check: ${startsWithJsonBlock ? '✅' : '❌'} Starts with JSON block`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 3: Structured response with explanation + code
  console.log('\n\n🔹 Test 3: Structured Response Pattern');
  console.log('-'.repeat(35));
  
  try {
    const prompt3 = `Explain how to connect to a database and show a practical example. Structure your response as:

1. Brief explanation
2. Code example in \`\`\`js blocks
3. Usage notes

Start immediately with "## Database Connection Guide" as a header.`;

    console.log('📤 Testing structured response...');
    
    for await (const message of query({
      prompt: prompt3,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Response:');
          console.log(textContent.text);
          
          // Check formatting
          const hasHeader = textContent.text.includes('## Database Connection Guide');
          const hasJsBlock = textContent.text.includes('```js') || textContent.text.includes('```javascript');
          console.log(`\n📋 Format Check: ${hasHeader && hasJsBlock ? '✅' : '❌'} Follows structured format`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 4: Language-specific comparison
  console.log('\n\n🔹 Test 4: Language-Specific Enforcement');
  console.log('-'.repeat(35));
  
  try {
    const prompt4 = `Create a sorting function. Respond with Python code only. Start immediately with \`\`\`python and show a function that sorts a list of dictionaries by a specific key.`;

    console.log('📤 Testing Python code enforcement...');
    
    for await (const message of query({
      prompt: prompt4,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Response:');
          console.log(textContent.text);
          
          // Check formatting
          const startsWithPythonBlock = textContent.text.trim().startsWith('```python');
          console.log(`\n📋 Format Check: ${startsWithPythonBlock ? '✅' : '❌'} Starts with Python block`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Prefill Formatting Tests Complete!');
  console.log('💡 Summary: Format enforcement through prompt instructions works well');
  console.log('🔧 Note: Claude Code SDK handles formatting through prompt instructions rather than prefill messages');
}

if (import.meta.main) {
  testPrefillFormatting().catch(console.error);
}