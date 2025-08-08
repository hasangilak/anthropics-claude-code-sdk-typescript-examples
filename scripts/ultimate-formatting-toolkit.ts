#!/usr/bin/env bun

/**
 * 🎯 ULTIMATE FORMATTING TOOLKIT
 * 
 * The complete, all-in-one Claude Code SDK formatting solution.
 * This script combines ALL formatting techniques into a single, comprehensive toolkit
 * with templates, helpers, and interactive features for perfect code block formatting.
 * 
 * 🚀 ALL FEATURES INCLUDED:
 * ✅ System Message Templates - Pre-built formatting system messages
 * ✅ Prompt Engineering Helpers - Ready-to-use prompt templates
 * ✅ Prefill-Style Enforcement - Force specific formatting patterns
 * ✅ Context Management - Multi-turn conversation formatting
 * ✅ Mixed Content Support - Text → Code → Text → JSON → Text patterns
 * ✅ Multi-Language Support - JS, Python, JSON, CSS, HTML, SQL, etc.
 * ✅ Interactive CLI - Test and experiment with different approaches
 * ✅ Template Library - Reusable formatting patterns
 * ✅ Validation Tools - Check if responses follow markdown standards
 * 
 * 🎯 USAGE:
 * Interactive Mode: `bun run ultimate-formatting-toolkit.ts`
 * Quick Test: `bun run ultimate-formatting-toolkit.ts test`
 * Examples: `bun run ultimate-formatting-toolkit.ts examples`
 * Help: `bun run ultimate-formatting-toolkit.ts help`
 * 
 * 💡 PERFECT FOR:
 * - Production applications requiring consistent formatting
 * - Learning all Claude Code SDK formatting techniques
 * - Quick prototyping with proper code blocks
 * - Building formatting-aware chatbots and tools
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

// ============================================================================
// SYSTEM MESSAGE TEMPLATES
// ============================================================================

export const SystemMessageTemplates = {
  // General purpose formatting
  standard: (primaryLang: string = "js") => `You are an expert developer and technical writer. Always format code responses with proper markdown:

CODE FORMATTING RULES:
- JavaScript: \`\`\`js or \`\`\`javascript
- TypeScript: \`\`\`ts or \`\`\`typescript
- Python: \`\`\`python
- JSON: \`\`\`json (with 2-space indentation)
- HTML: \`\`\`html
- CSS: \`\`\`css
- SQL: \`\`\`sql
- Shell/Bash: \`\`\`bash
- Generic code: \`\`\`

RESPONSE STRUCTURE:
1. Brief explanation (if needed)
2. Code examples with proper language tags
3. Additional context (if helpful)

Primary language: ${primaryLang}
Always include proper syntax highlighting with language tags.`,

  // Strict formatting for production
  strict: (languages: string[] = ["js", "json"]) => `You are a code formatting specialist. Follow these MANDATORY rules:

STRICT FORMATTING REQUIREMENTS:
${languages.map(lang => `- ${lang.toUpperCase()}: Always use \`\`\`${lang} blocks`).join('\n')}

CONTENT RULES:
- Every code example MUST have language tags
- Use proper indentation (2 spaces for JSON, standard for others)
- Include comments in code when helpful
- Separate code blocks with explanatory text

VIOLATION = FAILURE. Always follow these formatting rules exactly.`,

  // Mixed content specialist
  mixedContent: () => `You are a technical documentation expert specializing in mixed content responses.

MIXED CONTENT FORMATTING:
- Combine explanatory text with code blocks seamlessly
- Use proper markdown headers (## ###) for sections
- Format code with appropriate language tags
- Support text → code → text → code patterns
- Include examples in multiple formats when requested

SUPPORTED FORMATS:
- Code: \`\`\`js \`\`\`python \`\`\`css \`\`\`html \`\`\`sql
- Data: \`\`\`json \`\`\`xml \`\`\`yaml
- Markup: \`\`\`markdown

Always create well-structured, readable responses with proper code block formatting.`,

  // Tutorial specialist
  tutorial: (subject: string) => `You are a ${subject} tutorial expert. Create educational content with perfect formatting.

TUTORIAL FORMATTING STANDARDS:
- Use clear section headers (## ###)
- Include step-by-step code examples with \`\`\`language tags
- Add explanatory text between code blocks
- Use \`\`\`json for configuration examples
- Include usage examples and common patterns

EDUCATIONAL APPROACH:
- Explain before showing code
- Use comments in code examples
- Show practical, working examples
- Include error handling where relevant

Always maintain professional tutorial formatting with proper code block language tags.`,

  // API documentation specialist
  apiDocs: () => `You are an API documentation specialist. Create comprehensive, well-formatted API docs.

API DOCUMENTATION FORMAT:
- Endpoint descriptions in clear text
- Request examples in \`\`\`json blocks
- Response examples in \`\`\`json blocks
- Code examples in \`\`\`js or \`\`\`python blocks
- Error responses in \`\`\`json blocks

STRUCTURE REQUIREMENTS:
1. **Description**: Clear explanation
2. **Request Format**: \`\`\`json example
3. **Response Format**: \`\`\`json example
4. **Code Examples**: Implementation in \`\`\`js
5. **Error Handling**: \`\`\`json error responses

Always use proper language tags for syntax highlighting.`
};

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const PromptTemplates = {
  // Code generation with specific formatting
  codeRequest: (task: string, language: string, includeTests: boolean = false) => {
    const testSection = includeTests ? `
- Include test examples in \`\`\`${language} blocks
- Show usage examples` : '';
    
    return `${task}

FORMAT REQUIREMENTS:
- Use \`\`\`${language} blocks for all code
- Include clear comments explaining the logic
- Use proper indentation and clean formatting${testSection}
- Add brief explanations before code blocks

Please follow these formatting rules exactly.`;
  },

  // API documentation request
  apiDocRequest: (endpoint: string, method: string, includeAuth: boolean = false) => {
    const authSection = includeAuth ? `
5. **Authentication**: Required headers/tokens` : '';
    
    return `Document the ${endpoint} API endpoint for ${method} requests.

FORMAT YOUR RESPONSE AS:
1. **Description**: Brief explanation of the endpoint
2. **Request Format**: 
   \`\`\`json
   // Request body example with all parameters
   \`\`\`
3. **Response Format**:
   \`\`\`json
   // Successful response example
   \`\`\`
4. **Implementation Example**:
   \`\`\`js
   // JavaScript fetch/axios example
   \`\`\`${authSection}
6. **Error Responses**:
   \`\`\`json
   // Common error response examples
   \`\`\`

Use proper code blocks with language tags for all examples.`;
  },

  // Multi-language comparison
  multiLanguage: (task: string, languages: string[]) => {
    const langList = languages.map(lang => `- ${lang}: \`\`\`${lang} blocks`).join('\n');
    
    return `Show how to ${task} in multiple programming languages.

LANGUAGES TO INCLUDE:
${langList}

FORMAT STRUCTURE:
- Use clear section headers for each language (## Language Name)
- Include working code examples with proper language tags
- Add brief explanations for language-specific differences
- Show equivalent implementations across languages

Ensure each code block uses the correct language tag for syntax highlighting.`;
  },

  // Mixed content request
  mixedContent: (topic: string) => `Create a comprehensive guide about ${topic} with mixed content formatting:

REQUIRED STRUCTURE:
1. Introduction (explanatory text)
2. Code implementation (\`\`\`js or \`\`\`python blocks)
3. Configuration section (\`\`\`json blocks)
4. Usage examples (more code blocks)
5. Additional notes (explanatory text)

FORMATTING REQUIREMENTS:
- Use proper markdown headers (## ###)
- Include explanatory text between all code blocks
- Use appropriate language tags for syntax highlighting
- Ensure text → code → text → json → text pattern

Create engaging, well-formatted mixed content with proper code block formatting.`,

  // Tutorial request
  tutorial: (topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate') => `Create a ${difficulty}-level tutorial about ${topic}.

TUTORIAL FORMAT:
1. **Prerequisites** (what users need to know)
2. **Overview** (what they'll learn)
3. **Step-by-step Implementation**:
   - Step explanations (text)
   - Code examples (proper \`\`\`language blocks)
   - Configuration (if needed, in \`\`\`json blocks)
4. **Usage Examples** (practical applications)
5. **Common Issues** (troubleshooting)

FORMATTING STANDARDS:
- Use proper markdown headers (## ### ####)
- Include code blocks with correct language tags
- Add comments in code examples
- Use \`\`\`json for any configuration files
- Separate each step with clear explanations

Create a comprehensive, well-formatted tutorial with excellent code block formatting.`
};

// ============================================================================
// PREFILL-STYLE ENFORCERS
// ============================================================================

export const PrefillEnforcers = {
  // Force specific code block start
  codeBlock: (language: string) => `Here's the ${language} implementation:

\`\`\`${language}`,

  // Force structured response
  structured: (title: string, language: string) => `## ${title}

Here's how to implement this:

\`\`\`${language}`,

  // Force explanation + code pattern
  explanationCode: (explanation: string, language: string) => `${explanation}

\`\`\`${language}`,

  // Force multi-section response
  multiSection: (sections: Array<{title: string, language: string}>) => {
    return sections.map(section => 
      `## ${section.title}

\`\`\`${section.language}`
    ).join('\n\n');
  },

  // Force tutorial format
  tutorialStart: (topic: string, language: string) => `# ${topic} Tutorial

## What You'll Learn
In this tutorial, we'll cover how to ${topic.toLowerCase()}.

## Implementation

\`\`\`${language}`,

  // Force API documentation format
  apiDocStart: (endpoint: string) => `# ${endpoint} API Documentation

## Request Format

\`\`\`json`,

  // Force mixed content pattern
  mixedContentStart: (intro: string, language: string) => `${intro}

Let me show you the implementation:

\`\`\`${language}`
};

// ============================================================================
// CONTEXT MANAGERS
// ============================================================================

export class ContextManager {
  private formatHistory: Array<{language: string, pattern: string}> = [];
  private currentLanguage: string = 'js';
  private formatStyle: string = 'standard';

  setLanguage(language: string) {
    this.currentLanguage = language;
    this.formatHistory.push({language, pattern: 'language_switch'});
  }

  setFormatStyle(style: string) {
    this.formatStyle = style;
  }

  buildContextPrompt(newRequest: string, maintainFormat: boolean = true): string {
    if (!maintainFormat || this.formatHistory.length === 0) {
      return newRequest;
    }

    const recentFormat = this.formatHistory[this.formatHistory.length - 1];
    const contextNote = `Note: Continue using the same formatting style as before (${recentFormat.language} code blocks with proper language tags).

${newRequest}`;

    return contextNote;
  }

  addFormatUsage(language: string, pattern: string) {
    this.formatHistory.push({language, pattern});
  }

  getFormatHistory() {
    return [...this.formatHistory];
  }

  reset() {
    this.formatHistory = [];
    this.currentLanguage = 'js';
    this.formatStyle = 'standard';
  }
}

// ============================================================================
// VALIDATION TOOLS
// ============================================================================

export const ValidationTools = {
  // Check if response has proper code blocks
  validateCodeBlocks: (response: string) => {
    const blocks = response.match(/```[\s\S]*?```/g) || [];
    const results = {
      totalBlocks: blocks.length,
      hasLanguageTags: 0,
      languages: [] as string[],
      properlyFormatted: true,
      issues: [] as string[]
    };

    blocks.forEach((block, index) => {
      const firstLine = block.split('\n')[0];
      const language = firstLine.replace('```', '').trim();
      
      if (language) {
        results.hasLanguageTags++;
        results.languages.push(language);
      } else {
        results.issues.push(`Block ${index + 1}: Missing language tag`);
      }

      if (!block.endsWith('```')) {
        results.issues.push(`Block ${index + 1}: Not properly closed`);
        results.properlyFormatted = false;
      }
    });

    return results;
  },

  // Check mixed content pattern
  validateMixedContent: (response: string, expectedPattern: string[] = ['text', 'code', 'text']) => {
    const parts = response.split(/```[\s\S]*?```/);
    const textSections = parts.filter(p => p.trim().length > 10);
    const codeBlocks = response.match(/```[\s\S]*?```/g) || [];

    return {
      textSections: textSections.length,
      codeBlocks: codeBlocks.length,
      followsPattern: textSections.length >= expectedPattern.filter(p => p === 'text').length,
      hasRequiredBlocks: codeBlocks.length >= expectedPattern.filter(p => p === 'code').length
    };
  },

  // Comprehensive format check
  fullValidation: (response: string) => {
    const codeValidation = ValidationTools.validateCodeBlocks(response);
    const mixedValidation = ValidationTools.validateMixedContent(response);
    
    const score = (
      (codeValidation.properlyFormatted ? 25 : 0) +
      (codeValidation.hasLanguageTags / Math.max(codeValidation.totalBlocks, 1) * 25) +
      (mixedValidation.followsPattern ? 25 : 0) +
      (mixedValidation.hasRequiredBlocks ? 25 : 0)
    );

    return {
      score: Math.round(score),
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'F',
      codeBlocks: codeValidation,
      mixedContent: mixedValidation,
      recommendations: ValidationTools.getRecommendations(codeValidation, mixedValidation)
    };
  },

  getRecommendations: (codeValidation: any, mixedValidation: any) => {
    const recommendations = [];
    
    if (codeValidation.hasLanguageTags < codeValidation.totalBlocks) {
      recommendations.push('Add language tags to all code blocks');
    }
    if (!codeValidation.properlyFormatted) {
      recommendations.push('Ensure all code blocks are properly closed');
    }
    if (!mixedValidation.followsPattern) {
      recommendations.push('Include more explanatory text between code blocks');
    }
    if (!mixedValidation.hasRequiredBlocks) {
      recommendations.push('Add more code examples with proper formatting');
    }

    return recommendations;
  }
};

// ============================================================================
// INTERACTIVE CLI
// ============================================================================

class FormattingToolkit {
  private rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  private contextManager = new ContextManager();

  async runInteractive() {
    console.log('🎯 ULTIMATE FORMATTING TOOLKIT');
    console.log('='.repeat(35));
    console.log('🚀 All Claude Code SDK formatting features in one place!');
    console.log('\n💡 Commands: test, system, prompt, mixed, validate, context, help, exit\n');
    
    while (true) {
      const command = await this.askQuestion('🎯 Command: ');
      
      switch (command.toLowerCase().trim()) {
        case 'test':
          await this.runQuickTest();
          break;
        case 'system':
          await this.testSystemMessages();
          break;
        case 'prompt':
          await this.testPromptTemplates();
          break;
        case 'mixed':
          await this.testMixedContent();
          break;
        case 'validate':
          await this.runValidation();
          break;
        case 'context':
          await this.testContext();
          break;
        case 'help':
          this.showHelp();
          break;
        case 'exit':
          console.log('👋 Happy formatting!');
          this.rl.close();
          return;
        default:
          console.log('❓ Unknown command. Type "help" for available commands.');
      }
      
      console.log('\n' + '-'.repeat(50) + '\n');
    }
  }

  async runQuickTest() {
    console.log('🧪 QUICK FORMATTING TEST');
    console.log('-'.repeat(25));
    
    try {
      const prompt = PromptTemplates.codeRequest(
        "Create a function that calculates the average of an array of numbers",
        "js",
        true
      );

      console.log('📤 Testing with prompt template...');
      
      for await (const message of query({ prompt, options: { maxTurns: 1 } })) {
        if (message.type === 'assistant' && message.message?.content) {
          const textContent = message.message.content.find(c => c.type === 'text');
          if (textContent) {
            console.log('✅ Response:');
            console.log(textContent.text);
            
            const validation = ValidationTools.fullValidation(textContent.text);
            console.log(`\n📊 Format Score: ${validation.score}/100 (Grade: ${validation.grade})`);
            
            if (validation.recommendations.length > 0) {
              console.log('💡 Recommendations:');
              validation.recommendations.forEach(rec => console.log(`   • ${rec}`));
            }
            break;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testSystemMessages() {
    console.log('🔧 SYSTEM MESSAGE TEMPLATES');
    console.log('-'.repeat(30));
    
    const templates = Object.keys(SystemMessageTemplates);
    console.log('Available templates:', templates.join(', '));
    
    const choice = await this.askQuestion('Choose template (or press Enter for standard): ') || 'standard';
    const language = await this.askQuestion('Primary language (default: js): ') || 'js';
    
    if (choice in SystemMessageTemplates) {
      const systemMessage = (SystemMessageTemplates as any)[choice](language);
      const prompt = await this.askQuestion('Your request: ');
      
      try {
        console.log('\n📤 Testing with system message...');
        
        for await (const message of query({ 
          prompt: `${systemMessage}\n\n${prompt}`,
          options: { maxTurns: 1 } 
        })) {
          if (message.type === 'assistant' && message.message?.content) {
            const textContent = message.message.content.find(c => c.type === 'text');
            if (textContent) {
              console.log('✅ System Message Result:');
              console.log(textContent.text);
              
              const validation = ValidationTools.validateCodeBlocks(textContent.text);
              console.log(`\n📋 Validation: ${validation.hasLanguageTags}/${validation.totalBlocks} blocks have language tags`);
              break;
            }
          }
        }
      } catch (error) {
        console.error('❌ Error:', error);
      }
    } else {
      console.log('❌ Unknown template');
    }
  }

  async testPromptTemplates() {
    console.log('💬 PROMPT TEMPLATES');
    console.log('-'.repeat(20));
    
    console.log('1. Code Request');
    console.log('2. API Documentation');
    console.log('3. Multi-Language');
    console.log('4. Tutorial');
    
    const choice = await this.askQuestion('Choose template (1-4): ');
    
    let prompt = '';
    switch (choice) {
      case '1':
        const task = await this.askQuestion('Coding task: ');
        const lang = await this.askQuestion('Language: ');
        prompt = PromptTemplates.codeRequest(task, lang, true);
        break;
      case '2':
        const endpoint = await this.askQuestion('API endpoint: ');
        const method = await this.askQuestion('HTTP method: ');
        prompt = PromptTemplates.apiDocRequest(endpoint, method, true);
        break;
      case '3':
        const task3 = await this.askQuestion('Task: ');
        const langs = await this.askQuestion('Languages (comma-separated): ');
        prompt = PromptTemplates.multiLanguage(task3, langs.split(',').map(l => l.trim()));
        break;
      case '4':
        const topic = await this.askQuestion('Tutorial topic: ');
        prompt = PromptTemplates.tutorial(topic);
        break;
      default:
        console.log('❌ Invalid choice');
        return;
    }

    try {
      console.log('\n📤 Testing prompt template...');
      
      for await (const message of query({ prompt, options: { maxTurns: 1 } })) {
        if (message.type === 'assistant' && message.message?.content) {
          const textContent = message.message.content.find(c => c.type === 'text');
          if (textContent) {
            console.log('✅ Template Result:');
            console.log(textContent.text.substring(0, 500) + '...');
            
            const validation = ValidationTools.fullValidation(textContent.text);
            console.log(`\n📊 Quality Score: ${validation.score}/100`);
            break;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async testMixedContent() {
    console.log('🎨 MIXED CONTENT TEST');
    console.log('-'.repeat(20));
    
    const topic = await this.askQuestion('Topic for mixed content: ');
    const prompt = PromptTemplates.mixedContent(topic);
    
    try {
      console.log('\n📤 Testing mixed content formatting...');
      
      for await (const message of query({ prompt, options: { maxTurns: 1 } })) {
        if (message.type === 'assistant' && message.message?.content) {
          const textContent = message.message.content.find(c => c.type === 'text');
          if (textContent) {
            console.log('✅ Mixed Content Result:');
            console.log(textContent.text);
            
            const mixedValidation = ValidationTools.validateMixedContent(textContent.text);
            console.log(`\n📊 Mixed Content Analysis:`);
            console.log(`   Text sections: ${mixedValidation.textSections}`);
            console.log(`   Code blocks: ${mixedValidation.codeBlocks}`);
            console.log(`   Pattern match: ${mixedValidation.followsPattern ? '✅' : '❌'}`);
            break;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  async runValidation() {
    console.log('🔍 RESPONSE VALIDATION');
    console.log('-'.repeat(22));
    
    const response = await this.askQuestion('Paste response to validate (or press Enter for example): ');
    
    const testResponse = response || `Here's a simple function:

\`\`\`js
function hello() {
  return "Hello World";
}
\`\`\`

And here's the config:

\`\`\`json
{
  "greeting": "hello",
  "enabled": true
}
\`\`\`

This demonstrates proper formatting.`;

    const validation = ValidationTools.fullValidation(testResponse);
    
    console.log('\n📊 VALIDATION RESULTS');
    console.log('='.repeat(25));
    console.log(`Overall Score: ${validation.score}/100 (${validation.grade})`);
    console.log(`Code Blocks: ${validation.codeBlocks.totalBlocks} total, ${validation.codeBlocks.hasLanguageTags} with language tags`);
    console.log(`Languages Found: ${validation.codeBlocks.languages.join(', ')}`);
    console.log(`Mixed Content: ${validation.mixedContent.textSections} text sections, ${validation.mixedContent.codeBlocks} code blocks`);
    
    if (validation.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      validation.recommendations.forEach(rec => console.log(`   • ${rec}`));
    } else {
      console.log('\n🎉 Perfect formatting!');
    }
  }

  async testContext() {
    console.log('🔄 CONTEXT MANAGEMENT');
    console.log('-'.repeat(20));
    
    const lang = await this.askQuestion('Set language context: ') || 'js';
    this.contextManager.setLanguage(lang);
    
    const request1 = await this.askQuestion('First request: ');
    const contextPrompt1 = this.contextManager.buildContextPrompt(request1, false);
    
    console.log('\n📤 First request (establishing context)...');
    // Simulate first response
    this.contextManager.addFormatUsage(lang, 'code_block');
    
    const request2 = await this.askQuestion('Follow-up request: ');
    const contextPrompt2 = this.contextManager.buildContextPrompt(request2, true);
    
    console.log('\n📤 Follow-up with context...');
    console.log('Context-aware prompt:');
    console.log(contextPrompt2);
    
    console.log('\n📊 Context History:');
    const history = this.contextManager.getFormatHistory();
    history.forEach((entry, i) => {
      console.log(`   ${i + 1}. ${entry.language} (${entry.pattern})`);
    });
  }

  showHelp() {
    console.log('❓ ULTIMATE FORMATTING TOOLKIT HELP');
    console.log('='.repeat(40));
    console.log(`
🎯 COMMANDS:
  test      - Quick formatting test with validation
  system    - Test system message templates
  prompt    - Test prompt templates (code, API, tutorial, etc.)
  mixed     - Test mixed content formatting (text→code→text→json)
  validate  - Validate response formatting quality
  context   - Test context-aware formatting
  help      - Show this help message
  exit      - Exit the toolkit

🚀 FEATURES:
  • System message templates for consistent formatting
  • Prompt templates for common use cases
  • Validation tools to check formatting quality
  • Context management for multi-turn conversations
  • Support for all major languages and mixed content

💡 TIP: Start with 'test' to see all features in action!
`);
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const toolkit = new FormattingToolkit();
  
  if (args.length === 0) {
    await toolkit.runInteractive();
  } else {
    switch (args[0]) {
      case 'test':
        await toolkit.runQuickTest();
        break;
      case 'examples':
        console.log('📚 FORMATTING EXAMPLES');
        console.log('='.repeat(25));
        console.log('System Message:', SystemMessageTemplates.standard());
        console.log('\nPrompt Template:', PromptTemplates.codeRequest('create a function', 'js'));
        console.log('\nPrefill Enforcer:', PrefillEnforcers.codeBlock('js'));
        break;
      case 'help':
        toolkit.showHelp();
        break;
      default:
        console.log('Unknown argument. Use: test, examples, help, or no arguments for interactive mode');
    }
  }
  
  process.exit(0);
}

// All exports are already declared inline above

if (import.meta.main) {
  main().catch(console.error);
}