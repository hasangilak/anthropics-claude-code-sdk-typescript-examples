#!/usr/bin/env bun

/**
 * 📝 SYSTEM MESSAGE FORMATTING EXAMPLES
 * 
 * This script demonstrates how to use system messages with the Claude Code SDK
 * to control response formatting, especially for code blocks. System messages
 * are the most reliable way to ensure consistent formatting across all responses.
 * 
 * 🎯 FUNCTIONALITY:
 * - System message examples for code block formatting
 * - Different formatting instruction patterns
 * - Language-specific code block enforcement
 * - JSON/structured response formatting
 * - Markdown formatting control
 * 
 * 🔧 FORMATTING TECHNIQUES SHOWN:
 * ✅ JavaScript code blocks: ```js
 * ✅ JSON formatting: ```json
 * ✅ Python code blocks: ```python
 * ✅ Generic code blocks: ```
 * ✅ Mixed language responses
 * ✅ Structured output formatting
 * 
 * 🧪 HOW TO TEST:
 * 1. Run: `bun run system-message-formatting.ts`
 * 2. Observe how different system messages affect code block formatting
 * 3. Compare responses with and without formatting instructions
 * 4. Try modifying system messages to see different results
 * 
 * 📋 EXAMPLES INCLUDED:
 * 1. Basic Code Block Formatting - Simple language tag enforcement
 * 2. Multi-Language Support - Different languages in one response  
 * 3. JSON Response Formatting - Structured data responses
 * 4. Mixed Content Formatting - Code + explanations with proper blocks
 * 5. Language-Specific Instructions - Tailored formatting per language
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function demonstrateSystemMessageFormatting() {
  console.log('📝 SYSTEM MESSAGE FORMATTING EXAMPLES');
  console.log('='.repeat(60));
  
  // Example 1: Basic Code Block Formatting
  console.log('\n🔹 Example 1: Basic Code Block Formatting');
  console.log('-'.repeat(40));
  
  const messages1: SDKMessage[] = [
    {
      role: "user",
      content: "Create a simple JavaScript function that adds two numbers"
    }
  ];

  const systemMessage1 = "You are a helpful coding assistant. When showing code, always wrap JavaScript in ```js code blocks, JSON in ```json blocks, and Python in ```python blocks. Always include proper language tags for syntax highlighting.";

  try {
    console.log('🤖 Sending request with formatting system message...');
    
    const allMessages: SDKMessage[] = [];
    for await (const message of query({
      prompt: messages1[0].content,
      systemMessage: systemMessage1,
      onPermissionRequest: () => ({ allowed: true }) // Auto-allow for demo
    })) {
      allMessages.push(message);
      if (message.type === 'text') {
        console.log('✅ Response:');
        console.log(message.text);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 2: Multi-Language Support
  console.log('\n\n🔹 Example 2: Multi-Language Code Formatting');
  console.log('-'.repeat(40));

  const messages2: SDKMessage[] = [
    {
      role: "user", 
      content: "Show me the same function in JavaScript, Python, and as JSON config. Make sure each uses proper code blocks."
    }
  ];

  const systemMessage2 = `You are a polyglot programmer. When showing code:
- Wrap JavaScript in \`\`\`js blocks
- Wrap Python in \`\`\`python blocks  
- Wrap JSON in \`\`\`json blocks
- Always include language tags for proper syntax highlighting
- Use clear section headers for each language`;

  try {
    console.log('🤖 Sending multi-language formatting request...');
    
    for await (const message of query({
      prompt: messages2[0].content,
      systemMessage: systemMessage2,
      onPermissionRequest: () => ({ allowed: true })
    })) {
      if (message.type === 'text') {
        console.log('✅ Response:');
        console.log(message.text);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 3: JSON Response Formatting
  console.log('\n\n🔹 Example 3: Structured JSON Response Formatting');
  console.log('-'.repeat(40));

  const messages3: SDKMessage[] = [
    {
      role: "user",
      content: "Create a JSON configuration for a web app with database settings, API keys, and feature flags"
    }
  ];

  const systemMessage3 = `You are a configuration expert. When providing JSON:
- Always wrap JSON in \`\`\`json code blocks
- Format with proper indentation (2 spaces)
- Include comments where helpful using // (even though not valid JSON, it's helpful for examples)
- Structure responses clearly with explanations before code blocks`;

  try {
    console.log('🤖 Sending JSON formatting request...');
    
    for await (const message of query({
      prompt: messages3[0].content,
      systemMessage: systemMessage3,
      onPermissionRequest: () => ({ allowed: true })
    })) {
      if (message.type === 'text') {
        console.log('✅ Response:');
        console.log(message.text);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 4: Mixed Content Formatting
  console.log('\n\n🔹 Example 4: Mixed Content with Consistent Formatting');
  console.log('-'.repeat(40));

  const messages4: SDKMessage[] = [
    {
      role: "user",
      content: "Explain how to make an API call and show examples in curl, JavaScript fetch, and Python requests"
    }
  ];

  const systemMessage4 = `You are a technical tutorial writer. Format all code examples with proper language tags:
- Shell/bash commands in \`\`\`bash blocks
- JavaScript in \`\`\`js blocks
- Python in \`\`\`python blocks
- HTTP responses in \`\`\`json blocks
- Always explain before showing code
- Use clear section headers
- Maintain consistent formatting throughout`;

  try {
    console.log('🤖 Sending mixed content formatting request...');
    
    for await (const message of query({
      prompt: messages4[0].content,
      systemMessage: systemMessage4,
      onPermissionRequest: () => ({ allowed: true })
    })) {
      if (message.type === 'text') {
        console.log('✅ Response:');
        console.log(message.text);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 5: Template System Message
  console.log('\n\n🔹 Example 5: Template System Message for Consistent Formatting');
  console.log('-'.repeat(40));

  // Using the module-level createFormattingSystemMessage function

  const messages5: SDKMessage[] = [
    {
      role: "user",
      content: "Show me how to validate an email address"
    }
  ];

  try {
    console.log('🤖 Using template system message (default: JavaScript)...');
    
    for await (const message of query({
      prompt: messages5[0].content,
      systemMessage: createFormattingSystemMessage("js"),
      onPermissionRequest: () => ({ allowed: true })
    })) {
      if (message.type === 'text') {
        console.log('✅ Response:');
        console.log(message.text);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 System Message Formatting Demo Complete!');
  console.log('💡 Key Takeaways:');
  console.log('   • System messages provide the most consistent formatting control');
  console.log('   • Specify exact code block syntax: ```js, ```json, etc.');
  console.log('   • Include language tag instructions in system message');
  console.log('   • Template system messages work well for repeated patterns');
  console.log('   • Combine formatting rules with content expertise for best results');
}

// Template function (moved to module level)
const createFormattingSystemMessage = (primaryLanguage: string = "js") => {
  return `You are an expert developer and technical writer. Follow these formatting rules:

CODE FORMATTING:
- JavaScript: \`\`\`js
- TypeScript: \`\`\`ts  
- Python: \`\`\`python
- JSON: \`\`\`json
- HTML: \`\`\`html
- CSS: \`\`\`css
- SQL: \`\`\`sql
- Shell: \`\`\`bash
- Generic code: \`\`\`

RESPONSE STRUCTURE:
1. Brief explanation
2. Code example with proper language tag
3. Additional notes if needed

PRIMARY LANGUAGE: ${primaryLanguage}
When the language isn't specified, default to ${primaryLanguage} blocks.

Always use proper syntax highlighting by including language tags in code blocks.`;
};

// Run if called directly
if (import.meta.main) {
  demonstrateSystemMessageFormatting().catch(console.error);
}

export { demonstrateSystemMessageFormatting, createFormattingSystemMessage };