# Claude Code SDK Examples & Integration

🚀 **Comprehensive Claude Code SDK integration with TypeScript and Bun**

This project provides a complete collection of Claude Code SDK examples, from basic integration to advanced enterprise features including enhanced security, context preservation, MCP server integration, and automation hooks.

## 🏃‍♂️ Quick Start

### Installation

```bash
bun install
```

### Interactive Examples Browser

```bash
# Launch the interactive guide
bun run index.ts
# or
bun run .
```

### Run Specific Examples

```bash
# Basic SDK test (no permissions)
bun run scripts/examples/simple-claude-test.ts

# File creation with permissions
bun run scripts/examples/claude-file-creator.ts

# Comprehensive tool testing
bun run scripts/examples/comprehensive-tools-test.ts

# "One script to rule them all"
bun run scripts/examples/ultimate-claude-sdk.ts
```

## 📚 Example Categories

### 🌟 **Beginner Examples**
- `simple-claude-test.ts` - Basic SDK integration without permissions
- `quick-demo.ts` - Fast demo with auto-permissions and completion sounds

### 🧪 **Intermediate Examples**
- `claude-file-creator.ts` - Permission system basics with file creation
- `test-file-creation.ts` - Direct file operations with permissions
- `demo-all-features.ts` - Multi-tool showcase with hooks integration

### 🚀 **Advanced Examples**
- `comprehensive-tools-test.ts` - Complete tool suite testing
- `enhanced-comprehensive-test.ts` - Security-focused testing with risk analysis
- `context-aware-sdk.ts` - Session management and context preservation
- `context-preserving-test.ts` - Multi-session memory validation

### 🔌 **Specialized Examples**
- `mcp-test.ts` - Model Context Protocol server integration
- `enhanced-mcp-test.ts` - Secure MCP testing with security warnings
- `hooks-test.ts` - Automation hooks and completion events

### 👑 **Ultimate Integration**
- `ultimate-claude-sdk.ts` - Complete enterprise-grade integration with all features

## 🛡️ Security Features

- **Enhanced Permission System** - 4-level risk assessment (LOW/MEDIUM/HIGH/CRITICAL)
- **Content Security Scanning** - Automatic detection of sensitive data patterns
- **Parameter Analysis** - Security implications of tool parameters
- **MCP Security Warnings** - Comprehensive analysis of external tool risks
- **Interactive Permission Controls** - Advanced user control options

## 🧠 Advanced Features

- **Context Preservation** - Session management across multiple interactions
- **Cost Tracking** - Usage analytics and cost monitoring
- **MCP Integration** - External tool server support
- **Hooks System** - Automation and event-driven actions
- **Streaming Responses** - Real-time communication display

## 📋 Prerequisites

### Required
- [Bun](https://bun.com) runtime
- Claude Code CLI installed locally
- `@anthropic-ai/claude-code` SDK package

### Optional
- `done.mp3` file for completion sounds
- MCP servers for external integrations:
  ```bash
  npm install -g @modelcontextprotocol/server-filesystem
  npm install -g @modelcontextprotocol/server-sqlite
  npm install -g @modelcontextprotocol/server-git
  ```
- `ffplay` for audio playback (hooks)

## 🔧 Configuration

The project includes configuration for:
- **Hooks**: `.claude/settings.local.json` - Completion sounds and automation
- **Enhanced Permissions**: Advanced security analysis and risk assessment
- **Session Management**: Context preservation across interactions
- **MCP Servers**: External tool integration configuration

## 📖 Documentation

Detailed documentation is available in:
- `scripts/examples/README.md` - Complete examples reference
- Individual script headers - Comprehensive functionality documentation
- Interactive help system - Run `bun run index.ts` and select 'h'

## 🎯 Use Cases

- **Learning**: Progressive examples from basic to advanced
- **Development**: Templates and patterns for SDK integration
- **Production**: Enterprise-grade security and session management
- **Testing**: Comprehensive validation of Claude Code capabilities
- **Automation**: Hooks and event-driven workflows

## 🤝 Contributing

This project demonstrates best practices for Claude Code SDK integration. Each example includes comprehensive documentation and follows established patterns.

## 📄 License

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

---

**🎯 Start with `bun run index.ts` for an interactive guide to all examples!**
