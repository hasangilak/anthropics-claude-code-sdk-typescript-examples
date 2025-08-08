#!/usr/bin/env bun

/**
 * 📊 TEST FORMATTING OUTPUT
 * 
 * Test Claude's response formatting by using a simple request
 * that should produce code blocks, then analyze the output.
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function testFormattingOutput() {
  console.log('📊 TESTING CLAUDE FORMATTING OUTPUT');
  console.log('=' .repeat(40));
  
  try {
    console.log('📤 Sending request to Claude...');
    
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();
    
    // Simple request asking for formatted code
    const prompt = `Create a JavaScript function called "addNumbers" that takes two parameters and returns their sum. Show the code using proper markdown code blocks with language tags.`;

    console.log(`   Prompt: ${prompt}\n`);

    // Use the exact same pattern as the working simple-claude-test.ts
    for await (const message of query({
      prompt,
      abortController,
      options: { 
        maxTurns: 3
      }
    })) {
      messages.push(message);
      
      console.log(`📨 Message type: ${message.type}`);
      
      if (message.type === 'assistant') {
        console.log('📥 Assistant message:', JSON.stringify(message, null, 2));
        
        // Extract text content from assistant message
        if (message.message && message.message.content && Array.isArray(message.message.content)) {
          const textContent = message.message.content.find(c => c.type === 'text');
          if (textContent) {
            console.log('📝 Text content found:');
            console.log('-'.repeat(50));
            console.log(textContent.text);
            console.log('-'.repeat(50));
            
            // Analyze the formatting
            console.log('\n📋 FORMATTING ANALYSIS:');
            
            const text = textContent.text;
            const hasGenericCodeBlock = text.includes('```');
            const hasJsCodeBlock = text.includes('```js');
            const hasJavaScriptCodeBlock = text.includes('```javascript');
            const hasProperClosing = (text.match(/```/g) || []).length >= 2;
            
            console.log(`• Contains code blocks (\`\`\`): ${hasGenericCodeBlock ? '✅' : '❌'}`);
            console.log(`• Has JavaScript blocks (\`\`\`js): ${hasJsCodeBlock ? '✅' : '❌'}`);  
            console.log(`• Has JavaScript blocks (\`\`\`javascript): ${hasJavaScriptCodeBlock ? '✅' : '❌'}`);
            console.log(`• Properly closed code blocks: ${hasProperClosing ? '✅' : '❌'}`);
            
            // Overall assessment
            console.log('\n🎯 OVERALL ASSESSMENT:');
            if (hasJsCodeBlock || hasJavaScriptCodeBlock) {
              console.log('✅ SUCCESS: Claude used proper JavaScript code blocks!');
            } else if (hasGenericCodeBlock) {
              console.log('⚠️  PARTIAL: Claude used code blocks but without language tags');
            } else {
              console.log('❌ ISSUE: Claude did not use proper code block formatting');
            }
          }
        }
      } else if (message.type === 'text') {
        console.log('📥 Assistant response:');
        console.log('-'.repeat(50));
        console.log(message.text);
        console.log('-'.repeat(50));
        
        // Analyze the formatting
        console.log('\n📋 FORMATTING ANALYSIS:');
        
        // Check for various code block patterns
        const hasGenericCodeBlock = message.text.includes('```');
        const hasJsCodeBlock = message.text.includes('```js');
        const hasJavaScriptCodeBlock = message.text.includes('```javascript');
        const hasProperClosing = (message.text.match(/```/g) || []).length >= 2;
        
        console.log(`• Contains code blocks (\`\`\`): ${hasGenericCodeBlock ? '✅' : '❌'}`);
        console.log(`• Has JavaScript blocks (\`\`\`js): ${hasJsCodeBlock ? '✅' : '❌'}`);  
        console.log(`• Has JavaScript blocks (\`\`\`javascript): ${hasJavaScriptCodeBlock ? '✅' : '❌'}`);
        console.log(`• Properly closed code blocks: ${hasProperClosing ? '✅' : '❌'}`);
        
        // Count code blocks
        const codeBlockCount = (message.text.match(/```/g) || []).length / 2;
        console.log(`• Number of code blocks: ${Math.floor(codeBlockCount)}`);
        
        // Extract code blocks for analysis
        const codeBlocks = message.text.match(/```[\s\S]*?```/g) || [];
        if (codeBlocks.length > 0) {
          console.log('\n🔍 CODE BLOCKS FOUND:');
          codeBlocks.forEach((block, index) => {
            const firstLine = block.split('\n')[0];
            const language = firstLine.replace('```', '').trim();
            console.log(`   Block ${index + 1}: ${firstLine} (language: "${language || 'none'}")`);
          });
        }
        
        // Overall assessment
        console.log('\n🎯 OVERALL ASSESSMENT:');
        if (hasJsCodeBlock || hasJavaScriptCodeBlock) {
          console.log('✅ SUCCESS: Claude used proper JavaScript code blocks!');
          console.log('   Format follows markdown standards with language tags');
        } else if (hasGenericCodeBlock) {
          console.log('⚠️  PARTIAL: Claude used code blocks but without language tags');
          console.log('   May need more explicit formatting instructions');
        } else {
          console.log('❌ ISSUE: Claude did not use proper code block formatting');
          console.log('   Formatting instructions may not be working');
        }
        
        break; // Exit after first text response
      }
      
      if (message.type === 'message') {
        console.log(`🔧 ${message.role}: ${JSON.stringify(message.content, null, 2)}`);
      }
    }
    
    console.log(`\n🏁 Test completed!`);
    console.log(`   Messages received: ${messages.length}`);
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

if (import.meta.main) {
  testFormattingOutput().catch(console.error);
}