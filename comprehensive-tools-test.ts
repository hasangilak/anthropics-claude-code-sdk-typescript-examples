#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

interface ToolUseRequest {
  tool_name: string;
  parameters: Record<string, any>;
  description: string;
}

interface TestResult {
  testName: string;
  success: boolean;
  toolsUsed: string[];
  error?: string;
  duration?: number;
  cost?: number;
}

class ToolTester {
  private results: TestResult[] = [];
  private toolPermissions = new Map<string, boolean>();
  
  async getUserPermission(toolRequest: ToolUseRequest): Promise<PermissionResult> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`\n🔧 Claude Code wants to use: ${toolRequest.tool_name}`);
    console.log(`   Parameters:`, JSON.stringify(toolRequest.parameters, null, 2));
    
    return new Promise((resolve) => {
      rl.question('\n❓ Allow this tool? (y/n/a=yes to all): ', (answer) => {
        rl.close();
        
        const response = answer.toLowerCase();
        
        if (response === 'a') {
          // Allow all future tools
          console.log('🔓 Allowing all future tool usage...');
          this.toolPermissions.set('*', true);
          resolve({
            behavior: 'allow',
            updatedInput: toolRequest.parameters
          });
        } else if (response.startsWith('y') || this.toolPermissions.get('*')) {
          console.log(`✅ Permission granted for: ${toolRequest.tool_name}`);
          resolve({
            behavior: 'allow',
            updatedInput: toolRequest.parameters
          });
        } else {
          console.log(`❌ Permission denied for: ${toolRequest.tool_name}`);
          resolve({
            behavior: 'deny',
            message: 'User denied permission'
          });
        }
      });
    });
  }

  async runTest(testName: string, prompt: string, maxTurns = 3): Promise<TestResult> {
    console.log(`\n🧪 Running Test: ${testName}`);
    console.log(`📝 Prompt: ${prompt}\n`);
    
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
          session_id: `test-${Date.now()}`
        };
        await conversationComplete;
      }

      for await (const message of query({
        prompt: createPromptStream(),
        abortController,
        options: { 
          maxTurns,
          canUseTool: async (toolName: string, parameters: Record<string, any>) => {
            const toolRequest: ToolUseRequest = {
              tool_name: toolName,
              parameters,
              description: `Test wants to use ${toolName}`
            };
            
            if (!toolsUsed.includes(toolName)) {
              toolsUsed.push(toolName);
            }
            
            return await this.getUserPermission(toolRequest);
          }
        }
      })) {
        messages.push(message);
        
        if (message.type === 'result') {
          const duration = Date.now() - startTime;
          
          if (conversationDone) conversationDone();
          
          const result: TestResult = {
            testName,
            success: message.subtype === 'success',
            toolsUsed,
            duration,
            cost: message.total_cost_usd
          };
          
          console.log(`${result.success ? '✅' : '❌'} Test ${result.success ? 'PASSED' : 'FAILED'}: ${testName}`);
          console.log(`   Tools used: ${toolsUsed.join(', ') || 'None'}`);
          console.log(`   Duration: ${duration}ms, Cost: $${message.total_cost_usd}`);
          
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
      
      console.log(`❌ Test FAILED: ${testName} - ${error}`);
      this.results.push(result);
      return result;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TOOLS TEST SUMMARY');
    console.log('='.repeat(60));
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    console.log(`\n🎯 Overall Results: ${passed}/${total} tests passed`);
    console.log(`💰 Total Cost: $${this.results.reduce((sum, r) => sum + (r.cost || 0), 0).toFixed(6)}`);
    console.log(`⏱️  Total Time: ${this.results.reduce((sum, r) => sum + (r.duration || 0), 0)}ms`);
    
    // Tools usage summary
    const allTools = new Set<string>();
    this.results.forEach(r => r.toolsUsed.forEach(t => allTools.add(t)));
    console.log(`🔧 Tools Tested: ${Array.from(allTools).join(', ') || 'None'}`);
    
    console.log('\n📋 Detailed Results:');
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.testName}`);
      if (result.toolsUsed.length > 0) {
        console.log(`     Tools: ${result.toolsUsed.join(', ')}`);
      }
      if (result.error) {
        console.log(`     Error: ${result.error}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
  }
}

async function main() {
  console.log('🚀 Starting Comprehensive Claude Code Tools Test\n');
  
  const tester = new ToolTester();
  
  // Test 1: File Operations (Write, Read, Edit)
  await tester.runTest(
    'File Operations',
    'Create a file called "test-write.txt" with content "Testing Write tool", then read it back and edit it to add a timestamp.'
  );
  
  // Test 2: Directory Operations (LS, Glob)
  await tester.runTest(
    'Directory Operations', 
    'List all files in the current directory using LS, then find all TypeScript files using Glob.'
  );
  
  // Test 3: Search Operations (Grep)
  await tester.runTest(
    'Search Operations',
    'Search for the word "Claude" in all files in the current directory using Grep.'
  );
  
  // Test 4: Shell Operations (Bash)
  await tester.runTest(
    'Shell Operations',
    'Use Bash to check the current date and create a directory called "test-bash-dir".'
  );
  
  // Test 5: Multi-Edit Operations
  await tester.runTest(
    'Multi-Edit Operations',
    'Create a JSON file with some data, then use MultiEdit to make multiple changes to it in one operation.'
  );
  
  // Test 6: Web Operations (WebFetch, WebSearch)
  await tester.runTest(
    'Web Operations',
    'Use WebFetch to get information from https://docs.anthropic.com/en/docs/claude-code/overview and summarize what Claude Code is.'
  );
  
  // Test 7: Task Management (TodoWrite)
  await tester.runTest(
    'Task Management',
    'Use TodoWrite to create a todo list with 3 items, mark one as in progress, and one as completed.'
  );
  
  // Test 8: Complex Workflow
  await tester.runTest(
    'Complex Workflow',
    'Create a small project: make a directory "sample-project", create a package.json file, a simple TypeScript file, and a README.md file.',
    5
  );

  // Test 9: Error Handling
  await tester.runTest(
    'Error Handling',
    'Try to read a file that does not exist and handle the error gracefully.'
  );
  
  // Test 10: Permission Testing
  await tester.runTest(
    'Permission Testing',
    'Demonstrate the permission system by attempting to create, modify, and delete files while showing permission prompts.'
  );

  tester.printSummary();
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });
}