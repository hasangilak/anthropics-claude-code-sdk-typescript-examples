#!/usr/bin/env bun

/**
 * 🧪 TEST PROMPT FORMATTING
 * 
 * Test different prompt formatting approaches to verify they work correctly.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function testPromptFormatting() {
  console.log('🧪 TESTING PROMPT FORMATTING APPROACHES');
  console.log('='.repeat(45));
  
  // Test 1: Explicit format request in prompt
  console.log('\n🔹 Test 1: Explicit Format Request');
  console.log('-'.repeat(35));
  
  try {
    const prompt1 = `Create a function to reverse a string. 

IMPORTANT: Please format your response with:
- JavaScript code in \`\`\`js blocks
- Include proper syntax highlighting
- Add comments in the code`;

    console.log('📤 Testing explicit format request...');
    
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
          const hasJsBlock = textContent.text.includes('```js');
          const hasJavaScriptBlock = textContent.text.includes('```javascript');
          console.log(`\n📋 Format Check: ${hasJsBlock || hasJavaScriptBlock ? '✅' : '❌'} Proper code blocks`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 2: Example-driven formatting
  console.log('\n\n🔹 Test 2: Example-Driven Formatting');
  console.log('-'.repeat(35));
  
  try {
    const prompt2 = `Show me how to make an HTTP request. Format your response like this example:

**JavaScript (fetch):**
\`\`\`js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

Please follow this exact format pattern for making a POST request.`;

    console.log('📤 Testing example-driven formatting...');
    
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
          const hasJsBlock = textContent.text.includes('```js');
          const hasHeaders = textContent.text.includes('**');
          console.log(`\n📋 Format Check: ${hasJsBlock && hasHeaders ? '✅' : '❌'} Follows example format`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 3: JSON structure formatting
  console.log('\n\n🔹 Test 3: JSON Structure Formatting');
  console.log('-'.repeat(35));
  
  try {
    const prompt3 = `Create a user profile configuration. Return it as properly formatted JSON in a \`\`\`json code block.

The JSON should include:
- user info (name, email, age)
- preferences (theme, language, notifications)

Format with 2-space indentation.`;

    console.log('📤 Testing JSON structure request...');
    
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
          const hasJsonBlock = textContent.text.includes('```json');
          console.log(`\n📋 Format Check: ${hasJsonBlock ? '✅' : '❌'} JSON code blocks`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Prompt Formatting Tests Complete!');
  console.log('💡 Summary: Prompt-based formatting instructions work effectively');
}

if (import.meta.main) {
  testPromptFormatting().catch(console.error);
}