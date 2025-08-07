# 📁 Claude Code SDK Examples - Complete Reference

This directory contains comprehensive examples demonstrating every aspect of Claude Code SDK integration, from basic usage to advanced enterprise features.

## 🚀 **Getting Started**

### **Beginner Level**
Start with these scripts to understand basic concepts:

1. **`simple-claude-test.ts`** - Basic SDK integration
   - Simplest possible example
   - No permission callbacks
   - Read-only operations
   - Perfect for verifying setup

2. **`claude-file-creator.ts`** - Permission system basics
   - Interactive permission prompts
   - File creation workflow
   - Stream-based input handling
   - Fixes common callback issues

### **Intermediate Level**
Build on basics with enhanced features:

3. **`comprehensive-tools-test.ts`** - Complete tool testing
   - Tests all major Claude Code tools
   - Systematic test framework
   - Detailed reporting and analytics
   - Cost tracking across tests

4. **`context-aware-sdk.ts`** - Session management
   - Context preservation across runs
   - Session persistence and loading
   - Cost accumulation tracking
   - Continue/resume functionality

### **Advanced Level**
Enterprise-grade features and security:

5. **`enhanced-permission-system.ts`** - Security framework
   - 4-level risk assessment system
   - File content preview and scanning
   - Usage statistics and analytics
   - Utility class for other scripts

6. **`enhanced-comprehensive-test.ts`** - Advanced testing
   - Uses enhanced permission system
   - Detailed security analysis
   - Professional test reporting
   - Risk-aware tool validation

### **Specialized Features**

7. **`hooks-test.ts`** - Automation and events
   - Tests Claude Code hooks system
   - Completion sound integration
   - Event-driven automation
   - Hook configuration validation

8. **`enhanced-mcp-test.ts`** - External integrations
   - MCP server security testing
   - External tool risk analysis
   - Parameter security inspection
   - Third-party integration safety

9. **`context-preserving-test.ts`** - Memory workflows
   - Multi-step conversation testing
   - Context validation across interactions
   - Session continuity verification
   - Memory-dependent workflows

### **Ultimate Integration**

10. **`ultimate-claude-sdk.ts`** - "One Script to Rule Them All" 👑
    - Combines ALL features into single script
    - Interactive and command-line modes
    - Enterprise-grade functionality
    - Maximum security and control

## 📊 **Feature Matrix**

| Script | Permissions | Context | MCP | Hooks | Security | Testing |
|--------|-------------|---------|-----|-------|----------|---------|
| simple-claude-test | ❌ | ❌ | ❌ | ✅ | 🟢 Low | ✅ |
| claude-file-creator | ✅ Basic | ❌ | ❌ | ✅ | 🟡 Medium | ✅ |
| comprehensive-tools-test | ✅ Basic | ❌ | ❌ | ✅ | 🟡 Medium | ✅ Full |
| context-aware-sdk | ✅ Enhanced | ✅ Full | ❌ | ✅ | 🟠 High | ✅ |
| enhanced-permission-system | ✅ Ultimate | ❌ | ✅ | ✅ | 🔴 Maximum | N/A |
| enhanced-comprehensive-test | ✅ Ultimate | ✅ | ✅ | ✅ | 🔴 Maximum | ✅ Full |
| hooks-test | ✅ Basic | ❌ | ❌ | ✅ Focus | 🟡 Medium | ✅ |
| enhanced-mcp-test | ✅ Ultimate | ❌ | ✅ Focus | ✅ | 🔴 Maximum | ✅ |
| context-preserving-test | ✅ Enhanced | ✅ Focus | ❌ | ✅ | 🟠 High | ✅ Full |
| **ultimate-claude-sdk** | ✅ **Ultimate** | ✅ **Full** | ✅ **Full** | ✅ **Full** | 🔴 **Maximum** | ✅ **Complete** |

## 🧪 **Testing Instructions**

### **Quick Start Test**
```bash
# Test basic functionality
bun run simple-claude-test.ts

# Test with permissions
bun run claude-file-creator.ts
```

### **Comprehensive Testing**
```bash
# Full tool suite testing
bun run comprehensive-tools-test.ts

# Enhanced security testing  
bun run enhanced-comprehensive-test.ts
```

### **Advanced Features**
```bash
# Context and session management
bun run context-aware-sdk.ts

# Hooks and automation
bun run hooks-test.ts

# MCP security testing (requires MCP servers)
bun run enhanced-mcp-test.ts
```

### **Ultimate Experience**
```bash
# The complete solution
bun run ultimate-claude-sdk.ts

# Interactive mode
bun run ultimate-claude-sdk.ts interactive

# Direct commands
bun run ultimate-claude-sdk.ts query "your prompt here"
bun run ultimate-claude-sdk.ts test
bun run ultimate-claude-sdk.ts demo
```

## 🛡️ **Security Levels**

### **🟢 Low Security**
- Basic tool usage
- No sensitive operations
- Read-only functionality
- Minimal risk assessment

### **🟡 Medium Security**
- Basic permission prompts
- File operation warnings
- Simple risk evaluation
- Standard safety measures

### **🟠 High Security**
- Enhanced permission system
- Content preview and scanning
- Context-aware decisions
- Advanced risk assessment

### **🔴 Maximum Security**
- 4-level risk analysis
- Comprehensive security scanning
- Parameter security inspection
- MCP tool safety analysis
- Enterprise-grade protection

## 💡 **Usage Recommendations**

### **For Learning**
1. Start with `simple-claude-test.ts`
2. Move to `claude-file-creator.ts` 
3. Try `comprehensive-tools-test.ts`
4. Explore `context-aware-sdk.ts`
5. Master `ultimate-claude-sdk.ts`

### **For Development**
- Use `enhanced-permission-system.ts` as security foundation
- Integrate `context-aware-sdk.ts` for session management
- Test with `comprehensive-tools-test.ts`
- Deploy with `ultimate-claude-sdk.ts`

### **For Production**
- Always use enhanced permission system
- Enable context preservation for workflows
- Test MCP integrations thoroughly
- Configure hooks for automation
- Monitor with analytics and logging

## 📋 **Dependencies**

### **Required**
- `@anthropic-ai/claude-code` SDK
- Bun runtime
- Claude Code CLI installed locally

### **Optional**
- `ffplay` for completion sounds (hooks)
- MCP servers for external integrations
- Internet access for web operations

## ⚠️ **Common Issues & Solutions**

### **Permission Callback Hanging**
- **Problem**: canUseTool callback never triggers
- **Solution**: Use stream-json input format (implemented in fixed scripts)
- **Example**: See `claude-file-creator.ts` for proper implementation

### **Context Not Preserved**
- **Problem**: Claude doesn't remember previous interactions
- **Solution**: Use SDK continue/resume options
- **Example**: See `context-aware-sdk.ts` for proper session management

### **MCP Security Concerns**
- **Problem**: External MCP tools may be unsafe
- **Solution**: Use enhanced security analysis
- **Example**: See `enhanced-mcp-test.ts` for security warnings

### **Missing Completion Sounds**
- **Problem**: Hooks not executing
- **Solution**: Check `.claude/settings.local.json` configuration
- **Example**: See `hooks-test.ts` for proper hook setup

## 🏆 **Best Practices**

1. **Always start with security** - Use enhanced permission system
2. **Test thoroughly** - Run comprehensive test suites
3. **Preserve context** - Use session management for workflows
4. **Monitor costs** - Track usage and optimize
5. **Verify MCP tools** - Only use trusted external integrations
6. **Configure hooks** - Automate common tasks safely
7. **Document usage** - Track tool patterns and decisions

## 🔗 **Additional Resources**

- **Claude Code Documentation**: https://docs.anthropic.com/claude-code
- **SDK Release Notes**: https://claudelog.com/faqs/claude-code-release-notes/
- **MCP Protocol**: https://modelcontextprotocol.io
- **Security Best Practices**: Review enhanced-permission-system.ts
- **Context Management**: Review context-aware-sdk.ts implementation

---

**🎯 Start with `simple-claude-test.ts` and work your way up to `ultimate-claude-sdk.ts` for the complete Claude Code SDK mastery!**