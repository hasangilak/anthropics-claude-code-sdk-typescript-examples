#!/usr/bin/env bun

/**
 * 🔄 CONTEXT-BASED FORMATTING EXAMPLES
 * 
 * This script demonstrates how conversation context affects response formatting
 * and how to maintain consistent formatting across multiple message exchanges
 * with the Claude Code SDK. Context-based formatting is crucial for maintaining
 * format consistency in longer conversations.
 * 
 * 🎯 FUNCTIONALITY:
 * - Multi-message conversation formatting
 * - Context-aware format maintenance  
 * - Format consistency across exchanges
 * - Dynamic format adaptation
 * - Conversation state management
 * 
 * 🔧 CONTEXT TECHNIQUES SHOWN:
 * ✅ Format establishment in conversation history
 * ✅ Format consistency maintenance across messages
 * ✅ Context-based language switching
 * ✅ Progressive format refinement
 * ✅ Multi-turn formatting patterns
 * ✅ Format correction and adjustment
 * 
 * 🧪 HOW TO TEST:
 * 1. Run: `bun run context-formatting.ts`
 * 2. Watch how formatting context is maintained across messages
 * 3. See how previous responses influence future formatting
 * 4. Observe format consistency in multi-turn conversations
 * 
 * 📋 CONTEXT PATTERNS INCLUDED:
 * 1. Format Establishment - Setting format expectations early
 * 2. Format Maintenance - Keeping consistent formatting
 * 3. Language Context Switching - Adapting to different languages
 * 4. Progressive Development - Building on previous formatted responses
 * 5. Format Correction - Fixing and adjusting formatting mid-conversation
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function demonstrateContextFormatting() {
  console.log('🔄 CONTEXT-BASED FORMATTING EXAMPLES');
  console.log('='.repeat(60));
  
  // Example 1: Format Establishment & Maintenance
  console.log('\n🔹 Example 1: Format Establishment & Maintenance');
  console.log('-'.repeat(55));
  
  const conversation1: SDKMessage[] = [
    {
      role: "user",
      content: "Create a simple calculator function in JavaScript. Please use ```js code blocks."
    }
  ];

  let result1: any;
  try {
    console.log('🤖 Turn 1: Establishing format expectations...');
    result1 = await query({
      messages: conversation1,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Claude Response (Turn 1):');
    console.log(result1.content);
    
    // Add Claude's response to conversation
    conversation1.push({
      role: "assistant", 
      content: result1.content
    });
    
    // Follow up - should maintain format
    conversation1.push({
      role: "user",
      content: "Now add error handling to this function"
    });
    
    console.log('\n🤖 Turn 2: Testing format consistency...');
    const result1b = await query({
      messages: conversation1,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Claude Response (Turn 2):');
    console.log(result1b.content);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 2: Language Context Switching
  console.log('\n\n🔹 Example 2: Language Context Switching');
  console.log('-'.repeat(55));

  const conversation2: SDKMessage[] = [
    {
      role: "user",
      content: "Show me how to read a file in Python using ```python blocks"
    }
  ];

  try {
    console.log('🤖 Turn 1: Python context established...');
    const result2a = await query({
      messages: conversation2,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Python Response:');
    console.log(result2a.content);
    
    conversation2.push({
      role: "assistant",
      content: result2a.content
    });
    
    // Switch to JavaScript - context should adapt
    conversation2.push({
      role: "user", 
      content: "Now show me the same thing in JavaScript with proper formatting"
    });
    
    console.log('\n🤖 Turn 2: Switching to JavaScript context...');
    const result2b = await query({
      messages: conversation2,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ JavaScript Response:');
    console.log(result2b.content);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 3: Progressive Format Development
  console.log('\n\n🔹 Example 3: Progressive Format Development');
  console.log('-'.repeat(55));

  const conversation3: SDKMessage[] = [
    {
      role: "user",
      content: "Start building a REST API. First, show me the basic server setup in ```js blocks"
    }
  ];

  try {
    console.log('🤖 Step 1: Basic server setup...');
    const step1 = await query({
      messages: conversation3,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Step 1 Response:');
    console.log(step1.content);
    
    conversation3.push({ role: "assistant", content: step1.content });
    conversation3.push({
      role: "user",
      content: "Now add route handlers for CRUD operations, maintaining the same formatting style"
    });
    
    console.log('\n🤖 Step 2: Adding routes with consistent formatting...');
    const step2 = await query({
      messages: conversation3,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Step 2 Response:');
    console.log(step2.content);
    
    conversation3.push({ role: "assistant", content: step2.content });
    conversation3.push({
      role: "user",
      content: "Finally, show me how to add database integration. Keep the same code formatting pattern"
    });
    
    console.log('\n🤖 Step 3: Database integration with maintained formatting...');
    const step3 = await query({
      messages: conversation3,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Step 3 Response:');
    console.log(step3.content);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 4: Format Correction Mid-Conversation
  console.log('\n\n🔹 Example 4: Format Correction Mid-Conversation');
  console.log('-'.repeat(55));

  const conversation4: SDKMessage[] = [
    {
      role: "user",
      content: "Show me a sorting algorithm"
    }
  ];

  try {
    console.log('🤖 Initial request (no format specified)...');
    const initial = await query({
      messages: conversation4,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Initial Response (may have inconsistent formatting):');
    console.log(initial.content);
    
    conversation4.push({ role: "assistant", content: initial.content });
    conversation4.push({
      role: "user",
      content: "Please reformat your response using proper ```js code blocks with clear comments"
    });
    
    console.log('\n🤖 Format correction requested...');
    const corrected = await query({
      messages: conversation4,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Corrected Response:');
    console.log(corrected.content);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 5: Mixed Format Context Management
  console.log('\n\n🔹 Example 5: Mixed Format Context Management');
  console.log('-'.repeat(55));

  const conversation5: SDKMessage[] = [
    {
      role: "user",
      content: `Create a complete web component example. I need:
1. HTML structure in \`\`\`html blocks
2. CSS styling in \`\`\`css blocks  
3. JavaScript functionality in \`\`\`js blocks
4. JSON configuration in \`\`\`json blocks

Please maintain these formats consistently.`
    }
  ];

  try {
    console.log('🤖 Multi-format component request...');
    const multiFormat = await query({
      messages: conversation5,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Multi-Format Response:');
    console.log(multiFormat.content);
    
    conversation5.push({ role: "assistant", content: multiFormat.content });
    conversation5.push({
      role: "user",
      content: "Now add responsive design features to the CSS and mobile event handling to the JavaScript"
    });
    
    console.log('\n🤖 Extending with maintained format context...');
    const extended = await query({
      messages: conversation5,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Extended Response:');
    console.log(extended.content);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Context Formatting Demo Complete!');
  console.log('💡 Key Takeaways:');
  console.log('   • Previous messages create formatting context');
  console.log('   • Claude maintains format consistency across turns');
  console.log('   • You can correct formatting mid-conversation');
  console.log('   • Context helps with language/format switching');
  console.log('   • Multi-format contexts are preserved well');
  console.log('   • Format establishment early improves consistency');
}

// Helper functions for context-based formatting
export const createFormattedConversationStart = (
  initialRequest: string, 
  formatInstructions: string
): SDKMessage[] => {
  return [
    {
      role: "user",
      content: `${initialRequest}

FORMAT REQUIREMENTS: ${formatInstructions}`
    }
  ];
};

export const addFormattedFollowUp = (
  conversation: SDKMessage[],
  followUp: string,
  maintainFormat: boolean = true
): SDKMessage[] => {
  const newConversation = [...conversation];
  
  if (maintainFormat) {
    newConversation.push({
      role: "user",
      content: `${followUp}

Please maintain the same formatting style as your previous response.`
    });
  } else {
    newConversation.push({
      role: "user",
      content: followUp
    });
  }
  
  return newConversation;
};

export const createFormatCorrectionMessage = (correction: string): SDKMessage => {
  return {
    role: "user",
    content: `Please reformat your previous response: ${correction}`
  };
};

export const createLanguageSwitchMessage = (
  request: string, 
  newLanguage: string,
  maintainStructure: boolean = true
): SDKMessage => {
  const structureNote = maintainStructure 
    ? `Please maintain the same structural format as before, but use \`\`\`${newLanguage} blocks.`
    : '';
    
  return {
    role: "user",
    content: `${request}

${structureNote}`
  };
};

// Context state management helpers
export class ConversationFormatter {
  private messages: SDKMessage[] = [];
  private currentLanguage: string = 'js';
  private formatStyle: string = 'code blocks with language tags';

  constructor(initialLanguage: string = 'js', formatStyle: string = 'code blocks with language tags') {
    this.currentLanguage = initialLanguage;
    this.formatStyle = formatStyle;
  }

  addUserMessage(content: string, includeFormatReminder: boolean = true): void {
    const formatReminder = includeFormatReminder 
      ? `\n\nPlease use ${this.formatStyle} with \`\`\`${this.currentLanguage} syntax.`
      : '';
    
    this.messages.push({
      role: "user",
      content: content + formatReminder
    });
  }

  addAssistantMessage(content: string): void {
    this.messages.push({
      role: "assistant",
      content: content
    });
  }

  switchLanguage(newLanguage: string): void {
    this.currentLanguage = newLanguage;
  }

  getMessages(): SDKMessage[] {
    return [...this.messages];
  }

  setFormatStyle(style: string): void {
    this.formatStyle = style;
  }

  reset(): void {
    this.messages = [];
  }
}

// Run if called directly
if (import.meta.main) {
  demonstrateContextFormatting().catch(console.error);
}

export { 
  demonstrateContextFormatting,
  createFormattedConversationStart,
  addFormattedFollowUp,
  createFormatCorrectionMessage,
  createLanguageSwitchMessage,
  ConversationFormatter
};