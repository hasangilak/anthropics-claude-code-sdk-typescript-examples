#!/usr/bin/env bun

/**
 * ⚡ PREFILL FORMATTING EXAMPLES
 * 
 * This script demonstrates how to use assistant message prefilling to force
 * specific response formatting with the Claude Code SDK. Prefilling is a
 * powerful technique where you start Claude's response to guarantee formatting.
 * 
 * 🎯 FUNCTIONALITY:
 * - Assistant message prefilling for format control
 * - Code block enforcement through prefills
 * - JSON response formatting with prefills
 * - Multi-section response structuring
 * - Template-based prefill patterns
 * 
 * 🔧 PREFILL TECHNIQUES SHOWN:
 * ✅ Code block prefills: "```js" to force JavaScript blocks
 * ✅ JSON prefills: "```json" to force JSON formatting
 * ✅ Structured response prefills with headers
 * ✅ Multi-block prefills for complex responses
 * ✅ Format combination prefills
 * ✅ Template prefill functions
 * 
 * 🧪 HOW TO TEST:
 * 1. Run: `bun run prefill-formatting.ts`
 * 2. Observe how prefills guarantee specific formatting
 * 3. Compare with/without prefill examples
 * 4. Try the template prefill functions
 * 
 * 📋 PREFILL PATTERNS INCLUDED:
 * 1. Simple Code Block Prefills - Force language-specific blocks
 * 2. JSON Response Prefills - Guarantee JSON formatting
 * 3. Structured Response Prefills - Multi-section formatting
 * 4. Explanation + Code Prefills - Consistent explanation patterns
 * 5. Template Prefill Functions - Reusable prefill patterns
 * 
 * ⚠️  IMPORTANT NOTES:
 * - Prefills guarantee the start of the response format
 * - Claude will continue naturally from the prefill
 * - Use prefills when you absolutely need specific formatting
 * - Combine with system messages for best results
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function demonstratePrefillFormatting() {
  console.log('⚡ PREFILL FORMATTING EXAMPLES');
  console.log('='.repeat(60));
  
  // Example 1: Simple Code Block Prefills
  console.log('\n🔹 Example 1: Simple Code Block Prefills');
  console.log('-'.repeat(50));
  
  const messages1: SDKMessage[] = [
    {
      role: "user",
      content: "Create a function that calculates fibonacci numbers"
    },
    {
      role: "assistant", 
      content: "```js\n" // Prefill to force JavaScript code block
    }
  ];

  try {
    console.log('🤖 Using JavaScript code block prefill...');
    console.log('🔧 Prefill used: "```js\\n"');
    
    const result1 = await query({
      messages: messages1,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log('```js');
    console.log(result1.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 2: JSON Response Prefills
  console.log('\n\n🔹 Example 2: JSON Response Prefills');
  console.log('-'.repeat(50));

  const messages2: SDKMessage[] = [
    {
      role: "user",
      content: "Create a configuration object for a React app with theme settings, API endpoints, and feature flags"
    },
    {
      role: "assistant",
      content: "```json\n" // Prefill to force JSON formatting
    }
  ];

  try {
    console.log('🤖 Using JSON prefill...');
    console.log('🔧 Prefill used: "```json\\n"');
    
    const result2 = await query({
      messages: messages2,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log('```json');
    console.log(result2.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 3: Structured Response Prefills
  console.log('\n\n🔹 Example 3: Structured Response Prefills');
  console.log('-'.repeat(50));

  const messages3: SDKMessage[] = [
    {
      role: "user",
      content: "Explain how to connect to a database and show a practical example"
    },
    {
      role: "assistant",
      content: `## Database Connection Guide

### Overview
Here's how to connect to a database using Node.js:

### Code Example
\`\`\`js
` // Structured prefill with explanation + code format
    }
  ];

  try {
    console.log('🤖 Using structured response prefill...');
    console.log('🔧 Prefill includes: headers + code block start');
    
    const result3 = await query({
      messages: messages3,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log('## Database Connection Guide\n\n### Overview\nHere\'s how to connect to a database using Node.js:\n\n### Code Example\n```js');
    console.log(result3.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 4: Multi-Block Response Prefills
  console.log('\n\n🔹 Example 4: Multi-Block Response Prefills');
  console.log('-'.repeat(50));

  const messages4: SDKMessage[] = [
    {
      role: "user",
      content: "Show me a complete REST API example with both the server code and a client request"
    },
    {
      role: "assistant",
      content: `Here's a complete REST API example:

## Server Code (Express.js)
\`\`\`js
`
    }
  ];

  try {
    console.log('🤖 Using multi-block prefill...');
    console.log('🔧 Prefill sets up structure for multiple code blocks');
    
    const result4 = await query({
      messages: messages4,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log('Here\'s a complete REST API example:\n\n## Server Code (Express.js)\n```js');
    console.log(result4.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 5: Python vs JavaScript Prefill Comparison
  console.log('\n\n🔹 Example 5: Language-Specific Prefill Comparison');
  console.log('-'.repeat(50));

  // Python version
  const messagesPython: SDKMessage[] = [
    {
      role: "user",
      content: "Create a function to sort a list of dictionaries by a specific key"
    },
    {
      role: "assistant",
      content: "```python\n"
    }
  ];

  try {
    console.log('🤖 Using Python prefill for sorting function...');
    
    const resultPython = await query({
      messages: messagesPython,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Python Response:');
    console.log('```python');
    console.log(resultPython.content);
  } catch (error) {
    console.error('❌ Python Error:', error);
  }

  // JavaScript version  
  const messagesJS: SDKMessage[] = [
    {
      role: "user",
      content: "Create a function to sort an array of objects by a specific property"
    },
    {
      role: "assistant",
      content: "```js\n"
    }
  ];

  try {
    console.log('\n🤖 Using JavaScript prefill for sorting function...');
    
    const resultJS = await query({
      messages: messagesJS,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ JavaScript Response:');
    console.log('```js');
    console.log(resultJS.content);
  } catch (error) {
    console.error('❌ JavaScript Error:', error);
  }

  console.log('\n\n🎉 Prefill Formatting Demo Complete!');
  console.log('💡 Key Takeaways:');
  console.log('   • Prefills guarantee the start of response formatting');
  console.log('   • Use "```lang\\n" to force specific code blocks');
  console.log('   • Structured prefills work well for complex responses');
  console.log('   • Combine prefills with clear user prompts');
  console.log('   • Template functions make prefills reusable');
}

// Template functions for prefill patterns
export const createCodePrefill = (language: string) => {
  return `\`\`\`${language}\n`;
};

export const createJSONPrefill = () => {
  return "```json\n";
};

export const createExplanationCodePrefill = (title: string, language: string) => {
  return `## ${title}

Here's the implementation:

\`\`\`${language}
`;
};

export const createAPIExamplePrefill = (title: string) => {
  return `# ${title}

## Implementation

\`\`\`js
`;
};

export const createMultiLanguagePrefill = (task: string, primaryLanguage: string) => {
  return `I'll show you how to ${task} in multiple languages.

## ${primaryLanguage.toUpperCase()} Implementation

\`\`\`${primaryLanguage}
`;
};

// Function to create messages with prefill
export const createMessagesWithPrefill = (
  userContent: string, 
  prefill: string
): SDKMessage[] => {
  return [
    { role: "user", content: userContent },
    { role: "assistant", content: prefill }
  ];
};

// Advanced prefill patterns
export const createTutorialPrefill = (topic: string, language: string) => {
  return `# ${topic} Tutorial

## What You'll Learn
In this tutorial, we'll cover how to ${topic.toLowerCase()}.

## Prerequisites
- Basic ${language} knowledge
- Development environment setup

## Step-by-Step Implementation

\`\`\`${language}
`;
};

export const createComparisonPrefill = (concept: string, lang1: string, lang2: string) => {
  return `# ${concept}: ${lang1} vs ${lang2}

## ${lang1} Implementation

\`\`\`${lang1}
`;
};

// Run if called directly
if (import.meta.main) {
  demonstratePrefillFormatting().catch(console.error);
}

export { demonstratePrefillFormatting };