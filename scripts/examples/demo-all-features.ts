#!/usr/bin/env bun

#!/usr/bin/env bun

/**
 * 🎬 DEMO ALL FEATURES - Complete Claude Code SDK Showcase
 * 
 * This script provides a comprehensive demonstration of Claude Code SDK
 * capabilities in a single, streamlined execution. It showcases multiple
 * tools, permission handling, streaming responses, and hooks integration.
 * 
 * 🎯 FUNCTIONALITY:
 * - Multi-tool demonstration in a coordinated workflow
 * - Auto-permission system for smooth execution
 * - Real-time streaming JSON communication display
 * - Hooks integration with completion sound effects
 * - File operations, directory listing, and search capabilities
 * 
 * 🔧 FEATURES DEMONSTRATED:
 * ✅ Write tool - File creation with permission handling
 * ✅ Bash tool - Directory creation and system commands
 * ✅ LS tool - Directory listing and file discovery
 * ✅ Grep tool - Content search across files
 * ✅ Streaming JSON responses in real-time
 * ✅ Interactive permission system (with auto-allow option)
 * ✅ Hooks system (completion sounds via Stop hook)
 * ✅ Error handling and graceful shutdown
 * 
 * 🧪 HOW TO TEST:
 * 1. Ensure done.mp3 exists for completion sounds
 * 2. Run: `bun run demo-all-features.ts`
 * 3. For faster demo, type "a" to auto-allow all tools
 * 4. Watch coordinated multi-tool workflow execution
 * 5. Listen for completion sound when finished
 * 6. Check created files and directories
 * 
 * 📋 DEMO WORKFLOW:
 * 1. Create demo directory structure
 * 2. Create JSON data file with sample information
 * 3. List directory contents to verify creation
 * 4. Search for files containing "demo" keyword
 * 5. Create summary file documenting the demonstration
 * 
 * 📊 EXPECTED BEHAVIOR:
 * - Creates sdk-demo/ directory with multiple files
 * - Demonstrates permission prompts for each tool
 * - Shows streaming JSON responses during execution
 * - Plays completion sound upon successful finish
 * - Completes in approximately 2-3 minutes
 * - Total cost typically $0.10-0.20
 * 
 * ⚠️  TROUBLESHOOTING:
 * - No completion sound: Check done.mp3 exists and ffplay installed
 * - Permission timeouts: Use "a" to auto-allow all tools
 * - File creation errors: Verify directory write permissions
 * - Hook errors: Check .claude/settings.local.json configuration
 * 
 * 💡 WHEN TO USE:
 * - First-time Claude Code SDK demonstration
 * - Showcasing capabilities to new users
 * - Verifying complete SDK installation
 * - Understanding multi-tool coordination
 * - Testing hooks and permission systems together
 * 
 * 🎵 HOOKS INTEGRATION:
 * - Requires completion sound file (done.mp3)
 * - Uses Stop hook for audio feedback
 * - Demonstrates real-world automation potential
 */

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

async function getUserPermission(toolName: string, parameters: Record<string, any>): Promise<PermissionResult> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`\n🔧 Tool Request: ${toolName}`);
  console.log(`   Parameters:`, JSON.stringify(parameters, null, 2));
  
  return new Promise((resolve) => {
    rl.question('\n❓ Allow this tool? (y/n/a=allow all): ', (answer) => {
      rl.close();
      const response = answer.toLowerCase();
      
      if (response === 'a') {
        console.log('🔓 Auto-allowing all future tools...');
        // Store in global for demo
        (global as any).autoAllow = true;
      }
      
      if (response.startsWith('y') || response === 'a' || (global as any).autoAllow) {
        console.log(`✅ Permission granted: ${toolName}`);
        resolve({
          behavior: 'allow',
          updatedInput: parameters
        });
      } else {
        console.log(`❌ Permission denied: ${toolName}`);
        resolve({
          behavior: 'deny',
          message: 'User denied permission'
        });
      }
    });
  });
}

async function runDemo() {
  console.log('🚀 Claude Code SDK - Complete Feature Demo');
  console.log('='.repeat(50));
  console.log('This demo will showcase:');
  console.log('✅ TypeScript SDK Integration');
  console.log('✅ Real-time Streaming JSON Communication');
  console.log('✅ Interactive Permission System');
  console.log('✅ Multiple Tool Usage');
  console.log('✅ Hooks Integration (completion sound)');
  console.log('✅ File Operations');
  console.log('✅ Error Handling');
  console.log('='.repeat(50));
  
  let conversationDone: (() => void) | undefined;
  
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();
    const toolsUsed: string[] = [];

    const conversationComplete = new Promise<void>(resolve => {
      conversationDone = resolve;
    });

    const demoPrompt = `Please demonstrate multiple Claude Code capabilities:

1. Create a demo directory called "sdk-demo"
2. Create a JSON file with some sample data
3. List the current directory contents
4. Search for any files containing "demo" 
5. Create a summary file with what you accomplished

This will test Write, Bash, LS, Grep, and multiple tool coordination with permission system.`;

    console.log('\n📤 Demo Prompt:');
    console.log(demoPrompt);
    console.log('\n' + '='.repeat(50));

    async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
      yield {
        type: 'user',
        message: { role: 'user', content: demoPrompt },
        parent_tool_use_id: null,
        session_id: `demo-${Date.now()}`
      };
      await conversationComplete;
    }

    const startTime = Date.now();

    for await (const message of query({
      prompt: createPromptStream(),
      abortController,
      options: { 
        maxTurns: 8,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          if (!toolsUsed.includes(toolName)) {
            toolsUsed.push(toolName);
          }
          return await getUserPermission(toolName, parameters);
        }
      }
    })) {
      messages.push(message);
      
      if (message.type === 'assistant') {
        console.log('📥 Claude Response:');
        console.log('---');
        const content = message.message.content;
        if (Array.isArray(content)) {
          content.forEach(item => {
            if (item.type === 'text') {
              console.log(item.text);
            } else if (item.type === 'tool_use') {
              console.log(`🔧 Using tool: ${item.name}`);
            }
          });
        }
        console.log('---\n');
      } else if (message.type === 'result') {
        const duration = Date.now() - startTime;
        
        if (conversationDone) conversationDone();
        
        console.log('🎯 DEMO COMPLETE!');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`💰 Cost: $${message.total_cost_usd}`);
        console.log(`🔄 Turns: ${message.num_turns}`);
        console.log(`🔧 Tools Used: ${toolsUsed.join(', ')}`);
        console.log(`📊 Messages: ${messages.length}`);
        
        if (message.subtype === 'success') {
          console.log('✅ Demo completed successfully!');
          console.log('\n🎵 You should hear a completion sound now (Stop hook)');
        } else {
          console.log('❌ Demo had some issues');
        }
        
        console.log('\n📁 Check the created files:');
        console.log('   - sdk-demo/ directory');
        console.log('   - JSON files');  
        console.log('   - Summary file');
        
        console.log('='.repeat(50));
        break;
      } else if (message.type === 'system') {
        console.log('🔧 System initialized with tools and hooks');
      }
    }

  } catch (error) {
    console.error('💥 Demo failed:', error);
    if (conversationDone) conversationDone();
    process.exit(1);
  }
}

if (require.main === module) {
  runDemo().catch(console.error);
}