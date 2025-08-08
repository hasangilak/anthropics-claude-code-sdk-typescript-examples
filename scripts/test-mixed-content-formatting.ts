#!/usr/bin/env bun

/**
 * 🧪 TEST MIXED CONTENT FORMATTING
 * 
 * Test complex responses with: text → code block → text → JSON → text
 * This verifies if formatting works in complex mixed content scenarios.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function testMixedContentFormatting() {
  console.log('🧪 TESTING MIXED CONTENT FORMATTING');
  console.log('='.repeat(40));
  
  // Test 1: Complex mixed content request
  console.log('\n🔹 Test 1: Text → Code → Text → JSON → Text Pattern');
  console.log('-'.repeat(50));
  
  try {
    const prompt = `Create a complete user authentication system. Structure your response as:

1. First, explain what we're building (plain text)
2. Show the main login function (JavaScript in \`\`\`js blocks)
3. Explain how the function works (plain text)
4. Show the configuration object (JSON in \`\`\`json blocks)  
5. Finally, add usage notes (plain text)

Make sure to use proper markdown formatting with language tags.`;

    console.log('📤 Testing complex mixed content...');
    
    for await (const message of query({
      prompt,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          const response = textContent.text;
          
          console.log('✅ Full Response:');
          console.log('='.repeat(60));
          console.log(response);
          console.log('='.repeat(60));
          
          // Analyze the structure
          console.log('\n📋 STRUCTURE ANALYSIS:');
          
          // Check for code blocks
          const jsBlocks = (response.match(/```js/g) || []).length;
          const javascriptBlocks = (response.match(/```javascript/g) || []).length;
          const jsonBlocks = (response.match(/```json/g) || []).length;
          const totalCodeBlocks = (response.match(/```/g) || []).length / 2;
          
          console.log('• JavaScript blocks (```js): ' + jsBlocks);
          console.log('• JavaScript blocks (```javascript): ' + javascriptBlocks);
          console.log('• JSON blocks (```json): ' + jsonBlocks);
          console.log(`• Total code blocks: ${Math.floor(totalCodeBlocks)}`);
          
          // Check text sections
          const sections = response.split(/```[\s\S]*?```/);
          const textSections = sections.filter(section => section.trim().length > 10).length;
          console.log(`• Text sections: ${textSections}`);
          
          // Pattern verification
          const hasJsOrJavaScript = jsBlocks > 0 || javascriptBlocks > 0;
          const hasJson = jsonBlocks > 0;
          const hasMultipleSections = textSections >= 3;
          
          console.log('\n🎯 PATTERN VERIFICATION:');
          console.log('• Has JavaScript code: ' + (hasJsOrJavaScript ? '✅' : '❌'));
          console.log('• Has JSON configuration: ' + (hasJson ? '✅' : '❌'));
          console.log('• Has multiple text sections: ' + (hasMultipleSections ? '✅' : '❌'));
          console.log('• Properly formatted blocks: ' + (totalCodeBlocks >= 2 ? '✅' : '❌'));
          
          if (hasJsOrJavaScript && hasJson && hasMultipleSections) {
            console.log('\n🎉 SUCCESS: Mixed content formatting works perfectly!');
          } else {
            console.log('\n⚠️  Partial success - some elements may be missing');
          }
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 2: Even more complex scenario
  console.log('\n\n🔹 Test 2: Super Complex Mixed Content');
  console.log('-'.repeat(40));
  
  try {
    const prompt2 = `Show me how to build a REST API with authentication. I want:

Explanation → JavaScript server code → Description → JSON config → CSS styles → Final notes

Use proper code blocks:
- \`\`\`js for JavaScript
- \`\`\`json for JSON
- \`\`\`css for CSS

Include explanatory text between each code section.`;

    console.log('📤 Testing super complex mixed content...');
    
    for await (const message of query({
      prompt: prompt2,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          const response = textContent.text;
          
          console.log('✅ Super Complex Response:');
          console.log('='.repeat(60));
          console.log(response.substring(0, 800) + '...');
          console.log('='.repeat(60));
          
          // Analyze multiple formats
          const jsBlocks = (response.match(/```js/g) || []).length;
          const javascriptBlocks = (response.match(/```javascript/g) || []).length;
          const jsonBlocks = (response.match(/```json/g) || []).length;
          const cssBlocks = (response.match(/```css/g) || []).length;
          
          console.log('\n📊 MULTI-FORMAT ANALYSIS:');
          console.log('• JavaScript blocks: ' + (jsBlocks + javascriptBlocks));
          console.log('• JSON blocks: ' + jsonBlocks);
          console.log('• CSS blocks: ' + cssBlocks);
          
          const hasMultipleFormats = (jsBlocks + javascriptBlocks > 0) && jsonBlocks > 0 && cssBlocks > 0;
          
          console.log('\n🎯 MULTI-FORMAT SUCCESS:');
          console.log('• All three formats present: ' + (hasMultipleFormats ? '✅' : '❌'));
          
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Test 3: Interleaved content test
  console.log('\n\n🔹 Test 3: Heavily Interleaved Content');
  console.log('-'.repeat(40));
  
  try {
    const prompt3 = `Create a tutorial with this exact pattern:

Step 1 introduction text
→ \`\`\`js code example 1
→ explanation of code 1
→ \`\`\`json configuration 1
→ more explanation text
→ \`\`\`js code example 2  
→ final explanation text
→ \`\`\`json final configuration

Make sure each code block has proper language tags and there's explanatory text between each block.`;

    console.log('📤 Testing heavily interleaved content...');
    
    for await (const message of query({
      prompt: prompt3,
      options: { maxTurns: 2 }
    })) {
      if (message.type === 'assistant' && message.message?.content) {
        const textContent = message.message.content.find(c => c.type === 'text');
        if (textContent) {
          const response = textContent.text;
          
          console.log('✅ Interleaved Response Preview:');
          console.log(response.substring(0, 600) + '...');
          
          // Count alternating patterns
          const codeBlockPattern = response.match(/```[\s\S]*?```/g) || [];
          const blockCount = codeBlockPattern.length;
          
          console.log('\n📈 INTERLEAVING ANALYSIS:');
          console.log('• Total code blocks found: ' + blockCount);
          console.log('• Expected pattern: text-code-text-code-text-code...');
          
          // Check if blocks are properly separated by text
          let properlyInterleaved = true;
          if (blockCount >= 2) {
            const parts = response.split(/```[\s\S]*?```/);
            const nonEmptyTextSections = parts.filter(p => p.trim().length > 20);
            console.log('• Text sections between blocks: ' + nonEmptyTextSections.length);
            properlyInterleaved = nonEmptyTextSections.length >= blockCount - 1;
          }
          
          console.log('• Properly interleaved: ' + (properlyInterleaved ? '✅' : '❌'));
          
          break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Mixed Content Formatting Tests Complete!');
  console.log('💡 Summary: Testing text → code → text → JSON → text patterns');
}

if (import.meta.main) {
  testMixedContentFormatting().catch(console.error);
}