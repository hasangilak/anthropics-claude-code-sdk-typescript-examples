#!/usr/bin/env bun

import { spawn } from 'child_process';
import { createInterface } from 'readline';

interface TestSuite {
  name: string;
  script: string;
  description: string;
  estimated_time: string;
}

class MasterTestRunner {
  private testSuites: TestSuite[] = [
    {
      name: 'Comprehensive Tools Test',
      script: 'comprehensive-tools-test.ts',
      description: 'Tests all core Claude Code tools with permission callbacks',
      estimated_time: '3-5 minutes'
    },
    {
      name: 'MCP Integration Test', 
      script: 'mcp-test.ts',
      description: 'Tests Model Context Protocol server integration',
      estimated_time: '2-3 minutes'
    },
    {
      name: 'Hooks Functionality Test',
      script: 'hooks-test.ts', 
      description: 'Tests hooks system (completion sounds, logging, etc.)',
      estimated_time: '2-3 minutes'
    }
  ];

  private results: Array<{suite: string, success: boolean, duration: number, error?: string}> = [];

  async promptUser(question: string): Promise<string> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  async runTestSuite(suite: TestSuite): Promise<boolean> {
    console.log('\n' + '='.repeat(60));
    console.log(`🧪 Starting: ${suite.name}`);
    console.log(`📋 Description: ${suite.description}`);
    console.log(`⏱️  Estimated time: ${suite.estimated_time}`);
    console.log('='.repeat(60));

    const startTime = Date.now();

    return new Promise((resolve) => {
      const child = spawn('bun', ['run', suite.script], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      child.on('close', (code) => {
        const duration = Date.now() - startTime;
        const success = code === 0;
        
        console.log(`\n${success ? '✅' : '❌'} ${suite.name} ${success ? 'COMPLETED' : 'FAILED'}`);
        console.log(`   Duration: ${(duration / 1000).toFixed(1)}s`);
        
        this.results.push({
          suite: suite.name,
          success,
          duration,
          error: success ? undefined : `Exit code: ${code}`
        });

        resolve(success);
      });

      child.on('error', (error) => {
        const duration = Date.now() - startTime;
        console.log(`\n❌ ${suite.name} FAILED: ${error.message}`);
        
        this.results.push({
          suite: suite.name,
          success: false,
          duration,
          error: error.message
        });

        resolve(false);
      });
    });
  }

  printFinalSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 MASTER TEST RUNNER - FINAL SUMMARY');
    console.log('='.repeat(80));
    
    const totalPassed = this.results.filter(r => r.success).length;
    const totalSuites = this.results.length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`\n📊 Overall Results: ${totalPassed}/${totalSuites} test suites passed`);
    console.log(`⏱️  Total Runtime: ${(totalTime / 1000).toFixed(1)} seconds`);
    
    console.log('\n📋 Test Suite Results:');
    this.results.forEach((result, index) => {
      const status = result.success ? '✅ PASSED' : '❌ FAILED';
      const time = (result.duration / 1000).toFixed(1);
      console.log(`${index + 1}. ${status} - ${result.suite} (${time}s)`);
      if (result.error) {
        console.log(`     Error: ${result.error}`);
      }
    });

    console.log('\n🎉 Claude Code SDK Testing Complete!');
    
    if (totalPassed === totalSuites) {
      console.log('🌟 All test suites completed successfully!');
      console.log('🔧 Your Claude Code SDK integration is working perfectly.');
    } else {
      console.log('⚠️  Some test suites had issues. Check the logs above.');
      console.log('💡 Consider running individual test suites to debug specific issues.');
    }

    console.log('\n📁 Generated Files During Testing:');
    console.log('   - Test execution logs');
    console.log('   - Created test files and directories');
    console.log('   - Hook execution logs (if hooks worked)');
    
    console.log('\n🔗 Useful Commands:');
    console.log('   bun run comprehensive-tools-test.ts  # Run tools test only');
    console.log('   bun run mcp-test.ts                  # Run MCP test only'); 
    console.log('   bun run hooks-test.ts                # Run hooks test only');
    
    console.log('\n' + '='.repeat(80));
  }

  async run() {
    console.log('🚀 Claude Code SDK - Master Test Runner');
    console.log('='.repeat(50));
    
    console.log('\nThis will run comprehensive tests of:');
    this.testSuites.forEach((suite, index) => {
      console.log(`${index + 1}. ${suite.name} (${suite.estimated_time})`);
      console.log(`   ${suite.description}`);
    });

    console.log('\n⚠️  IMPORTANT NOTES:');
    console.log('   • Tests will prompt for tool permissions');
    console.log('   • You can type "a" to allow all tools automatically');
    console.log('   • Some tests require internet access');
    console.log('   • MCP tests may fail if MCP servers are not installed');
    console.log('   • Hooks tests will play sounds and create logs');
    
    const response = await this.promptUser('\n❓ Ready to start all tests? (y/n): ');
    
    if (!response.toLowerCase().startsWith('y')) {
      console.log('🛑 Tests cancelled by user');
      return;
    }

    console.log('\n🎬 Starting master test run...');
    
    const startTime = Date.now();
    
    // Run all test suites
    for (const suite of this.testSuites) {
      const continueResponse = await this.promptUser(`\n❓ Run ${suite.name}? (y/n/q=quit): `);
      
      if (continueResponse.toLowerCase() === 'q') {
        console.log('🛑 Tests stopped by user');
        break;
      }
      
      if (continueResponse.toLowerCase().startsWith('y')) {
        await this.runTestSuite(suite);
      } else {
        console.log(`⏭️  Skipped: ${suite.name}`);
        this.results.push({
          suite: suite.name,
          success: false,
          duration: 0,
          error: 'Skipped by user'
        });
      }
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`\n⏱️  Master test run completed in ${(totalTime / 1000).toFixed(1)} seconds`);
    
    this.printFinalSummary();
  }
}

async function main() {
  const runner = new MasterTestRunner();
  await runner.run();
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Master test runner failed:', error);
    process.exit(1);
  });
}