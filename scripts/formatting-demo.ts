#!/usr/bin/env bun

/**
 * 🎯 COMPREHENSIVE FORMATTING DEMO
 * 
 * This script provides a complete demonstration of all Claude Code SDK response
 * formatting techniques. It combines system messages, prompt engineering, prefills,
 * and context management to show the most effective ways to format Claude's responses.
 * 
 * 🎯 FUNCTIONALITY:
 * - Interactive demo of all formatting techniques
 * - Side-by-side comparison of different approaches
 * - Real-time formatting examples with user input
 * - Template functions for common patterns
 * - Best practice recommendations
 * 
 * 🔧 ALL TECHNIQUES DEMONSTRATED:
 * ✅ System Message Formatting - Consistent format control
 * ✅ Prompt Engineering - Direct format instructions
 * ✅ Prefill Responses - Guaranteed format starts
 * ✅ Context Formatting - Multi-turn consistency
 * ✅ Template Functions - Reusable patterns
 * ✅ Mixed Format Responses - Multiple languages/formats
 * 
 * 🧪 HOW TO USE:
 * 1. Interactive Mode: `bun run formatting-demo.ts`
 * 2. Quick Demo: `bun run formatting-demo.ts demo`
 * 3. Comparison Mode: `bun run formatting-demo.ts compare`
 * 4. Template Test: `bun run formatting-demo.ts templates`
 * 
 * 📋 INTERACTIVE COMMANDS:
 * - demo - Run quick demonstration of all techniques
 * - compare - Side-by-side comparison of formatting methods
 * - templates - Test template functions
 * - custom - Test your own prompts with different techniques
 * - best - Show best practices and recommendations
 * - help - Show all available commands
 * - exit - Exit the demo
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

// Import template functions from other examples
import { createFormattingSystemMessage } from "./system-message-formatting";
import { createCodePrompt, createApiDocPrompt } from "./prompt-formatting-examples";  
import { createCodePrefill, createExplanationCodePrefill } from "./prefill-formatting";
import { ConversationFormatter } from "./context-formatting";

class FormattingDemo {
  private rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  async runInteractiveDemo() {
    console.log('🎯 COMPREHENSIVE CLAUDE CODE SDK FORMATTING DEMO');
    console.log('='.repeat(65));
    console.log('🚀 Interactive mode started!');
    console.log('💡 Type "help" for available commands or "demo" for quick start\n');
    
    while (true) {
      const command = await this.askQuestion('🎯 Enter command: ');
      
      switch (command.toLowerCase().trim()) {
        case 'demo':
          await this.runQuickDemo();
          break;
        case 'compare':
          await this.runComparison();
          break;
        case 'templates':
          await this.testTemplates();
          break;
        case 'custom':
          await this.runCustomTest();
          break;
        case 'best':
          this.showBestPractices();
          break;
        case 'help':
          this.showHelp();
          break;
        case 'exit':
          console.log('👋 Goodbye!');
          this.rl.close();
          return;
        default:
          console.log('❓ Unknown command. Type "help" for available commands.');
      }
      
      console.log('\n' + '-'.repeat(50) + '\n');
    }
  }

  async runQuickDemo() {
    console.log('🚀 QUICK DEMO: All Formatting Techniques');
    console.log('='.repeat(45));
    
    const request = "Create a function that validates an email address";
    
    // 1. System Message Approach
    console.log('\n🔹 Technique 1: System Message Formatting');
    const systemMessages: SDKMessage[] = [
      { role: "user", content: request }
    ];
    
    try {
      const systemResult = await query({
        messages: systemMessages,
        systemMessage: createFormattingSystemMessage("js"),
        onPermissionRequest: () => ({ allowed: true })
      });
      
      console.log('✅ System Message Result:');
      console.log(systemResult.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
    
    // 2. Prompt Engineering Approach
    console.log('\n🔹 Technique 2: Prompt Engineering');
    const promptMessages: SDKMessage[] = [
      { role: "user", content: createCodePrompt(request, "js", false) }
    ];
    
    try {
      const promptResult = await query({
        messages: promptMessages,
        onPermissionRequest: () => ({ allowed: true })
      });
      
      console.log('✅ Prompt Engineering Result:');
      console.log(promptResult.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
    
    // 3. Prefill Approach
    console.log('\n🔹 Technique 3: Prefill Response');
    const prefillMessages: SDKMessage[] = [
      { role: "user", content: request },
      { role: "assistant", content: createExplanationCodePrefill("Email Validation Function", "js") }
    ];
    
    try {
      const prefillResult = await query({
        messages: prefillMessages,
        onPermissionRequest: () => ({ allowed: true })
      });
      
      console.log('✅ Prefill Result:');
      console.log(createExplanationCodePrefill("Email Validation Function", "js") + prefillResult.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async runComparison() {
    console.log('⚖️  COMPARISON: Different Formatting Methods');
    console.log('='.repeat(50));
    
    const testPrompt = await this.askQuestion('Enter a coding request to test: ');
    const language = await this.askQuestion('Preferred language (js/python/etc): ') || 'js';
    
    console.log(`\n🧪 Testing: "${testPrompt}" in ${language}`);
    console.log('=' .repeat(60));
    
    // Method 1: No special formatting
    console.log('\n📊 Method 1: No Special Formatting');
    try {
      const basic = await query({
        messages: [{ role: "user", content: testPrompt }],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('Result:', basic.content);
    } catch (error) {
      console.error('Error:', error);
    }
    
    // Method 2: System message
    console.log('\n📊 Method 2: System Message Formatting');
    try {
      const system = await query({
        messages: [{ role: "user", content: testPrompt }],
        systemMessage: createFormattingSystemMessage(language),
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('Result:', system.content);
    } catch (error) {
      console.error('Error:', error);
    }
    
    // Method 3: Prefill
    console.log('\n📊 Method 3: Prefill Formatting');
    try {
      const prefill = await query({
        messages: [
          { role: "user", content: testPrompt },
          { role: "assistant", content: createCodePrefill(language) }
        ],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('Result:', createCodePrefill(language) + prefill.content);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async testTemplates() {
    console.log('🧪 TEMPLATE FUNCTIONS TEST');
    console.log('='.repeat(35));
    
    console.log('\n🔧 Available Template Functions:');
    console.log('1. Code Function Template');
    console.log('2. API Documentation Template');
    console.log('3. Tutorial Template');
    console.log('4. Multi-language Template');
    
    const choice = await this.askQuestion('Choose template (1-4): ');
    
    switch (choice) {
      case '1':
        await this.testCodeTemplate();
        break;
      case '2':
        await this.testApiTemplate();
        break;
      case '3':
        await this.testTutorialTemplate();
        break;
      case '4':
        await this.testMultiLanguageTemplate();
        break;
      default:
        console.log('Invalid choice');
    }
  }

  async testCodeTemplate() {
    const task = await this.askQuestion('Enter coding task: ');
    const language = await this.askQuestion('Language: ') || 'js';
    const includeTests = (await this.askQuestion('Include tests? (y/n): ')) === 'y';
    
    console.log('\n🧪 Testing Code Template...');
    const prompt = createCodePrompt(task, language, includeTests);
    console.log('Generated Prompt:', prompt);
    
    try {
      const result = await query({
        messages: [{ role: "user", content: prompt }],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Template Result:');
      console.log(result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testApiTemplate() {
    const endpoint = await this.askQuestion('API endpoint (e.g., /api/users): ');
    const method = await this.askQuestion('HTTP method (GET/POST/etc): ') || 'GET';
    
    console.log('\n🧪 Testing API Template...');
    const prompt = createApiDocPrompt(endpoint, method);
    console.log('Generated Prompt:', prompt);
    
    try {
      const result = await query({
        messages: [{ role: "user", content: prompt }],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Template Result:');
      console.log(result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testTutorialTemplate() {
    const topic = await this.askQuestion('Tutorial topic: ');
    const language = await this.askQuestion('Primary language: ') || 'js';
    
    const tutorialPrefill = `# ${topic} Tutorial

## What You'll Learn
In this tutorial, we'll cover how to ${topic.toLowerCase()}.

## Prerequisites
- Basic ${language} knowledge
- Development environment setup

## Step-by-Step Implementation

\`\`\`${language}
`;

    console.log('\n🧪 Testing Tutorial Template...');
    
    try {
      const result = await query({
        messages: [
          { role: "user", content: `Create a comprehensive tutorial about ${topic}` },
          { role: "assistant", content: tutorialPrefill }
        ],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Tutorial Result:');
      console.log(tutorialPrefill + result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testMultiLanguageTemplate() {
    const task = await this.askQuestion('Task to implement: ');
    const languages = await this.askQuestion('Languages (comma-separated): ') || 'js,python';
    const langArray = languages.split(',').map(l => l.trim());
    
    const multiLangPrompt = `Show me how to ${task} in multiple languages.

Please provide implementations in:
${langArray.map(lang => `- ${lang}: Use \`\`\`${lang} blocks`).join('\n')}

Structure your response with clear section headers for each language.`;

    console.log('\n🧪 Testing Multi-Language Template...');
    
    try {
      const result = await query({
        messages: [{ role: "user", content: multiLangPrompt }],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Multi-Language Result:');
      console.log(result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async runCustomTest() {
    console.log('🎨 CUSTOM FORMAT TESTING');
    console.log('='.repeat(30));
    
    const prompt = await this.askQuestion('Enter your prompt: ');
    const technique = await this.askQuestion('Technique (system/prompt/prefill/context): ');
    const language = await this.askQuestion('Target language: ') || 'js';
    
    switch (technique.toLowerCase()) {
      case 'system':
        await this.testCustomSystem(prompt, language);
        break;
      case 'prompt':
        await this.testCustomPrompt(prompt, language);
        break;
      case 'prefill':
        await this.testCustomPrefill(prompt, language);
        break;
      case 'context':
        await this.testCustomContext(prompt, language);
        break;
      default:
        console.log('Unknown technique');
    }
  }

  async testCustomSystem(prompt: string, language: string) {
    try {
      const result = await query({
        messages: [{ role: "user", content: prompt }],
        systemMessage: createFormattingSystemMessage(language),
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Custom System Result:');
      console.log(result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testCustomPrompt(prompt: string, language: string) {
    const formattedPrompt = `${prompt}

Please format your response using:
- \`\`\`${language} blocks for code
- Clear explanations
- Proper syntax highlighting`;

    try {
      const result = await query({
        messages: [{ role: "user", content: formattedPrompt }],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Custom Prompt Result:');
      console.log(result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testCustomPrefill(prompt: string, language: string) {
    try {
      const result = await query({
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: createCodePrefill(language) }
        ],
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Custom Prefill Result:');
      console.log(createCodePrefill(language) + result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testCustomContext(prompt: string, language: string) {
    const formatter = new ConversationFormatter(language);
    formatter.addUserMessage(prompt, true);
    
    try {
      const result = await query({
        messages: formatter.getMessages(),
        onPermissionRequest: () => ({ allowed: true })
      });
      console.log('\n✅ Custom Context Result:');
      console.log(result.content);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  showBestPractices() {
    console.log('🏆 FORMATTING BEST PRACTICES');
    console.log('='.repeat(35));
    
    console.log(`
📋 WHEN TO USE EACH TECHNIQUE:

🔧 System Messages:
  ✅ For consistent formatting across entire conversations
  ✅ When you want to set default behavior
  ✅ For applications with repeated interactions

💬 Prompt Engineering:
  ✅ For one-off specific formatting needs  
  ✅ When format requirements vary by request
  ✅ For explicit format specifications

⚡ Prefills:
  ✅ When you absolutely need guaranteed format start
  ✅ For complex structured responses
  ✅ When other methods don't give consistent results

🔄 Context Formatting:
  ✅ For maintaining consistency in long conversations
  ✅ When building on previous formatted responses
  ✅ For progressive development workflows

🎯 COMBINATION STRATEGIES:

🏆 Ultimate Approach:
  System Message + Prefill = Maximum consistency

🚀 Quick Development:
  Prompt Engineering = Fast and flexible

💪 Complex Workflows:
  Context Management = Progressive formatting

🛡️ COMMON PITFALLS:
  ❌ Don't mix formatting instructions across methods
  ❌ Don't assume Claude will remember format preferences
  ❌ Don't use overly complex formatting requirements
  ✅ Be explicit and consistent with format instructions
  ✅ Test different approaches to find what works best
  ✅ Use template functions for repeated patterns
`);
  }

  showHelp() {
    console.log('❓ AVAILABLE COMMANDS');
    console.log('='.repeat(25));
    
    console.log(`
🎯 COMMANDS:
  demo      - Quick demonstration of all techniques
  compare   - Side-by-side comparison of methods
  templates - Test template functions  
  custom    - Test your own prompts
  best      - Show best practices
  help      - Show this help message
  exit      - Exit the demo

💡 TIP: Start with "demo" to see all techniques in action!
`);
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const demo = new FormattingDemo();
  
  if (args.length === 0) {
    await demo.runInteractiveDemo();
  } else {
    switch (args[0]) {
      case 'demo':
        await demo.runQuickDemo();
        break;
      case 'compare':
        await demo.runComparison();
        break;
      case 'templates':
        await demo.testTemplates();
        break;
      case 'best':
        demo.showBestPractices();
        break;
      default:
        console.log('Unknown argument. Use: demo, compare, templates, or best');
    }
  }
  
  process.exit(0);
}

if (import.meta.main) {
  main().catch(console.error);
}

export { FormattingDemo };