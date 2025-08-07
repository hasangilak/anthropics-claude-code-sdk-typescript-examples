#!/usr/bin/env bun

/**
 * ✨ ENHANCED DEMO - Advanced Permission System Showcase
 * 
 * This script demonstrates the enhanced permission system with detailed risk
 * analysis, security warnings, and interactive controls. It showcases how
 * advanced security features work in real Claude Code SDK operations.
 * 
 * 🎯 FUNCTIONALITY:
 * - Enhanced permission system demonstration
 * - Real-time risk analysis and security assessment
 * - Interactive permission controls with multiple response options
 * - File operation security scanning and content analysis
 * - Advanced security warnings and recommendations
 * 
 * 🔧 ENHANCED FEATURES DEMONSTRATED:
 * ✅ 4-level risk assessment system (LOW/MEDIUM/HIGH/CRITICAL)
 * ✅ File content preview with security scanning
 * ✅ Parameter analysis and impact assessment
 * ✅ Interactive permission responses (y/n/a/d/i)
 * ✅ Smart security recommendations
 * ✅ Tool-specific security warnings
 * ✅ Permission state management and statistics
 * ✅ Advanced control options and information system
 * 
 * 🧪 HOW TO TEST:
 * 1. Run: `bun run enhanced-demo.ts`
 * 2. Review detailed security analysis for each tool request
 * 3. Try different permission responses to see various features:
 *    - "y" = Allow this specific tool once
 *    - "n" = Deny this specific tool once  
 *    - "a" = Allow ALL future tools automatically
 *    - "d" = Deny ALL future requests for this tool type
 *    - "i" = Show additional security information
 * 4. Observe risk level indicators and security warnings
 * 5. Check final permission state and usage statistics
 * 
 * 📋 DEMO WORKFLOW:
 * 1. File Creation - JSON file with enhanced security analysis
 * 2. Directory Reading - Safe operation with minimal warnings
 * 3. File Search - Grep operation with content access analysis
 * 4. Directory Creation - System modification with risk assessment
 * 
 * 🛡️ SECURITY ANALYSIS FEATURES:
 * - Risk level assessment for every operation
 * - File content scanning for sensitive data patterns
 * - Parameter analysis with security implications
 * - Tool-specific warnings (filesystem, network, system access)
 * - Smart recommendations based on operation type and context
 * - Permission decision tracking and statistics
 * 
 * ⚠️  TROUBLESHOOTING:
 * - Enhanced permission dependency: Ensure enhanced-permission-system.ts exists
 * - Permission prompts: Review security analysis carefully before deciding
 * - Interactive responses: Use "i" option for more information
 * - State management: Check permission statistics with final summary
 * 
 * 💡 WHEN TO USE:
 * - Learning about enhanced security features
 * - Understanding risk assessment and permission controls
 * - Training on security-conscious Claude Code usage
 * - Demonstrating enterprise-grade permission systems
 * - Testing interactive security controls and responses
 * 
 * 🎯 LEARNING OBJECTIVES:
 * - Understand different risk levels and their implications
 * - Learn to make informed permission decisions
 * - Experience advanced permission control options
 * - See security scanning and analysis in action
 * 
 * 🔗 DEPENDENCIES:
 * - enhanced-permission-system.ts (required for all enhanced features)
 * - Integrates with completion hooks for user feedback
 */

import { query, type SDKMessage, type SDKUserMessage } from "@anthropic-ai/claude-code";
import { EnhancedPermissionSystem } from "./enhanced-permission-system";

async function enhancedDemo() {
  console.log('🚀 ENHANCED CLAUDE CODE SDK DEMO');
  console.log('='.repeat(50));
  console.log('✨ Features Demonstrated:');
  console.log('   🔒 Enhanced permission system with risk analysis');
  console.log('   📋 Detailed file operation previews');
  console.log('   🛡️  Security warnings and recommendations'); 
  console.log('   💡 Interactive permission controls');
  console.log('   📊 Complete impact analysis');
  console.log('='.repeat(50));
  
  const permissionSystem = new EnhancedPermissionSystem();
  let conversationDone: (() => void) | undefined;
  
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();

    const conversationComplete = new Promise<void>(resolve => {
      conversationDone = resolve;
    });

    const demoPrompt = `Please demonstrate the enhanced permission system by:

1. Creating a file called "permission-demo.json" with some JSON data about this demo
2. Reading the current directory to see what files exist
3. Searching for any files containing "demo" in their names
4. Creating a backup directory called "demo-backup"

This will showcase different risk levels and detailed permission prompts.`;

    console.log(`\n📤 Demo Request:\n${demoPrompt}\n`);
    console.log('💡 Try different permission responses:');
    console.log('   • "y" - Allow this specific tool');
    console.log('   • "n" - Deny this specific tool');
    console.log('   • "a" - Allow ALL future tools automatically');
    console.log('   • "d" - Deny ALL future requests for this tool type');
    console.log('   • "i" - Get more information about the tool');
    console.log('\n' + '='.repeat(50));

    async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
      yield {
        type: 'user',
        message: { role: 'user', content: demoPrompt },
        parent_tool_use_id: null,
        session_id: `enhanced-demo-${Date.now()}`
      };
      await conversationComplete;
    }

    const startTime = Date.now();

    for await (const message of query({
      prompt: createPromptStream(),
      abortController,
      options: { 
        maxTurns: 6,
        canUseTool: async (toolName: string, parameters: Record<string, any>) => {
          return await permissionSystem.getUserPermission(toolName, parameters);
        }
      }
    })) {
      messages.push(message);
      
      if (message.type === 'assistant') {
        console.log('\n📥 Claude is processing your request...');
      } else if (message.type === 'result') {
        const duration = Date.now() - startTime;
        
        if (conversationDone) conversationDone();
        
        console.log('\n' + '='.repeat(50));
        console.log('🎯 ENHANCED DEMO COMPLETE!');
        console.log('='.repeat(50));
        console.log(`⏱️  Duration: ${Math.round(duration/1000)} seconds`);
        console.log(`💰 Cost: $${message.total_cost_usd}`);
        console.log(`✅ Success: ${message.subtype === 'success'}`);
        
        // Show permission system final state
        const permState = permissionSystem.getState();
        console.log('\n🔐 Final Permission State:');
        console.log(`   Auto-allow: ${permState.autoAllow ? '🔓 ON' : '🔒 OFF'}`);
        console.log(`   Pre-approved tools: ${permState.allowedTools.length}`);
        console.log(`   Blocked tools: ${permState.deniedTools.length}`);
        
        if (permState.allowedTools.length > 0) {
          console.log(`   Allowed: ${permState.allowedTools.join(', ')}`);
        }
        if (permState.deniedTools.length > 0) {
          console.log(`   Denied: ${permState.deniedTools.join(', ')}`);
        }
        
        if (message.subtype === 'success') {
          console.log('\n✨ Check the created files and directories!');
          console.log('🎵 You should hear completion sound (if hooks are working)');
        }
        
        console.log('\n💡 Enhanced Permission System Benefits:');
        console.log('   🔍 Risk assessment for every tool request');
        console.log('   📋 File content previews before writing');
        console.log('   🛡️  Security warnings for dangerous operations');
        console.log('   💾 Smart defaults and recommendations');
        console.log('   🔒 Granular control over tool permissions');
        
        console.log('='.repeat(50));
        break;
      } else if (message.type === 'system') {
        console.log('🔧 System initialized with enhanced permissions');
      }
    }

  } catch (error) {
    console.error('\n💥 Enhanced demo failed:', error);
    if (conversationDone) conversationDone();
    process.exit(1);
  }
}

if (require.main === module) {
  enhancedDemo().catch(console.error);
}