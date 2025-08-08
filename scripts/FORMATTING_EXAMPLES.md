# Claude Code SDK Response Formatting Examples

This collection demonstrates different techniques to format Claude's responses with proper code blocks like ````js alert("hello") ```` and ````json {"name": "jafar"} ````.

## 🎯 Quick Start

**Interactive Demo (Recommended):**
```bash
bun run formatting-demo.ts
```

**Individual Examples:**
```bash
bun run system-message-formatting.ts
bun run prompt-formatting-examples.ts  
bun run prefill-formatting.ts
bun run context-formatting.ts
```

## 📋 Examples Overview

### 1. System Message Formatting (`system-message-formatting.ts`)
Controls response formatting through system messages.

**Key Technique:**
```typescript
const systemMessage = "Always wrap JavaScript in ```js blocks, JSON in ```json blocks...";
await query({ messages, systemMessage });
```

**When to Use:** Consistent formatting across entire conversations

### 2. Prompt Engineering (`prompt-formatting-examples.ts`)
Include formatting instructions directly in user prompts.

**Key Technique:**
```typescript
const prompt = `Create a function. 
FORMAT: Use \`\`\`js blocks with proper syntax highlighting.`;
```

**When to Use:** One-off specific formatting needs

### 3. Prefill Responses (`prefill-formatting.ts`)
Force specific formatting by starting Claude's response.

**Key Technique:**
```typescript
const messages = [
  { role: "user", content: "Create a function" },
  { role: "assistant", content: "```js\n" }  // Forces JS code block
];
```

**When to Use:** Guaranteed format enforcement

### 4. Context Formatting (`context-formatting.ts`)
Maintain format consistency across multiple message exchanges.

**Key Technique:**
```typescript
// Previous responses establish formatting context
// Follow-up messages maintain the same format automatically
```

**When to Use:** Long conversations requiring format consistency

### 5. Comprehensive Demo (`formatting-demo.ts`)
Interactive demo combining all techniques with comparison tools.

**Features:**
- Interactive command interface
- Side-by-side technique comparisons  
- Template function testing
- Custom prompt testing
- Best practices guide

## 🏆 Best Practices Summary

### Technique Selection:
- **System Messages:** For applications with repeated interactions
- **Prompt Engineering:** For flexible, one-off formatting  
- **Prefills:** When you absolutely need guaranteed formatting
- **Context:** For progressive development workflows

### Ultimate Approach:
**System Message + Prefill = Maximum Consistency**

### Template Functions:
Each example exports reusable template functions:

```typescript
// From system-message-formatting.ts
import { createFormattingSystemMessage } from "./system-message-formatting";

// From prompt-formatting-examples.ts  
import { createCodePrompt } from "./prompt-formatting-examples";

// From prefill-formatting.ts
import { createCodePrefill } from "./prefill-formatting";

// From context-formatting.ts
import { ConversationFormatter } from "./context-formatting";
```

## 🧪 Common Patterns

### JavaScript Code Blocks:
```typescript
// System message approach
systemMessage: "Always use ```js blocks for JavaScript code"

// Prompt approach  
prompt: "Create a function. Use ```js blocks for the code."

// Prefill approach
{ role: "assistant", content: "```js\n" }
```

### JSON Responses:
```typescript
// System message approach
systemMessage: "Always wrap JSON in ```json blocks with proper indentation"

// Prompt approach
prompt: "Return JSON configuration in ```json blocks"

// Prefill approach  
{ role: "assistant", content: "```json\n" }
```

### Multi-Language Responses:
```typescript
// Template function
const multiLangPrompt = `Show implementations in:
- JavaScript: \`\`\`js blocks
- Python: \`\`\`python blocks
- JSON config: \`\`\`json blocks`;
```

## 🚀 Advanced Usage

### Combining Techniques:
```typescript
// Ultimate formatting control
await query({
  messages: [
    { role: "user", content: request },
    { role: "assistant", content: "```js\n" }  // Prefill
  ],
  systemMessage: createFormattingSystemMessage("js"), // System
  onPermissionRequest: () => ({ allowed: true })
});
```

### Custom Format Templates:
```typescript
// Create your own formatting patterns
const createCustomPrompt = (request: string, format: string) => {
  return `${request}\n\nFORMAT: Use ${format} blocks with proper syntax highlighting.`;
};
```

## 💡 Tips

1. **Be Explicit:** Always specify exact code block syntax like ````js``` not just "code blocks"
2. **Use Examples:** Show expected format in your prompts when possible
3. **Combine Methods:** Use system messages + prefills for maximum control
4. **Test Approaches:** Different prompts may work better with different techniques
5. **Template Functions:** Create reusable patterns for consistent formatting

Start with the interactive demo to explore all techniques: `bun run formatting-demo.ts`