#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { EnhancedPermissionSystem } from "./enhanced-permission-system";

interface TestResult {
  testName: string;
  success: boolean;
  toolsUsed: string[];
  error?: string;
  duration?: number;
  cost?: number;
}

class EnhancedToolTester {
  private results: TestResult[] = [];
  private permissionSystem = new EnhancedPermissionSystem();
  
  async runTest(testName: string, prompt: string, maxTurns = 3): Promise<TestResult> {
    console.log(`\n🧪 STARTING TEST: ${testName}`);
    console.log('='.repeat(50));
    console.log(`📝 Test Prompt: ${prompt}\n`);
    
    let conversationDone: (() => void) | undefined;
    const startTime = Date.now();
    const toolsUsed: string[] = [];
    
    try {
      const messages: SDKMessage[] = [];
      const abortController = new AbortController();

      const conversationComplete = new Promise<void>(resolve => {
        conversationDone = resolve;
      });

      async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
        yield {
          type: 'user',
          message: { role: 'user', content: prompt },
          parent_tool_use_id: null,
          session_id: `test-${testName}-${Date.now()}`
        };
        await conversationComplete;
      }

      for await (const message of query({
        prompt: createPromptStream(),
        abortController,
        options: { 
          maxTurns,
          canUseTool: async (toolName: string, parameters: Record<string, any>) => {
            if (!toolsUsed.includes(toolName)) {
              toolsUsed.push(toolName);
            }
            
            return await this.permissionSystem.getUserPermission(toolName, parameters);
          }
        }
      })) {
        messages.push(message);
        
        if (message.type === 'assistant') {
          console.log('📥 Claude is working on your request...');
        } else if (message.type === 'result') {
          const duration = Date.now() - startTime;
          
          if (conversationDone) conversationDone();
          
          const result: TestResult = {
            testName,
            success: message.subtype === 'success',
            toolsUsed,
            duration,
            cost: message.total_cost_usd
          };
          
          console.log('\n' + '='.repeat(50));
          console.log(`${result.success ? '✅ TEST PASSED' : '❌ TEST FAILED'}: ${testName}`);
          console.log(`🔧 Tools used: ${toolsUsed.join(', ') || 'None'}`);
          console.log(`⏱️  Duration: ${duration}ms`);
          console.log(`💰 Cost: $${message.total_cost_usd}`);
          console.log('='.repeat(50));
          
          this.results.push(result);
          return result;
        }
      }

      throw new Error('Test completed without result message');
      
    } catch (error) {
      if (conversationDone) conversationDone();
      
      const result: TestResult = {
        testName,
        success: false,
        toolsUsed,
        error: String(error),
        duration: Date.now() - startTime
      };
      
      console.log('\n' + '='.repeat(50));
      console.log(`❌ TEST FAILED: ${testName} - ${error}`);
      console.log('='.repeat(50));
      this.results.push(result);
      return result;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 ENHANCED COMPREHENSIVE TOOLS TEST SUMMARY');
    console.log('='.repeat(80));
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    console.log(`\n🎯 Overall Results: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);
    console.log(`💰 Total Cost: $${this.results.reduce((sum, r) => sum + (r.cost || 0), 0).toFixed(6)}`);
    console.log(`⏱️  Total Time: ${Math.round(this.results.reduce((sum, r) => sum + (r.duration || 0), 0)/1000)}s`);
    
    // Tools usage summary
    const allTools = new Set<string>();
    this.results.forEach(r => r.toolsUsed.forEach(t => allTools.add(t)));
    console.log(`🔧 Tools Tested: ${allTools.size} different tools`);
    console.log(`   ${Array.from(allTools).join(', ')}`);
    
    // Permission system state
    const permState = this.permissionSystem.getState();
    console.log(`\n🔐 Permission System State:`);
    console.log(`   Auto-allow: ${permState.autoAllow ? '🔓 ON' : '🔒 OFF'}`);
    console.log(`   Allowed tools: ${permState.allowedTools.length}`);
    console.log(`   Denied tools: ${permState.deniedTools.length}`);
    
    console.log('\n📋 Detailed Results:');
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration ? `${Math.round(result.duration/1000)}s` : '?';
      const cost = result.cost ? `$${result.cost.toFixed(4)}` : '$0';
      
      console.log(`${index + 1}. ${status} ${result.testName} (${duration}, ${cost})`);
      if (result.toolsUsed.length > 0) {
        console.log(`     🔧 Tools: ${result.toolsUsed.join(', ')}`);
      }
      if (result.error) {
        console.log(`     ❌ Error: ${result.error}`);
      }
    });
    
    console.log('\n💡 Tips for Next Run:');
    console.log('   • Use "a" to auto-allow all tools for faster testing');
    console.log('   • Use "d" to deny specific tools permanently');
    console.log('   • Use "i" to get more info about any tool request');
    console.log('\n' + '='.repeat(80));
  }
}

async function main() {
  console.log('🚀 ENHANCED COMPREHENSIVE CLAUDE CODE TOOLS TEST');
  console.log('='.repeat(60));
  console.log('Features:');
  console.log('✨ Detailed permission analysis with risk assessment');
  console.log('📋 Content previews for file operations');
  console.log('🔒 Advanced permission controls (allow all, deny specific tools)');
  console.log('📊 Comprehensive impact analysis for each tool');
  console.log('🎯 MCP tool detection and detailed warnings');
  console.log('='.repeat(60));
  
  const tester = new EnhancedToolTester();
  
  // Test 1: File Write Operations with detailed preview
  await tester.runTest(
    'File Write with Content Preview',
    'Create a file called "enhanced-test-output.txt" with a detailed message about this enhanced permission system, including today\'s date and a list of features.'
  );
  
  // Test 2: File Edit Operations
  await tester.runTest(
    'File Edit Operations',
    'Read the file we just created and edit it to add a "COMPLETED" status at the end.'
  );
  
  // Test 3: Directory and Search Operations
  await tester.runTest(
    'Directory and Search Operations', 
    'List all files in the current directory, then search for files containing "enhanced" using Grep.'
  );
  
  // Test 4: Shell Operations with Risk Analysis
  await tester.runTest(
    'Shell Operations with Risk Analysis',
    'Use Bash to check the current date, create a backup directory called "test-backup", and show disk usage.'
  );
  
  // Test 5: Multi-tool Coordination
  await tester.runTest(
    'Multi-tool Complex Workflow',
    'Create a project structure: make a directory called "enhanced-demo", create a package.json file inside it, and then list the contents to verify.',
    5
  );
  
  // Test 6: Web Operations (if allowed)
  await tester.runTest(
    'Web Operations with Domain Analysis',
    'Use WebFetch to get information from https://docs.anthropic.com/en/docs/claude-code/overview and provide a brief summary.'
  );
  
  // Test 7: Safe Operations (low risk)
  await tester.runTest(
    'Safe Read-only Operations',
    'Use LS to list the current directory contents and Read to examine the package.json file.'
  );

  tester.printSummary();
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Enhanced test suite failed:', error);
    process.exit(1);
  });
}