#!/usr/bin/env bun

/**
 * 📁 CLAUDE CODE SDK EXAMPLES - Index & Quick Start Guide
 * 
 * This is the main entry point for the Claude Code SDK examples collection.
 * It provides an interactive menu to explore and run different SDK examples,
 * from basic integration to advanced enterprise features.
 * 
 * 🎯 FUNCTIONALITY:
 * - Interactive menu system for exploring examples
 * - Quick start guide for new users
 * - Example categorization and difficulty levels
 * - Direct execution of selected examples
 * - Comprehensive documentation references
 * 
 * 🔧 AVAILABLE EXAMPLES:
 * 📚 BEGINNER:
 * ✅ simple-claude-test.ts - Basic SDK integration (no permissions)
 * ✅ quick-demo.ts - Simple demo with auto-permissions
 * 
 * 🧪 INTERMEDIATE:
 * ✅ claude-file-creator.ts - Permission system basics
 * ✅ test-file-creation.ts - File operations with permissions
 * ✅ demo-all-features.ts - Multi-tool showcase
 * 
 * 🚀 ADVANCED:
 * ✅ comprehensive-tools-test.ts - Complete tool suite testing
 * ✅ enhanced-comprehensive-test.ts - Security-focused testing
 * ✅ context-aware-sdk.ts - Session management & context preservation
 * ✅ context-preserving-test.ts - Multi-session memory validation
 * 
 * 🔌 SPECIALIZED:
 * ✅ mcp-test.ts - MCP server integration testing
 * ✅ enhanced-mcp-test.ts - Secure MCP testing with warnings
 * ✅ hooks-test.ts - Automation and completion hooks
 * 
 * 👑 ULTIMATE:
 * ✅ ultimate-claude-sdk.ts - "One script to rule them all"
 * 
 * 🧪 HOW TO USE:
 * 1. Run: `bun run index.ts` or `bun run .`
 * 2. Choose from the interactive menu
 * 3. Follow the guided experience for your skill level
 * 4. Explore examples from basic to advanced
 * 5. Reference documentation for each script
 * 
 * 📋 QUICK START RECOMMENDATIONS:
 * - New to Claude Code? Start with simple-claude-test.ts
 * - Want a quick demo? Try quick-demo.ts
 * - Learning permissions? Use claude-file-creator.ts
 * - Need comprehensive testing? Run comprehensive-tools-test.ts
 * - Want everything? Use ultimate-claude-sdk.ts
 * 
 * 💡 WHEN TO USE:
 * - First time exploring Claude Code SDK examples
 * - Need guided experience for different skill levels
 * - Want to understand available capabilities
 * - Reference for choosing appropriate examples
 * - Teaching or learning Claude Code SDK integration
 * 
 * 🔗 QUICK REFERENCE:
 * - All scripts support `bun run <script-name>`
 * - Most scripts have built-in help and documentation
 * - Enhanced permission system available in advanced examples
 * - Context preservation features in context-aware examples
 * - MCP integration in specialized MCP examples
 */

import { createInterface } from 'readline';

interface Example {
  file: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Specialized' | 'Ultimate';
  estimatedTime: string;
  prerequisites?: string[];
}

const examples: Example[] = [
  // Beginner Examples
  {
    file: 'simple-claude-test.ts',
    name: 'Simple Claude Test',
    description: 'Basic SDK integration without permission callbacks - perfect first test',
    difficulty: 'Beginner',
    estimatedTime: '1-2 min'
  },
  {
    file: 'quick-demo.ts', 
    name: 'Quick Demo',
    description: 'Fast demonstration with auto-permissions and completion sounds',
    difficulty: 'Beginner',
    estimatedTime: '1-2 min',
    prerequisites: ['done.mp3 for completion sound']
  },

  // Intermediate Examples
  {
    file: 'claude-file-creator.ts',
    name: 'File Creator with Permissions',
    description: 'Learn permission callbacks with basic file creation workflow',
    difficulty: 'Intermediate', 
    estimatedTime: '2-3 min'
  },
  {
    file: 'test-file-creation.ts',
    name: 'File Creation Test',
    description: 'Direct file creation testing with permission handling',
    difficulty: 'Intermediate',
    estimatedTime: '2-3 min'
  },
  {
    file: 'demo-all-features.ts',
    name: 'Complete Features Demo',
    description: 'Multi-tool showcase with hooks integration',
    difficulty: 'Intermediate',
    estimatedTime: '3-5 min',
    prerequisites: ['done.mp3 for completion sound']
  },

  // Advanced Examples
  {
    file: 'comprehensive-tools-test.ts',
    name: 'Comprehensive Tools Test',
    description: 'Systematic testing of all Claude Code tools with detailed reporting',
    difficulty: 'Advanced',
    estimatedTime: '5-15 min'
  },
  {
    file: 'enhanced-comprehensive-test.ts',
    name: 'Enhanced Security Testing',
    description: 'Advanced tool testing with security analysis and risk assessment',
    difficulty: 'Advanced', 
    estimatedTime: '5-10 min',
    prerequisites: ['enhanced-permission-system.ts']
  },
  {
    file: 'context-aware-sdk.ts',
    name: 'Context-Aware SDK',
    description: 'Session management and context preservation across interactions',
    difficulty: 'Advanced',
    estimatedTime: '3-5 min',
    prerequisites: ['enhanced-permission-system.ts']
  },
  {
    file: 'context-preserving-test.ts',
    name: 'Context Preservation Test',
    description: 'Multi-session memory validation and context continuity testing',
    difficulty: 'Advanced',
    estimatedTime: '5-10 min',
    prerequisites: ['enhanced-permission-system.ts']
  },

  // Specialized Examples
  {
    file: 'mcp-test.ts',
    name: 'MCP Integration Test',
    description: 'Model Context Protocol server integration testing',
    difficulty: 'Specialized',
    estimatedTime: '3-5 min',
    prerequisites: ['MCP servers installed globally']
  },
  {
    file: 'enhanced-mcp-test.ts',
    name: 'Secure MCP Testing',
    description: 'MCP testing with comprehensive security warnings and analysis',
    difficulty: 'Specialized',
    estimatedTime: '5-10 min',
    prerequisites: ['MCP servers installed globally']
  },
  {
    file: 'hooks-test.ts',
    name: 'Hooks System Test',
    description: 'Test automation hooks, completion sounds, and event triggers',
    difficulty: 'Specialized',
    estimatedTime: '3-5 min',
    prerequisites: ['done.mp3, .claude/settings.local.json hooks config']
  },

  // Ultimate Example
  {
    file: 'ultimate-claude-sdk.ts',
    name: 'Ultimate Claude SDK',
    description: '"One Script to Rule Them All" - Complete enterprise-grade integration',
    difficulty: 'Ultimate',
    estimatedTime: '5-30 min',
    prerequisites: ['All enhanced features and dependencies']
  }
];

class ExampleBrowser {
  private rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  async showMenu() {
    console.log('📁 CLAUDE CODE SDK EXAMPLES - Interactive Guide');
    console.log('='.repeat(60));
    console.log('🎯 Choose your experience level and explore examples:');
    console.log();

    const categories = ['Beginner', 'Intermediate', 'Advanced', 'Specialized', 'Ultimate'] as const;
    
    categories.forEach(category => {
      const categoryExamples = examples.filter(e => e.difficulty === category);
      if (categoryExamples.length > 0) {
        console.log(`📚 ${category.toUpperCase()}:`);
        categoryExamples.forEach((example, index) => {
          const globalIndex = examples.indexOf(example) + 1;
          console.log(`   ${globalIndex}. ${example.name} (${example.estimatedTime})`);
          console.log(`      ${example.description}`);
          if (example.prerequisites) {
            console.log(`      ⚠️  Requires: ${example.prerequisites.join(', ')}`);
          }
        });
        console.log();
      }
    });

    console.log('🔧 UTILITY OPTIONS:');
    console.log('   h. Show detailed help and documentation');
    console.log('   q. Quit');
    console.log('='.repeat(60));
  }

  async askChoice(): Promise<string> {
    return new Promise(resolve => {
      this.rl.question('\n❓ Choose example number, or h for help, q to quit: ', resolve);
    });
  }

  async runExample(example: Example) {
    console.log(`\n🚀 Running: ${example.name}`);
    console.log(`📋 Description: ${example.description}`);
    console.log(`⏱️  Estimated time: ${example.estimatedTime}`);
    
    if (example.prerequisites) {
      console.log(`⚠️  Prerequisites: ${example.prerequisites.join(', ')}`);
    }

    console.log('='.repeat(40));
    
    try {
      const { spawn } = await import('child_process');
      const child = spawn('bun', ['run', example.file], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      await new Promise<void>((resolve, reject) => {
        child.on('close', (code) => {
          if (code === 0) {
            console.log(`\n✅ ${example.name} completed successfully!`);
          } else {
            console.log(`\n❌ ${example.name} exited with code ${code}`);
          }
          resolve();
        });

        child.on('error', reject);
      });
    } catch (error) {
      console.error(`💥 Failed to run ${example.name}:`, error);
    }
  }

  showHelp() {
    console.log('\n📚 CLAUDE CODE SDK EXAMPLES - DETAILED HELP');
    console.log('='.repeat(60));
    console.log('🎯 CHOOSING THE RIGHT EXAMPLE:');
    console.log();
    console.log('🌟 First time with Claude Code SDK?');
    console.log('   → Start with "Simple Claude Test" (#1)');
    console.log('   → This requires no setup and tests basic functionality');
    console.log();
    console.log('🔧 Want to understand permissions?');
    console.log('   → Try "File Creator with Permissions" (#3)');
    console.log('   → Learn interactive permission callbacks');
    console.log();
    console.log('🎬 Want a quick impressive demo?');
    console.log('   → Use "Quick Demo" (#2) or "Complete Features Demo" (#5)');
    console.log('   → Shows multiple tools working together');
    console.log();
    console.log('🧪 Need comprehensive testing?');
    console.log('   → Run "Comprehensive Tools Test" (#6)');
    console.log('   → Tests all major Claude Code capabilities');
    console.log();
    console.log('🛡️  Interested in security features?');
    console.log('   → Try "Enhanced Security Testing" (#7)');
    console.log('   → Advanced permission system with risk analysis');
    console.log();
    console.log('🧠 Want to learn context preservation?');
    console.log('   → Use "Context-Aware SDK" (#8) or "Context Preservation Test" (#9)');
    console.log('   → Demonstrates memory and session management');
    console.log();
    console.log('👑 Want the ultimate experience?');
    console.log('   → Run "Ultimate Claude SDK" (#12)');
    console.log('   → The most comprehensive integration available');
    console.log();
    console.log('💡 GENERAL TIPS:');
    console.log('   • Most examples allow auto-permission with "a" response');
    console.log('   • Enhanced examples require enhanced-permission-system.ts');
    console.log('   • MCP examples need MCP servers installed globally');
    console.log('   • Hooks examples need done.mp3 and configuration');
    console.log('   • All examples have built-in documentation');
    console.log('='.repeat(60));
  }

  async run() {
    console.log('👋 Welcome to Claude Code SDK Examples!');
    console.log('🎯 Interactive guide to help you explore all capabilities\n');

    while (true) {
      await this.showMenu();
      const choice = await this.askChoice();
      
      if (choice.toLowerCase() === 'q') {
        console.log('👋 Thanks for exploring Claude Code SDK examples!');
        break;
      } else if (choice.toLowerCase() === 'h') {
        this.showHelp();
        continue;
      }
      
      const exampleIndex = parseInt(choice) - 1;
      if (exampleIndex >= 0 && exampleIndex < examples.length) {
        await this.runExample(examples[exampleIndex]);
      } else {
        console.log('❌ Invalid choice. Please try again.');
      }
      
      console.log('\n' + '='.repeat(40));
    }
    
    this.rl.close();
  }
}

async function main() {
  const browser = new ExampleBrowser();
  await browser.run();
}

if (require.main === module) {
  main().catch(console.error);
}