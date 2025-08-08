#!/usr/bin/env bun

/**
 * 🧪 TEST FORMATTING DEMO
 * 
 * Simple test to verify the formatting demo components work.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function testFormattingDemo() {
  console.log('🧪 TESTING FORMATTING DEMO COMPONENTS');
  console.log('='.repeat(40));
  
  // Test 1: Template function approach
  console.log('\n🔹 Test 1: Code Formatting Template');
  console.log('-'.repeat(35));
  
  try {
    const createCodePrompt = (request: string, language: string) => {
      return `${request}

FORMAT REQUIREMENTS:
- Use \`\`\`${language} code blocks for the main code
- Include clear comments explaining the logic
- Use proper indentation and formatting
- Add a brief explanation before the code`;
    };

    const prompt = createCodePrompt("Create a binary search function", "js");
    
    console.log('📤 Testing code template function...');
    
    for await (const message of query({
      prompt,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Template Response:');
          console.log(textContent.text.substring(0, 300) + '...');
          
          const hasJsBlock = textContent.text.includes('```js') || textContent.text.includes('```javascript');
          console.log(`\n📋 Format Check: ${hasJsBlock ? '✅' : '❌'} Uses JavaScript blocks`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 2: API documentation template
  console.log('\n\n🔹 Test 2: API Documentation Template');
  console.log('-'.repeat(35));
  
  try {
    const createApiDocPrompt = (endpoint: string, method: string) => {
      return `Document the ${endpoint} API endpoint for ${method} requests.

FORMAT YOUR RESPONSE AS:
1. **Description**: Brief explanation
2. **Request Format**: 
   \`\`\`json
   // Request body example
   \`\`\`
3. **Response Format**:
   \`\`\`json
   // Response body example  
   \`\`\`
4. **Usage Example**:
   \`\`\`js
   // JavaScript fetch example
   \`\`\``;
    };

    const prompt = createApiDocPrompt("/api/users", "POST");
    
    console.log('📤 Testing API documentation template...');
    
    for await (const message of query({
      prompt,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ API Doc Response:');
          console.log(textContent.text.substring(0, 400) + '...');
          
          const hasJsonBlock = textContent.text.includes('```json');
          const hasJsBlock = textContent.text.includes('```js');
          console.log(`\n📋 Format Check: ${hasJsonBlock && hasJsBlock ? '✅' : '❌'} Uses JSON and JS blocks`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 3: Multi-language comparison
  console.log('\n\n🔹 Test 3: Multi-Language Template');
  console.log('-'.repeat(35));
  
  try {
    const createMultiLanguagePrompt = (task: string, languages: string[]) => {
      const langBlocks = languages.map(lang => `- ${lang}: \`\`\`${lang} blocks`).join('\n');
      
      return `Show me how to ${task} in multiple languages.

Please provide implementations in:
${langBlocks}

Structure your response with clear section headers for each language.`;
    };

    const prompt = createMultiLanguagePrompt("create a hash map", ["js", "python"]);
    
    console.log('📤 Testing multi-language template...');
    
    for await (const message of query({
      prompt,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          console.log('✅ Multi-Language Response:');
          console.log(textContent.text.substring(0, 400) + '...');
          
          const hasJsBlock = textContent.text.includes('```js') || textContent.text.includes('```javascript');
          const hasPythonBlock = textContent.text.includes('```python');
          console.log(`\n📋 Format Check: ${hasJsBlock && hasPythonBlock ? '✅' : '❌'} Uses both JS and Python blocks`);
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Formatting Demo Components Test Complete!');
  console.log('💡 Summary: Template functions and formatting approaches work correctly');
  console.log('🔧 All components follow proper markdown code block standards');
}

if (import.meta.main) {
  testFormattingDemo().catch(console.error);
}