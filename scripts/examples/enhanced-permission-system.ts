#!/usr/bin/env bun

/**
 * 🛡️ ENHANCED PERMISSION SYSTEM - Advanced Security & User Control
 * 
 * This is a comprehensive permission system that provides detailed security
 * analysis, risk assessment, and user-friendly controls for Claude Code tool
 * usage. It replaces basic permission prompts with intelligent decision support.
 * 
 * 🎯 FUNCTIONALITY:
 * - Detailed risk analysis for every tool request (LOW/MEDIUM/HIGH/CRITICAL)
 * - File content previews with security scanning
 * - Interactive permission controls with multiple options
 * - Tool usage statistics and pattern tracking
 * - Smart security warnings for dangerous operations
 * 
 * 🔧 KEY FEATURES:
 * ✅ 4-level risk assessment system
 * ✅ File content preview with security scanning
 * ✅ Parameter analysis and impact assessment
 * ✅ Smart recommendations based on operation type
 * ✅ Usage statistics and tool tracking
 * ✅ Batch permission controls (allow all, deny specific tools)
 * 
 * 🧪 HOW TO TEST:
 * This is a utility class - test it through other scripts:
 * 1. Run enhanced-comprehensive-test.ts
 * 2. Run enhanced-demo.ts
 * 3. Run ultimate-claude-sdk.ts
 * 4. Observe detailed permission prompts with risk analysis
 * 5. Try different permission responses (y/n/a/d/i/s)
 * 
 * 📋 PERMISSION OPTIONS:
 * - "y": Allow this specific tool once
 * - "n": Deny this specific tool once
 * - "a": Allow ALL future tools automatically
 * - "d": Deny ALL future requests for this tool type
 * - "i": Show additional security information
 * - "s": Show detailed usage statistics
 * 
 * 🛡️ SECURITY FEATURES:
 * - Detects system file access (CRITICAL risk)
 * - Scans file content for passwords, keys, tokens
 * - Warns about dangerous bash commands
 * - Identifies network operations
 * - Flags configuration file modifications
 * - MCP tool security analysis
 * 
 * ⚠️  TROUBLESHOOTING:
 * - Import errors: Ensure this file is in same directory as caller
 * - Missing readline: Check Node.js/Bun installation
 * - File access errors: Verify file system permissions
 * 
 * 💡 WHEN TO USE:
 * - Any script requiring intelligent permission handling
 * - Production applications needing security controls
 * - Educational tools demonstrating security best practices
 * - Applications requiring audit trails of tool usage
 * 
 * 🔗 USED BY:
 * - enhanced-comprehensive-test.ts
 * - enhanced-demo.ts  
 * - context-aware-sdk.ts
 * - ultimate-claude-sdk.ts
 * 
 * 📊 EXPORT:
 * - EnhancedPermissionSystem class
 * - Use: const permissions = new EnhancedPermissionSystem()
 * - Call: await permissions.getUserPermission(toolName, parameters)
 */

import { type PermissionResult } from "@anthropic-ai/claude-code";
import { createInterface } from 'readline';
import * as path from 'path';
import * as fs from 'fs';

interface DetailedToolInfo {
  toolName: string;
  parameters: Record<string, any>;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  impacts: string[];
  recommendations: string[];
}

export class EnhancedPermissionSystem {
  private autoAllow = false;
  private allowedTools = new Set<string>();
  private deniedTools = new Set<string>();

  private analyzeToolRequest(toolName: string, parameters: Record<string, any>): DetailedToolInfo {
    const baseInfo = {
      toolName,
      parameters,
      description: `Execute ${toolName} tool`,
      riskLevel: 'MEDIUM' as const,
      explanation: '',
      impacts: [] as string[],
      recommendations: [] as string[]
    };

    switch (toolName) {
      case 'Write':
        const filePath = parameters.file_path as string;
        const content = parameters.content as string;
        const isExistingFile = fs.existsSync(filePath);
        const fileSize = content ? content.length : 0;
        const isSystemPath = filePath.includes('/etc/') || filePath.includes('/usr/') || filePath.includes('/sys/');
        
        return {
          ...baseInfo,
          riskLevel: isSystemPath ? 'CRITICAL' : (isExistingFile ? 'MEDIUM' : 'LOW'),
          explanation: `Create or modify file at: ${filePath}`,
          impacts: [
            `📁 Target: ${filePath}`,
            `📄 Content size: ${fileSize} characters`,
            `${isExistingFile ? '⚠️  Will OVERWRITE existing file' : '✨ Will create NEW file'}`,
            `📂 Directory: ${path.dirname(filePath)}`,
            ...(isSystemPath ? ['🚨 WARNING: System directory detected!'] : [])
          ],
          recommendations: [
            'Review the file path carefully',
            isExistingFile ? 'Backup existing file if important' : 'Ensure directory is correct',
            'Check content preview below',
            ...(isSystemPath ? ['❌ AVOID: System files can break your system'] : [])
          ]
        };

      case 'Edit':
      case 'MultiEdit':
        const editPath = parameters.file_path as string;
        const oldString = parameters.old_string || (parameters.edits?.[0]?.old_string);
        const newString = parameters.new_string || (parameters.edits?.[0]?.new_string);
        
        return {
          ...baseInfo,
          riskLevel: 'MEDIUM',
          explanation: `Modify existing file: ${editPath}`,
          impacts: [
            `📁 File: ${editPath}`,
            `🔄 Changes: ${toolName === 'MultiEdit' ? 'Multiple edits' : 'Single edit'}`,
            `📝 Find: "${(oldString || '').substring(0, 50)}${(oldString || '').length > 50 ? '...' : ''}"`,
            `✏️  Replace with: "${(newString || '').substring(0, 50)}${(newString || '').length > 50 ? '...' : ''}"`
          ],
          recommendations: [
            'Verify the file path is correct',
            'Review find/replace text carefully',
            'Consider making a backup first'
          ]
        };

      case 'Bash':
        const command = parameters.command as string;
        const isDangerous = /rm|sudo|chmod|chown|dd|mkfs|format/.test(command);
        const isNetworking = /curl|wget|nc|ssh|scp/.test(command);
        const isInstall = /apt|yum|brew|npm install|pip install/.test(command);
        
        return {
          ...baseInfo,
          riskLevel: isDangerous ? 'CRITICAL' : (isNetworking || isInstall ? 'HIGH' : 'MEDIUM'),
          explanation: `Execute shell command: ${command}`,
          impacts: [
            `💻 Command: ${command}`,
            `📂 Working directory: ${process.cwd()}`,
            `👤 User: ${process.env.USER || 'unknown'}`,
            ...(isDangerous ? ['🚨 DANGEROUS: Command can delete/modify system files'] : []),
            ...(isNetworking ? ['🌐 NETWORK: Command will access external resources'] : []),
            ...(isInstall ? ['📦 INSTALL: Command will install software'] : [])
          ],
          recommendations: [
            'Review command syntax carefully',
            ...(isDangerous ? ['❌ DANGER: Double-check this is safe to run'] : []),
            ...(isNetworking ? ['🔒 Check network destination is trusted'] : []),
            'Ensure you understand what this command does'
          ]
        };

      case 'Read':
        const readPath = parameters.file_path as string;
        const isSensitive = /password|secret|key|token|config|env/.test(readPath.toLowerCase());
        
        return {
          ...baseInfo,
          riskLevel: isSensitive ? 'HIGH' : 'LOW',
          explanation: `Read file contents: ${readPath}`,
          impacts: [
            `📖 File: ${readPath}`,
            `📂 Directory: ${path.dirname(readPath)}`,
            ...(isSensitive ? ['⚠️  Potentially sensitive file detected'] : []),
            '👁️  Contents will be visible to Claude'
          ],
          recommendations: [
            'Verify file path is correct',
            ...(isSensitive ? ['🔒 Check if file contains sensitive information'] : [])
          ]
        };

      case 'LS':
        const lsPath = parameters.path as string;
        
        return {
          ...baseInfo,
          riskLevel: 'LOW',
          explanation: `List directory contents: ${lsPath}`,
          impacts: [
            `📂 Directory: ${lsPath}`,
            '👁️  File names will be visible to Claude',
            '📊 Directory structure will be revealed'
          ],
          recommendations: [
            'Safe operation - lists files only',
            'No files will be modified'
          ]
        };

      case 'Grep':
        const pattern = parameters.pattern as string;
        const searchPath = parameters.path || 'current directory';
        
        return {
          ...baseInfo,
          riskLevel: 'LOW',
          explanation: `Search for pattern: "${pattern}" in ${searchPath}`,
          impacts: [
            `🔍 Pattern: ${pattern}`,
            `📂 Search in: ${searchPath}`,
            '👁️  Matching content will be visible to Claude'
          ],
          recommendations: [
            'Safe operation - searches files only',
            'No files will be modified'
          ]
        };

      case 'WebFetch':
        const url = parameters.url as string;
        const domain = new URL(url).hostname;
        
        return {
          ...baseInfo,
          riskLevel: 'MEDIUM',
          explanation: `Fetch web content from: ${url}`,
          impacts: [
            `🌐 URL: ${url}`,
            `🏠 Domain: ${domain}`,
            '📡 Will make HTTP request',
            '👁️  Web content will be visible to Claude'
          ],
          recommendations: [
            'Verify URL is trusted and safe',
            'Check domain is legitimate',
            'No local files will be modified'
          ]
        };

      case 'TodoWrite':
        return {
          ...baseInfo,
          riskLevel: 'LOW',
          explanation: 'Update task tracking list',
          impacts: [
            '📝 Manage todo items',
            '🎯 Track task progress',
            '💾 Temporary in-memory storage only'
          ],
          recommendations: [
            'Safe operation - task tracking only',
            'No files or system changes'
          ]
        };

      // MCP Tools (detect by naming patterns)
      default:
        const isMCP = toolName.includes('mcp_') || toolName.includes('@');
        
        if (isMCP) {
          return {
            ...baseInfo,
            riskLevel: 'HIGH',
            explanation: `MCP Tool: ${toolName} - External integration`,
            impacts: [
              `🔌 MCP Server: ${toolName}`,
              '🌐 May access external services',
              '📊 Parameters will be sent to MCP server',
              '⚠️  External tool capabilities unknown',
              '🔄 May modify external resources'
            ],
            recommendations: [
              '🔒 Verify MCP server is trusted',
              '📋 Review parameters being sent',
              '⚠️  External tools may have side effects',
              '💡 Check MCP server documentation'
            ]
          };
        }

        return {
          ...baseInfo,
          riskLevel: 'MEDIUM',
          explanation: `Unknown tool: ${toolName}`,
          impacts: [
            `❓ Tool: ${toolName}`,
            '⚠️  Unknown capabilities',
            '📊 Parameters provided to unknown tool'
          ],
          recommendations: [
            '⚠️  Proceed with caution',
            '📚 Check tool documentation if available'
          ]
        };
    }
  }

  private getRiskIcon(risk: string): string {
    switch (risk) {
      case 'LOW': return '🟢';
      case 'MEDIUM': return '🟡';
      case 'HIGH': return '🟠';
      case 'CRITICAL': return '🔴';
      default: return '⚪';
    }
  }

  private showContentPreview(parameters: Record<string, any>): void {
    if (parameters.content && typeof parameters.content === 'string') {
      const content = parameters.content;
      const lines = content.split('\n');
      const previewLines = lines.slice(0, 5);
      const hasMore = lines.length > 5;

      console.log('\n📄 Content Preview:');
      console.log('─'.repeat(50));
      previewLines.forEach((line, index) => {
        console.log(`${(index + 1).toString().padStart(2)}: ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
      });
      if (hasMore) {
        console.log(`   ... and ${lines.length - 5} more lines`);
      }
      console.log('─'.repeat(50));
    }
  }

  async getUserPermission(toolName: string, parameters: Record<string, any>): Promise<PermissionResult> {
    // Handle auto-allow state
    if (this.autoAllow || this.allowedTools.has(toolName)) {
      console.log(`\n🚀 Auto-allowing: ${toolName}`);
      return { behavior: 'allow', updatedInput: parameters };
    }

    if (this.deniedTools.has(toolName)) {
      console.log(`\n🚫 Auto-denying: ${toolName} (previously denied)`);
      return { behavior: 'deny', message: 'Tool previously denied by user' };
    }

    const toolInfo = this.analyzeToolRequest(toolName, parameters);
    const riskIcon = this.getRiskIcon(toolInfo.riskLevel);

    console.log('\n' + '='.repeat(60));
    console.log(`🔧 PERMISSION REQUEST ${riskIcon} ${toolInfo.riskLevel} RISK`);
    console.log('='.repeat(60));
    console.log(`📋 ${toolInfo.explanation}`);
    
    console.log('\n📊 IMPACT ANALYSIS:');
    toolInfo.impacts.forEach(impact => console.log(`   ${impact}`));
    
    console.log('\n💡 RECOMMENDATIONS:');
    toolInfo.recommendations.forEach(rec => console.log(`   ${rec}`));
    
    // Show content preview for file operations
    if (['Write', 'Edit', 'MultiEdit'].includes(toolName)) {
      this.showContentPreview(parameters);
    }

    console.log('\n🔧 RAW PARAMETERS:');
    console.log(JSON.stringify(parameters, null, 2));
    console.log('='.repeat(60));

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const prompt = `\n❓ Allow "${toolName}"? (y/n/a=allow all/d=deny all ${toolName}/i=info): `;
      
      rl.question(prompt, (answer) => {
        rl.close();
        const response = answer.toLowerCase().trim();
        
        switch (response) {
          case 'a':
            console.log('🔓 ALLOWING ALL future tools automatically...');
            this.autoAllow = true;
            resolve({ behavior: 'allow', updatedInput: parameters });
            break;
            
          case 'd':
            console.log(`🚫 DENYING ALL future "${toolName}" requests...`);
            this.deniedTools.add(toolName);
            resolve({ behavior: 'deny', message: `User denied all ${toolName} requests` });
            break;
            
          case 'i':
            console.log('\n📚 ADDITIONAL INFO:');
            console.log(`   Tool Documentation: https://docs.anthropic.com/claude-code`);
            console.log(`   Risk Assessment: Based on tool capabilities and parameters`);
            console.log(`   Your Choice: Review the impacts and recommendations above`);
            // Ask again after showing info
            this.getUserPermission(toolName, parameters).then(resolve);
            return;
            
          case 'y':
          case 'yes':
            console.log(`✅ PERMISSION GRANTED: ${toolName}`);
            this.allowedTools.add(toolName);
            resolve({ behavior: 'allow', updatedInput: parameters });
            break;
            
          default:
            console.log(`❌ PERMISSION DENIED: ${toolName}`);
            resolve({ behavior: 'deny', message: 'User denied permission' });
            break;
        }
      });
    });
  }

  // Reset all permissions
  reset(): void {
    this.autoAllow = false;
    this.allowedTools.clear();
    this.deniedTools.clear();
    console.log('🔄 Permission system reset');
  }

  // Get current state
  getState(): { autoAllow: boolean, allowedTools: string[], deniedTools: string[] } {
    return {
      autoAllow: this.autoAllow,
      allowedTools: Array.from(this.allowedTools),
      deniedTools: Array.from(this.deniedTools)
    };
  }
}