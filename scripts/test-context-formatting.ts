#!/usr/bin/env bun

/**
 * 🧪 TEST CONTEXT FORMATTING
 * 
 * Test how formatting context is maintained across multiple interactions.
 * This tests conversation memory and format consistency.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function testContextFormatting() {
  console.log('🧪 TESTING CONTEXT-BASED FORMATTING');
  console.log('='.repeat(40));
  
  // Test 1: Format establishment and maintenance
  console.log('\n🔹 Test 1: Format Establishment & Maintenance');
  console.log('-'.repeat(45));
  
  try {
    // First request establishes format
    const prompt1 = "Create a simple calculator function in JavaScript. Please use ```js code blocks with proper formatting.";
    
    console.log('📤 Turn 1: Establishing format expectations...');
    let firstResponse = '';
    
    for await (const message of query({
      prompt: prompt1,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Response:');
          console.log(textContent.text);
          firstResponse = textContent.text;
          
          const hasJsBlock = textContent.text.includes('```js') || textContent.text.includes('```javascript');
          console.log(`\n📋 Format Check: ${hasJsBlock ? '✅' : '❌'} Uses JavaScript code blocks`);
          break;
        }
      }
    }
    
    // Follow-up request to test format maintenance
    console.log('\n📤 Turn 2: Testing format consistency...');
    const prompt2 = "Now add error handling to this calculator function";
    
    for await (const message of query({
      prompt: `Previous conversation: I asked for a calculator function and you provided:
${firstResponse}

${prompt2}`,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Follow-up Response:');
          console.log(textContent.text);
          
          const hasJsBlock = textContent.text.includes('```js') || textContent.text.includes('```javascript');
          console.log(`\n📋 Format Consistency: ${hasJsBlock ? '✅' : '❌'} Maintains JavaScript blocks`);
          break;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 2: Language switching with context
  console.log('\n\n🔹 Test 2: Language Context Switching');
  console.log('-'.repeat(35));
  
  try {
    const prompt3 = "Show me how to read a file in Python using ```python blocks";
    
    console.log('📤 Python context request...');
    let pythonResponse = '';
    
    for await (const message of query({
      prompt: prompt3,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Python Response:');
          console.log(textContent.text.substring(0, 200) + '...');
          pythonResponse = textContent.text;
          
          const hasPythonBlock = textContent.text.includes('```python');
          console.log(`\n📋 Format Check: ${hasPythonBlock ? '✅' : '❌'} Uses Python blocks`);
          break;
        }
      }
    }
    
    // Switch to JavaScript with context
    console.log('\n📤 Switching to JavaScript context...');
    const prompt4 = "Now show me the same thing in JavaScript with proper formatting";
    
    for await (const message of query({
      prompt: `Context: You just showed me Python file reading:
${pythonResponse.substring(0, 300)}...

${prompt4}`,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ JavaScript Response:');
          console.log(textContent.text.substring(0, 200) + '...');
          
          const hasJsBlock = textContent.text.includes('```js') || textContent.text.includes('```javascript');
          console.log(`\n📋 Format Adaptation: ${hasJsBlock ? '✅' : '❌'} Adapts to JavaScript blocks`);
          break;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 3: Progressive format development
  console.log('\n\n🔹 Test 3: Progressive Format Development');
  console.log('-'.repeat(35));
  
  try {
    const prompt5 = "Start building a REST API. First, show me the basic server setup in ```js blocks";
    
    console.log('📤 Step 1: Basic server setup...');
    let serverResponse = '';
    
    for await (const message of query({
      prompt: prompt5,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Step 1 Response:');
          console.log(textContent.text.substring(0, 300) + '...');
          serverResponse = textContent.text;
          break;
        }
      }
    }
    
    // Build on the previous step
    console.log('\n📤 Step 2: Adding routes with maintained formatting...');
    const prompt6 = "Now add route handlers for CRUD operations, maintaining the same formatting style";
    
    for await (const message of query({
      prompt: `Building on the server setup you provided:
${serverResponse.substring(0, 400)}...

${prompt6}`,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Step 2 Response:');
          console.log(textContent.text.substring(0, 300) + '...');
          
          const hasJsBlock = textContent.text.includes('```js') || textContent.text.includes('```javascript');
          console.log(`\n📋 Progressive Consistency: ${hasJsBlock ? '✅' : '❌'} Maintains format in progression`);
          break;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Context Formatting Tests Complete!');
  console.log('💡 Summary: Context-based formatting works through explicit prompt context');
  console.log('🔧 Note: Each request is independent, so context must be provided in prompts');
}

if (import.meta.main) {
  testContextFormatting().catch(console.error);
}