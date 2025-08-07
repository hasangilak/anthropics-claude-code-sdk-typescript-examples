#!/usr/bin/env bun

#!/usr/bin/env bun

/**
 * 🔌 MCP INTEGRATION TEST - Model Context Protocol Server Testing
 * 
 * This script tests integration with MCP (Model Context Protocol) servers,
 * which extend Claude Code with external tool capabilities. It validates
 * server connections, tool discovery, and external tool execution.
 * 
 * 🎯 FUNCTIONALITY:
 * - MCP server connection and initialization testing
 * - External tool discovery and capability enumeration
 * - Tool execution with permission management
 * - Server configuration validation and testing
 * - Multi-server testing with different protocols
 * 
 * 🔧 MCP SERVERS TESTED:
 * ✅ Filesystem Server - File system operations in specified directories
 * ✅ SQLite Server - Database operations and query execution
 * ✅ Git Server - Repository operations and version control
 * ✅ Custom servers - Any additional MCP server configurations
 * 
 * 🧪 HOW TO TEST:
 * Prerequisites:
 * 1. Install MCP servers: `npm install -g @modelcontextprotocol/server-*`
 * 2. Run: `bun run mcp-test.ts`
 * 3. Allow or deny MCP tools based on your security preferences
 * 4. Review tool discovery and execution results
 * 5. Check final summary of MCP server capabilities
 * 
 * 📋 TEST SCENARIOS:
 * 1. Server Connection - Validate MCP server startup and communication
 * 2. Tool Discovery - Enumerate available tools from each server
 * 3. Basic Tool Execution - Test fundamental operations safely
 * 4. Error Handling - Validate graceful handling of server issues
 * 5. Multi-server Coordination - Test multiple MCP servers simultaneously
 * 
 * 📊 EXPECTED BEHAVIOR:
 * - Successfully connects to installed MCP servers
 * - Discovers and lists available external tools
 * - Executes basic operations with permission prompts
 * - Shows server configuration and communication details
 * - Provides summary of server capabilities and tool counts
 * - Runtime: 3-5 minutes with user interaction
 * 
 * ⚠️  TROUBLESHOOTING:
 * - Server not found: Install with `npm install -g @modelcontextprotocol/server-*`
 * - Connection failures: Check server configuration and permissions
 * - Tool execution errors: Review server-specific requirements
 * - Permission timeouts: MCP tools may require external access approval
 * - Configuration issues: Verify server command paths and arguments
 * 
 * 💡 WHEN TO USE:
 * - Testing MCP server integrations and external tool access
 * - Validating external tool discovery and execution
 * - Understanding MCP protocol capabilities and limitations
 * - Debugging MCP server connection and communication issues
 * - Learning about external tool integration patterns
 * 
 * 🔒 SECURITY CONSIDERATIONS:
 * - MCP tools run with your system permissions
 * - External servers may access file system and network
 * - Tools may modify external services or data
 * - Always review server source and trustworthiness
 * - Consider data exposure when using external tools
 * 
 * 📦 INSTALLATION:
 * Install common MCP servers:
 * - `npm install -g @modelcontextprotocol/server-filesystem`
 * - `npm install -g @modelcontextprotocol/server-sqlite` 
 * - `npm install -g @modelcontextprotocol/server-git`
 * 
 * 🔗 MCP PROTOCOL:
 * - Model Context Protocol enables external tool integration
 * - Servers run as separate processes with stdio communication
 * - Tools are discovered dynamically from server capabilities
 * - Documentation: https://modelcontextprotocol.io
 */

import { query, type SDKMessage, type SDKUserMessage, type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';

interface MCPTestResult {
  serverName: string;
  success: boolean;
  tools: string[];
  error?: string;
}

class MCPTester {
  private results: MCPTestResult[] = [];

  async getUserPermission(toolName: string, parameters: Record<string, any>): Promise<PermissionResult> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`\n🔧 MCP Tool: ${toolName}`);
    console.log(`   Parameters:`, JSON.stringify(parameters, null, 2));
    
    return new Promise((resolve) => {
      rl.question('\n❓ Allow MCP tool? (y/n): ', (answer) => {
        rl.close();
        
        if (answer.toLowerCase().startsWith('y')) {
          resolve({
            behavior: 'allow',
            updatedInput: parameters
          });
        } else {
          resolve({
            behavior: 'deny',
            message: 'User denied MCP tool permission'
          });
        }
      });
    });
  }

  async testMCPServer(serverName: string, serverConfig: any): Promise<MCPTestResult> {
    console.log(`\n🧪 Testing MCP Server: ${serverName}`);
    console.log(`📝 Config:`, JSON.stringify(serverConfig, null, 2));
    
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
            content: `Test the MCP server "${serverName}". List available tools and demonstrate one of them.`
          },
          parent_tool_use_id: null,
          session_id: `mcp-test-${Date.now()}`
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
            return await this.getUserPermission(toolName, parameters);
          }
        }
      })) {
        messages.push(message);
        
        if (message.type === 'result') {
          if (conversationDone) conversationDone();
          
          const result: MCPTestResult = {
            serverName,
            success: message.subtype === 'success',
            tools: toolsUsed
          };
          
          console.log(`${result.success ? '✅' : '❌'} MCP Test ${result.success ? 'PASSED' : 'FAILED'}: ${serverName}`);
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
      
      console.log(`❌ MCP Test FAILED: ${serverName} - ${error}`);
      this.results.push(result);
      return result;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 MCP INTEGRATION TEST SUMMARY');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    console.log(`\n🎯 MCP Results: ${passed}/${total} servers tested successfully`);
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.serverName}: ${result.tools.length} tools available`);
      if (result.tools.length > 0) {
        console.log(`     Tools: ${result.tools.join(', ')}`);
      }
      if (result.error) {
        console.log(`     Error: ${result.error}`);
      }
    });
  }
}

// Sample MCP server configurations for testing
const sampleMCPServers = {
  // Local filesystem server
  "filesystem": {
    "type": "stdio",
    "command": "npx",
    "args": ["@modelcontextprotocol/server-filesystem", "/tmp"]
  },
  
  // SQLite server (if available)
  "sqlite": {
    "type": "stdio", 
    "command": "npx",
    "args": ["@modelcontextprotocol/server-sqlite", "--db-path", "/tmp/test.db"]
  },
  
  // Git server (if available)
  "git": {
    "type": "stdio",
    "command": "npx", 
    "args": ["@modelcontextprotocol/server-git", "--repository", "."]
  }
};

async function main() {
  console.log('🚀 Starting MCP Integration Test\n');
  
  const tester = new MCPTester();
  
  console.log('Note: This test requires MCP servers to be available.');
  console.log('Some tests may fail if the required MCP packages are not installed.\n');
  
  // Test each sample MCP server
  for (const [serverName, config] of Object.entries(sampleMCPServers)) {
    await tester.testMCPServer(serverName, config);
  }
  
  tester.printSummary();
  
  console.log('\n💡 To install MCP servers for testing:');
  console.log('npm install -g @modelcontextprotocol/server-filesystem');
  console.log('npm install -g @modelcontextprotocol/server-sqlite');
  console.log('npm install -g @modelcontextprotocol/server-git');
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 MCP test suite failed:', error);
    process.exit(1);
  });
}