#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

interface HookTest {
  name: string;
  hookConfig: any;
  testPrompt: string;
  expectedHookTrigger: string;
}

class HooksTester {
  private results: Array<{test: string, success: boolean, error?: string}> = [];

  async getUserPermission(toolName: string, parameters: Record<string, any>): Promise<PermissionResult> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`\n🔧 Hook Test Tool: ${toolName}`);
    console.log(`   Parameters:`, JSON.stringify(parameters, null, 2));
    
    return new Promise((resolve) => {
      rl.question('\n❓ Allow tool for hooks test? (y/n): ', (answer) => {
        rl.close();
        
        if (answer.toLowerCase().startsWith('y')) {
          resolve({
            behavior: 'allow',
            updatedInput: parameters
          });
        } else {
          resolve({
            behavior: 'deny',
            message: 'User denied tool permission'
          });
        }
      });
    });
  }

  async runHookTest(test: HookTest): Promise<boolean> {
    console.log(`\n🧪 Testing Hook: ${test.name}`);
    console.log(`📝 Expected: ${test.expectedHookTrigger}`);
    
    let conversationDone: (() => void) | undefined;
    
    try {
      const messages: SDKMessage[] = [];
      const abortController = new AbortController();

      const conversationComplete = new Promise<void>(resolve => {
        conversationDone = resolve;
      });

      async function* createPromptStream(): AsyncIterableIterator<SDKUserMessage> {
        yield {
          type: 'user',
          message: { role: 'user', content: test.testPrompt },
          parent_tool_use_id: null,
          session_id: `hook-test-${Date.now()}`
        };
        await conversationComplete;
      }

      // Note: Hooks are configured in settings.local.json, not passed as options
      for await (const message of query({
        prompt: createPromptStream(),
        abortController,
        options: { 
          maxTurns: 2,
          canUseTool: async (toolName: string, parameters: Record<string, any>) => {
            return await this.getUserPermission(toolName, parameters);
          }
        }
      })) {
        messages.push(message);
        
        if (message.type === 'result') {
          if (conversationDone) conversationDone();
          
          const success = message.subtype === 'success';
          console.log(`${success ? '✅' : '❌'} Hook Test ${success ? 'COMPLETED' : 'FAILED'}: ${test.name}`);
          console.log(`   Note: Hook should have triggered: ${test.expectedHookTrigger}`);
          
          this.results.push({test: test.name, success});
          return success;
        }
      }

      throw new Error('Hook test completed without result');
      
    } catch (error) {
      if (conversationDone) conversationDone();
      
      console.log(`❌ Hook Test FAILED: ${test.name} - ${error}`);
      this.results.push({test: test.name, success: false, error: String(error)});
      return false;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 HOOKS TEST SUMMARY');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    console.log(`\n🎯 Hook Results: ${passed}/${total} tests completed`);
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.test}`);
      if (result.error) {
        console.log(`     Error: ${result.error}`);
      }
    });
    
    console.log('\n📝 Note: Hook execution is visible in the Claude Code process,');
    console.log('not in this test output. Check for:');
    console.log('- Completion sound playing after responses (Stop hook)');
    console.log('- Any hook output in the terminal');
  }
}

// Sample hook configurations for testing
const hookTests: HookTest[] = [
  {
    name: 'Stop Hook (Completion Sound)',
    hookConfig: {
      event: 'Stop',
      command: 'ffplay -nodisp -autoexit /home/hassan/anthropic-sdk/done.mp3',
      timeout: 5000,
      description: 'Play completion sound when Claude finishes'
    },
    testPrompt: 'Say hello and explain what a Stop hook does.',
    expectedHookTrigger: 'Completion sound should play after this response'
  },
  {
    name: 'UserPromptSubmit Hook Test',
    hookConfig: {
      event: 'UserPromptSubmit', 
      command: 'echo "User submitted prompt at $(date)" >> /tmp/claude-hook-test.log',
      timeout: 1000,
      description: 'Log when user submits a prompt'
    },
    testPrompt: 'This message should trigger the UserPromptSubmit hook.',
    expectedHookTrigger: 'Log entry should be created when this prompt is submitted'
  },
  {
    name: 'PreToolUse Hook Test',
    hookConfig: {
      event: 'PreToolUse',
      matcher: { tool: 'Write' },
      command: 'echo "About to use Write tool at $(date)" >> /tmp/claude-hook-test.log', 
      timeout: 1000,
      description: 'Log before Write tool usage'
    },
    testPrompt: 'Create a file called "hook-test.txt" with some content to trigger PreToolUse hook.',
    expectedHookTrigger: 'Log entry before Write tool execution'
  }
];

async function main() {
  console.log('🚀 Starting Hooks Functionality Test\n');
  
  const tester = new HooksTester();
  
  console.log('🔔 IMPORTANT NOTES:');
  console.log('1. Hooks are configured in .claude/settings.local.json');
  console.log('2. You should hear a completion sound after each response (Stop hook)');
  console.log('3. Check /tmp/claude-hook-test.log for hook execution logs');
  console.log('4. Hook execution happens outside this test process\n');

  // Display current hook configuration
  console.log('📋 Current Hook Configuration:');
  try {
    const fs = require('fs');
    const settingsPath = '/home/hassan/anthropic-sdk/.claude/settings.local.json';
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    
    if (settings.hooks) {
      console.log(JSON.stringify(settings.hooks, null, 2));
    } else {
      console.log('No hooks configured');
    }
  } catch (error) {
    console.log('Could not read hook configuration');
  }

  console.log('\n' + '='.repeat(50));
  
  // Clean up any previous test logs
  try {
    require('fs').unlinkSync('/tmp/claude-hook-test.log');
    console.log('🧹 Cleaned up previous hook test logs');
  } catch (error) {
    // File doesn't exist, that's fine
  }

  // Run hook tests
  for (const test of hookTests) {
    await tester.runHookTest(test);
    
    // Wait a moment between tests to see hook execution
    console.log('⏳ Waiting 2 seconds to observe hook execution...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  tester.printSummary();
  
  // Check for hook execution evidence
  console.log('\n🔍 Checking for hook execution evidence:');
  try {
    const fs = require('fs');
    const logContent = fs.readFileSync('/tmp/claude-hook-test.log', 'utf8');
    console.log('📋 Hook execution log:');
    console.log(logContent);
  } catch (error) {
    console.log('❌ No hook execution log found (this may be expected)');
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Hooks test suite failed:', error);
    process.exit(1);
  });
}