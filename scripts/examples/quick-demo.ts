#!/usr/bin/env bun

/**
 * ⚡ QUICK DEMO - Fast Claude Code SDK Demonstration
 * 
 * This script provides a fast, streamlined demonstration of Claude Code SDK
 * capabilities with minimal setup and auto-permission features. Perfect for
 * quick showcases and initial SDK validation.
 * 
 * 🎯 FUNCTIONALITY:
 * - Quick SDK integration demo with minimal user interaction
 * - Auto-permission system for streamlined execution
 * - Basic tool demonstration with file operations
 * - Hooks integration with completion sound effects
 * - Fast execution under 2 minutes
 * 
 * 🔧 FEATURES DEMONSTRATED:
 * ✅ Write tool - Quick file creation with auto-permissions
 * ✅ Hooks system - Completion sound integration
 * ✅ Stream-based SDK communication
 * ✅ Auto-allow permission handling for smooth demo flow
 * ✅ Process management and graceful shutdown
 * ✅ Basic error handling and reporting
 * 
 * 🧪 HOW TO TEST:
 * 1. Ensure done.mp3 exists for completion sound
 * 2. Run: `bun run quick-demo.ts`
 * 3. Type "a" when prompted to auto-allow all tools
 * 4. Watch fast execution of file creation demo
 * 5. Listen for completion sound when finished
 * 6. Check created "quick-demo-output.txt" file
 * 
 * 📋 DEMO WORKFLOW:
 * 1. Initialize SDK with auto-permission capability
 * 2. Send quick file creation request to Claude
 * 3. Auto-approve Write tool (if user selects "a")
 * 4. Create demo output file with success message
 * 5. Play completion sound via hooks integration
 * 6. Report successful completion
 * 
 * 📊 EXPECTED BEHAVIOR:
 * - Completes in 30-60 seconds with auto-permissions
 * - Creates "quick-demo-output.txt" with demo content
 * - Plays completion sound when finished
 * - Shows minimal but clear progress output
 * - Total cost typically under $0.05
 * - Perfect for quick capability demonstrations
 * 
 * ⚠️  TROUBLESHOOTING:
 * - No completion sound: Check done.mp3 exists and ffplay installed
 * - File not created: Verify directory write permissions
 * - Permission prompts: Use "a" to auto-allow all tools
 * - Hook errors: Check .claude/settings.local.json configuration
 * 
 * 💡 WHEN TO USE:
 * - Quick SDK capability demonstration
 * - Initial SDK installation validation
 * - Fast showcase for new users
 * - Template for minimal SDK integration
 * - Testing basic hooks and permission systems
 * 
 * 🎵 HOOKS INTEGRATION:
 * - Requires completion sound file (done.mp3)
 * - Uses Stop hook for audio feedback
 * - Demonstrates automation potential
 * 
 * 🔗 DEPENDENCIES:
 * - done.mp3 file in project root (for completion sound)
 * - .claude/settings.local.json with hooks configured
 * - No external dependencies or complex setup required
 */

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

async function quickDemo() {
  console.log('🚀 Claude Code SDK - Quick Demo with Hooks');
  console.log('='.repeat(40));
  
  let conversationDone: (() => void) | undefined;
  
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();

    const conversationComplete = new Promise<void>(resolve => {
      conversationDone = resolve;
    });

    const demoPrompt = 'Create a simple test file called "demo-test.txt" with the message "Hello from Claude Code SDK with hooks!" and then list the directory contents.';

    console.log(`\n📤 Prompt: ${demoPrompt}\n`);

    async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
      yield {
        type: 'user',
        message: { role: 'user', content: demoPrompt },
        parent_tool_use_id: null,
        session_id: `quick-demo-${Date.now()}`
      };
      await conversationComplete;
    }

    const startTime = Date.now();

    for await (const message of query({
      prompt: createPromptStream(),
      abortController,
      options: { 
        maxTurns: 3,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          console.log(`\n🔧 Auto-allowing tool: ${toolName}`);
          return {
            behavior: 'allow' as const,
            updatedInput: parameters
          };
        }
      }
    })) {
      messages.push(message);
      
      if (message.type === 'assistant') {
        console.log('📥 Response received');
      } else if (message.type === 'result') {
        const duration = Date.now() - startTime;
        
        if (conversationDone) conversationDone();
        
        console.log('\n🎯 QUICK DEMO COMPLETE!');
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`💰 Cost: $${message.total_cost_usd}`);
        console.log(`✅ Success: ${message.subtype === 'success'}`);
        
        if (message.subtype === 'success') {
          console.log('\n🎵 Completion sound should play now (Stop hook)');
        }
        
        break;
      }
    }

  } catch (error) {
    console.error('💥 Quick demo failed:', error);
    if (conversationDone) conversationDone();
  }
}

if (require.main === module) {
  quickDemo().catch(console.error);
}