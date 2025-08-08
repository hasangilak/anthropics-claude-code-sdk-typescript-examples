#!/usr/bin/env bun

/**
 * 💬 PROMPT FORMATTING EXAMPLES  
 * 
 * This script demonstrates how to include formatting instructions directly
 * in user prompts when using the Claude Code SDK. This approach works well
 * for one-off requests or when you need specific formatting for individual queries.
 * 
 * 🎯 FUNCTIONALITY:
 * - Direct prompt formatting instructions
 * - Template prompts for consistent formatting
 * - Format specification examples
 * - Language-specific formatting requests
 * - Output structure control through prompts
 * 
 * 🔧 FORMATTING TECHNIQUES SHOWN:
 * ✅ Explicit format requests in prompts
 * ✅ Template prompt patterns
 * ✅ Format examples in prompts
 * ✅ Multi-format requests  
 * ✅ Structure specification
 * ✅ Code block enforcement through examples
 * 
 * 🧪 HOW TO TEST:
 * 1. Run: `bun run prompt-formatting-examples.ts`
 * 2. See how different prompt styles affect formatting
 * 3. Compare explicit vs implicit formatting requests
 * 4. Try the template functions for your own prompts
 * 
 * 📋 PROMPT PATTERNS INCLUDED:
 * 1. Explicit Format Requests - Direct formatting instructions
 * 2. Example-Driven Formatting - Show expected format in prompt
 * 3. Template-Based Prompts - Reusable prompt patterns
 * 4. Multi-Output Formatting - Different formats in one response
 * 5. Conditional Formatting - Format based on content type
 */

import { query, type SDKMessage } from "@anthropic-ai/claude-code";

async function demonstratePromptFormatting() {
  console.log('💬 PROMPT FORMATTING EXAMPLES');
  console.log('='.repeat(60));
  
  // Example 1: Explicit Format Requests
  console.log('\n🔹 Example 1: Explicit Format Requests in Prompts');
  console.log('-'.repeat(50));
  
  const messages1: SDKMessage[] = [
    {
      role: "user",
      content: `Create a function to reverse a string. 

IMPORTANT: Please format your response with:
- JavaScript code in \`\`\`js blocks
- Include proper syntax highlighting
- Add comments in the code
- Show an example usage after the function`
    }
  ];

  try {
    console.log('🤖 Sending explicit format request...');
    const result1 = await query({
      messages: messages1,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log(result1.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 2: Example-Driven Formatting
  console.log('\n\n🔹 Example 2: Example-Driven Formatting');
  console.log('-'.repeat(50));

  const messages2: SDKMessage[] = [
    {
      role: "user",
      content: `Show me how to make an HTTP request. Format your response like this example:

**JavaScript (fetch):**
\`\`\`js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

**Python (requests):**
\`\`\`python
import requests
response = requests.get('https://api.example.com/data')
data = response.json()
print(data)
\`\`\`

Please follow this exact format pattern for making a POST request with JSON data.`
    }
  ];

  try {
    console.log('🤖 Sending example-driven format request...');
    const result2 = await query({
      messages: messages2,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log(result2.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 3: JSON Structure Formatting
  console.log('\n\n🔹 Example 3: JSON Structure Formatting');
  console.log('-'.repeat(50));

  const messages3: SDKMessage[] = [
    {
      role: "user",
      content: `Create a user profile configuration. Return it as properly formatted JSON in a \`\`\`json code block.

The JSON should include:
- user info (name, email, age)
- preferences (theme, language, notifications)
- settings (privacy, security, display)

Format with 2-space indentation and include all fields.`
    }
  ];

  try {
    console.log('🤖 Sending JSON structure request...');
    const result3 = await query({
      messages: messages3,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log(result3.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 4: Multi-Format Response
  console.log('\n\n🔹 Example 4: Multi-Format Response Request');
  console.log('-'.repeat(50));

  const messages4: SDKMessage[] = [
    {
      role: "user",
      content: `I need a complete authentication system example. Please provide:

1. **HTML Form** (in \`\`\`html blocks):
   - Login form with email/password fields
   
2. **CSS Styling** (in \`\`\`css blocks):
   - Basic form styling
   
3. **JavaScript Handler** (in \`\`\`js blocks):
   - Form submission handling
   - API call to login endpoint
   
4. **API Response Format** (in \`\`\`json blocks):
   - Example success and error responses

Please use proper code blocks for each section with correct language tags.`
    }
  ];

  try {
    console.log('🤖 Sending multi-format request...');
    const result4 = await query({
      messages: messages4,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log(result4.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // Example 5: Template Prompt Functions
  console.log('\n\n🔹 Example 5: Template Prompt Functions');
  console.log('-'.repeat(50));

  // Function to create code formatting prompts
  const createCodePrompt = (request: string, language: string, includeTests: boolean = false) => {
    return `${request}

FORMAT REQUIREMENTS:
- Use \`\`\`${language} code blocks for the main code
- Include clear comments explaining the logic
- Use proper indentation and formatting
${includeTests ? `- Include test examples in \`\`\`${language} blocks` : ''}
- Add a brief explanation before the code

Please follow these formatting rules exactly.`;
  };

  // Function to create API documentation prompts
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
   \`\`\`

Use proper code blocks with language tags for all examples.`;
  };

  // Test template functions
  const templatePrompt1 = createCodePrompt("Create a binary search function", "js", true);
  const messages5: SDKMessage[] = [{ role: "user", content: templatePrompt1 }];

  try {
    console.log('🤖 Using template prompt function (code with tests)...');
    console.log('📝 Generated prompt:', templatePrompt1.substring(0, 100) + '...');
    
    const result5 = await query({
      messages: messages5,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log(result5.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  const templatePrompt2 = createApiDocPrompt("/api/users", "POST");
  const messages6: SDKMessage[] = [{ role: "user", content: templatePrompt2 }];

  try {
    console.log('\n🤖 Using template prompt function (API documentation)...');
    console.log('📝 Generated prompt:', templatePrompt2.substring(0, 100) + '...');
    
    const result6 = await query({
      messages: messages6,
      onPermissionRequest: () => ({ allowed: true })
    });
    
    console.log('✅ Response:');
    console.log(result6.content);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n\n🎉 Prompt Formatting Demo Complete!');
  console.log('💡 Key Takeaways:');
  console.log('   • Include explicit format instructions in prompts');
  console.log('   • Use examples to show expected formatting');
  console.log('   • Template functions create consistent prompts');
  console.log('   • Multi-format requests work well with clear structure');
  console.log('   • Specify exact code block syntax in prompts');
}

// Template functions for export
export const createCodePrompt = (request: string, language: string, includeTests: boolean = false) => {
  return `${request}

FORMAT REQUIREMENTS:
- Use \`\`\`${language} code blocks for the main code
- Include clear comments explaining the logic
- Use proper indentation and formatting
${includeTests ? `- Include test examples in \`\`\`${language} blocks` : ''}
- Add a brief explanation before the code

Please follow these formatting rules exactly.`;
};

export const createApiDocPrompt = (endpoint: string, method: string) => {
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
   \`\`\`

Use proper code blocks with language tags for all examples.`;
};

export const createMultiLanguagePrompt = (task: string, languages: string[]) => {
  const langBlocks = languages.map(lang => `- ${lang}: \`\`\`${lang} blocks`).join('\n');
  
  return `${task}

Please show implementations in multiple languages using proper formatting:

${langBlocks}

Structure your response with clear section headers for each language.`;
};

// Run if called directly
if (import.meta.main) {
  demonstratePromptFormatting().catch(console.error);
}

export { demonstratePromptFormatting };