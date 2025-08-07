#!/usr/bin/env bun

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

interface MCPTestResult {
  serverName: string;
  success: boolean;
  tools: string[];
  error?: string;
}

class EnhancedMCPTester {
  private results: MCPTestResult[] = [];

  private analyzeMCPTool(toolName: string, parameters: Record<string, any>, serverContext?: string): void {
    console.log('\n' + '='.repeat(70));
    console.log('🔌 MCP TOOL PERMISSION REQUEST - HIGH RISK');
    console.log('='.repeat(70));
    console.log(`🛡️  SECURITY ANALYSIS: External MCP Tool Request`);
    
    console.log('\n📊 MCP TOOL DETAILS:');
    console.log(`   🔧 Tool Name: ${toolName}`);
    console.log(`   🌐 MCP Server: ${serverContext || 'Unknown Server'}`);
    console.log(`   ⚠️  Risk Level: HIGH (External integration)`);
    
    console.log('\n🔍 PARAMETER ANALYSIS:');
    Object.entries(parameters).forEach(([key, value]) => {
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
      const truncated = valueStr.length > 100 ? valueStr.substring(0, 100) + '...' : valueStr;
      console.log(`   📝 ${key}: ${truncated}`);
      
      // Analyze parameter types for security
      if (key.toLowerCase().includes('path') || key.toLowerCase().includes('file')) {
        console.log(`      🚨 FILE ACCESS: This parameter involves file system access`);
      }
      if (key.toLowerCase().includes('url') || key.toLowerCase().includes('endpoint')) {
        console.log(`      🌐 NETWORK ACCESS: This parameter involves network communication`);
      }
      if (key.toLowerCase().includes('command') || key.toLowerCase().includes('exec')) {
        console.log(`      💻 COMMAND EXECUTION: This parameter may execute commands`);
      }
    });
    
    console.log('\n⚠️  MCP SECURITY WARNINGS:');
    console.log('   🔒 External tools may access your file system');
    console.log('   🌐 External tools may make network requests');
    console.log('   💾 External tools may store or transmit data');
    console.log('   🔄 External tools may modify external services');
    console.log('   📡 Parameters are sent to third-party MCP server');
    
    console.log('\n🛡️  WHAT YOU SHOULD VERIFY:');
    console.log('   ✅ Trust the MCP server source and author');
    console.log('   ✅ Understand what this tool does');
    console.log('   ✅ Review all parameters being sent');
    console.log('   ✅ Consider if data exposure is acceptable');
    console.log('   ✅ Check if tool modifications are reversible');
    
    // Server-specific warnings
    if (serverContext?.includes('filesystem')) {
      console.log('\n📁 FILESYSTEM SERVER WARNINGS:');
      console.log('   🚨 Can read, write, and delete files');
      console.log('   🚨 May access any directory you have permissions for');
      console.log('   🚨 File operations may be irreversible');
    }
    
    if (serverContext?.includes('git')) {
      console.log('\n🔀 GIT SERVER WARNINGS:');
      console.log('   🚨 Can modify git repository state');
      console.log('   🚨 May create commits, branches, or tags');
      console.log('   🚨 Could potentially push to remote repositories');
    }
    
    if (serverContext?.includes('sqlite') || serverContext?.includes('database')) {
      console.log('\n🗄️  DATABASE SERVER WARNINGS:');
      console.log('   🚨 Can read, modify, or delete database data');
      console.log('   🚨 May execute SQL queries');
      console.log('   🚨 Database changes may be difficult to reverse');
    }
    
    console.log('\n🔧 RAW MCP PARAMETERS:');
    console.log(JSON.stringify(parameters, null, 2));
    console.log('='.repeat(70));
  }

  async getUserPermission(toolName: string, parameters: Record<string, any>, serverContext?: string): Promise<PermissionResult> {
    // Detect if this is likely an MCP tool
    const isMCPTool = toolName.includes('mcp_') || 
                     toolName.includes('@') || 
                     serverContext || 
                     !['Write', 'Read', 'Edit', 'Bash', 'LS', 'Grep', 'WebFetch', 'TodoWrite', 'MultiEdit', 'Glob', 'NotebookEdit', 'WebSearch'].includes(toolName);
    
    if (isMCPTool) {
      this.analyzeMCPTool(toolName, parameters, serverContext);
    } else {
      // Standard tool - simpler prompt
      console.log(`\n🔧 Standard Tool Request: ${toolName}`);
      console.log(`📋 Parameters:`, JSON.stringify(parameters, null, 2));
    }

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const riskLevel = isMCPTool ? 'HIGH RISK MCP TOOL' : 'Standard Tool';
    const prompt = `\n❓ Allow ${riskLevel} "${toolName}"? (y/n/i=more info): `;
    
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        rl.close();
        
        const response = answer.toLowerCase().trim();
        
        if (response === 'i') {
          console.log('\n📚 ADDITIONAL INFORMATION:');
          if (isMCPTool) {
            console.log('🔌 MCP (Model Context Protocol) tools are external integrations');
            console.log('🔒 They run with your system permissions');
            console.log('🌐 They may access external services or your local system');
            console.log('📡 Review the server source and documentation before allowing');
            console.log('⚠️  Only allow MCP tools from trusted sources');
          } else {
            console.log('🔧 This is a standard Claude Code tool');
            console.log('🏠 Runs locally within Claude Code environment');
            console.log('📋 Review the parameters to understand what it will do');
          }
          
          // Ask again after showing info
          this.getUserPermission(toolName, parameters, serverContext).then(resolve);
          return;
        }
        
        if (response.startsWith('y')) {
          console.log(`✅ PERMISSION GRANTED: ${toolName}`);
          resolve({
            behavior: 'allow',
            updatedInput: parameters
          });
        } else {
          console.log(`❌ PERMISSION DENIED: ${toolName}`);
          resolve({
            behavior: 'deny',
            message: `User denied permission for ${isMCPTool ? 'MCP tool' : 'tool'}: ${toolName}`
          });
        }
      });
    });
  }

  async testMCPServer(serverName: string, serverConfig: any): Promise<MCPTestResult> {
    console.log(`\n🧪 TESTING MCP SERVER: ${serverName}`);
    console.log('='.repeat(60));
    console.log('🔒 MCP Server Details:');
    console.log(`   📦 Name: ${serverName}`);
    console.log(`   🔧 Type: ${serverConfig.type || 'stdio'}`);
    console.log(`   💻 Command: ${serverConfig.command || 'N/A'}`);
    console.log(`   📋 Args: ${serverConfig.args ? serverConfig.args.join(' ') : 'None'}`);
    console.log('='.repeat(60));
    
    let conversationDone: (() => void) | undefined;
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
          message: { 
            role: 'user', 
            content: `Test the MCP server "${serverName}". Please list any available tools from this server and demonstrate one safely if possible. Be careful with any file or system operations.`
          },
          parent_tool_use_id: null,
          session_id: `mcp-test-${serverName}-${Date.now()}`
        };
        await conversationComplete;
      }

      for await (const message of query({
        prompt: createPromptStream(),
        abortController,
        options: { 
          maxTurns: 3,
          mcpServers: { [serverName]: serverConfig },
          canUseTool: async (toolName: string, parameters: Record<string, any>) => {
            if (!toolsUsed.includes(toolName)) {
              toolsUsed.push(toolName);
            }
            return await this.getUserPermission(toolName, parameters, serverName);
          }
        }
      })) {
        messages.push(message);
        
        if (message.type === 'assistant') {
          console.log('📥 MCP server interaction in progress...');
        } else if (message.type === 'result') {
          if (conversationDone) conversationDone();
          
          const result: MCPTestResult = {
            serverName,
            success: message.subtype === 'success',
            tools: toolsUsed
          };
          
          console.log('\n' + '='.repeat(60));
          console.log(`${result.success ? '✅' : '❌'} MCP Test ${result.success ? 'PASSED' : 'FAILED'}: ${serverName}`);
          console.log(`🔧 Tools discovered: ${toolsUsed.length}`);
          if (toolsUsed.length > 0) {
            console.log(`   ${toolsUsed.join(', ')}`);
          }
          console.log('='.repeat(60));
          
          this.results.push(result);
          return result;
        }
      }

      throw new Error('MCP test completed without result');
      
    } catch (error) {
      if (conversationDone) conversationDone();
      
      const result: MCPTestResult = {
        serverName,
        success: false,
        tools: toolsUsed,
        error: String(error)
      };
      
      console.log(`\n❌ MCP Test FAILED: ${serverName} - ${error}`);
      this.results.push(result);
      return result;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 ENHANCED MCP INTEGRATION TEST SUMMARY');
    console.log('='.repeat(70));
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const totalTools = this.results.reduce((sum, r) => sum + r.tools.length, 0);
    
    console.log(`\n🎯 MCP Results: ${passed}/${total} servers tested successfully`);
    console.log(`🔧 Total Tools Discovered: ${totalTools}`);
    
    console.log('\n📋 Server Results:');
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.serverName}: ${result.tools.length} tools`);
      if (result.tools.length > 0) {
        console.log(`     🔧 Tools: ${result.tools.join(', ')}`);
      }
      if (result.error) {
        console.log(`     ❌ Error: ${result.error}`);
      }
    });
    
    console.log('\n🔐 SECURITY REMINDERS:');
    console.log('   🔒 Only use MCP servers from trusted sources');
    console.log('   📋 Always review tool parameters before allowing');
    console.log('   🌐 Be aware MCP tools may access external services');
    console.log('   💾 Consider what data might be exposed or modified');
    console.log('   🔄 Test MCP tools in safe environments first');
    
    console.log('\n💡 To install popular MCP servers:');
    console.log('   npm install -g @modelcontextprotocol/server-filesystem');
    console.log('   npm install -g @modelcontextprotocol/server-sqlite');
    console.log('   npm install -g @modelcontextprotocol/server-git');
    console.log('   claude mcp add <server-name> <command>');
    
    console.log('='.repeat(70));
  }
}

// Enhanced MCP server configurations with detailed descriptions
const enhancedMCPServers = {
  "filesystem": {
    "type": "stdio",
    "command": "npx",
    "args": ["@modelcontextprotocol/server-filesystem", "/tmp"],
    "description": "File system operations in /tmp directory - can read, write, list files",
    "riskLevel": "HIGH - Full file system access within specified directory"
  },
  
  "sqlite": {
    "type": "stdio", 
    "command": "npx",
    "args": ["@modelcontextprotocol/server-sqlite", "--db-path", "/tmp/test.db"],
    "description": "SQLite database operations - can execute queries, modify data",
    "riskLevel": "HIGH - Full database access, can modify or delete data"
  },
  
  "git": {
    "type": "stdio",
    "command": "npx", 
    "args": ["@modelcontextprotocol/server-git", "--repository", "."],
    "description": "Git repository operations - can commit, branch, view history",
    "riskLevel": "MEDIUM-HIGH - Can modify git state, create commits"
  }
};

async function main() {
  console.log('🚀 ENHANCED MCP INTEGRATION TEST WITH DETAILED SECURITY ANALYSIS');
  console.log('='.repeat(80));
  console.log('🔐 Security Features:');
  console.log('   🔍 Detailed MCP tool analysis and risk assessment');
  console.log('   📋 Parameter inspection and security warnings');
  console.log('   🛡️  Server-specific security guidance');
  console.log('   🔒 Enhanced permission prompts for external tools');
  console.log('   📊 Comprehensive impact analysis');
  console.log('='.repeat(80));
  
  const tester = new EnhancedMCPTester();
  
  console.log('\n⚠️  IMPORTANT SECURITY NOTICE:');
  console.log('🔒 MCP servers are external tools that run with your system permissions');
  console.log('🌐 They may access your file system, network, or external services');
  console.log('📡 Always verify the source and trustworthiness before allowing');
  console.log('🧪 This test requires MCP packages to be installed globally');
  
  // Test each enhanced MCP server configuration
  for (const [serverName, config] of Object.entries(enhancedMCPServers)) {
    console.log(`\n🔍 About to test: ${config.description}`);
    console.log(`⚠️  Risk Level: ${config.riskLevel}`);
    
    await tester.testMCPServer(serverName, config);
    
    // Wait between tests for user to process
    console.log('\n⏳ Waiting 3 seconds before next test...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  tester.printSummary();
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Enhanced MCP test suite failed:', error);
    process.exit(1);
  });
}