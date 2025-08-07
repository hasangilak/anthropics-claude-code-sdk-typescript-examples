# 👑 ULTIMATE CLAUDE CODE SDK - Usage Guide

## "One Script to Rule Them All" 🚀

The **Ultimate Claude Code SDK** combines ALL enhanced features into a single, comprehensive script that provides the most advanced Claude Code integration possible.

## 🎯 **Features Included**

### 🔒 **Ultimate Permission System**
- **Detailed risk analysis** (LOW/MEDIUM/HIGH/CRITICAL)
- **Content previews** with security scanning  
- **Usage statistics** and tool tracking
- **Interactive controls** (allow once, deny all, auto-allow)
- **Security warnings** for sensitive data detection

### 🧠 **Advanced Context Preservation**
- **Automatic session management** with persistence
- **Context strategy selection** (continue/resume/new)
- **Cost tracking** across sessions
- **Conversation summaries** and tool usage history
- **Session statistics** and analytics

### 🔌 **Enhanced MCP Integration**
- **Security analysis** for external MCP tools
- **Parameter inspection** with warnings
- **Server-specific guidance** (filesystem, git, database)
- **Data exposure considerations**

### 📊 **Comprehensive Analytics** 
- **Tool usage statistics** and patterns
- **Permission decision tracking**
- **Cost analysis** per session
- **Performance metrics** and timing

## 🚀 **Usage Options**

### **1. Interactive Mode (Default)**
```bash
bun run ultimate-claude-sdk.ts
# OR
bun run ultimate-claude-sdk.ts interactive
```

**Interactive Commands:**
- `query [prompt]` - Run ultimate query with full features
- `test` - Run comprehensive test suite  
- `stats` - Show detailed statistics
- `clear` - Clear all data and reset
- `help` - Show command help
- `exit` - Exit interactive mode

### **2. Direct Commands**
```bash
# Single query
bun run ultimate-claude-sdk.ts query "Create a file with project info"

# Run test suite
bun run ultimate-claude-sdk.ts test

# Quick demo
bun run ultimate-claude-sdk.ts demo

# Show statistics  
bun run ultimate-claude-sdk.ts stats

# Clear all data
bun run ultimate-claude-sdk.ts clear
```

## 🛡️ **Permission System Guide**

When tools are requested, you'll see detailed analysis:

```
============================================================
🔧 ULTIMATE PERMISSION REQUEST 🟡 MEDIUM RISK
============================================================
📋 Create or modify file at: /path/to/file.txt

📊 IMPACT ANALYSIS:
   📁 Target: /path/to/file.txt
   📄 Content size: 1024 characters (1KB)
   ✨ Will create NEW file
   📂 Directory: /path/to
   📊 Usage count: 3 times

💡 SECURITY RECOMMENDATIONS:
   Review the file path and content carefully
   Verify directory permissions
   Check content preview below for sensitive data

📄 CONTENT PREVIEW:
────────────────────────────────────────────
 1: Hello World!
 2: This is sample content...
────────────────────────────────────────────

🔧 PARAMETER DETAILS:
   📝 file_path: /path/to/file.txt
   📝 content: Hello World! This is sample...
============================================================

❓ "Write" (y=allow once | n=deny once | a=allow all tools | d=deny all Write | i=more info | s=show stats):
```

### **Permission Options:**
- **`y`** - Allow this specific tool once
- **`n`** - Deny this specific tool once  
- **`a`** - Allow ALL future tools automatically
- **`d`** - Deny ALL future requests for this tool type
- **`i`** - Show more security information
- **`s`** - Show detailed usage statistics

## 🧠 **Context Management**

The script automatically detects previous sessions:

```
🔄 ULTIMATE CONTEXT MANAGEMENT:
   📋 Previous session: 1c64b5e7-636e...
   📅 Last used: 2025-08-07 12:10:57
   💬 Messages: 9
   💰 Total cost: $0.062250
   🔧 Tools used: Write, LS, Grep
   📝 Last activity: Successful file creation...

❓ Context strategy? (c=continue | r=resume | n=new | s=stats):
```

### **Context Options:**
- **`c` (continue)** - Continue from most recent conversation
- **`r` (resume)** - Resume specific session ID
- **`n` (new)** - Start completely fresh session
- **`s` (stats)** - Show detailed session statistics

## 📊 **Statistics & Analytics**

View comprehensive usage data:

```bash
bun run ultimate-claude-sdk.ts stats
```

Shows:
- **Permission system status** (auto-allow, allowed/denied tools)
- **Tool usage statistics** (how many times each tool was used)
- **Session information** (ID, messages, costs, tools)
- **Context preservation data** (summaries, history)

## 🧪 **Test Suite**

Run comprehensive testing:

```bash
bun run ultimate-claude-sdk.ts test
```

**Test Scenarios:**
1. **File Operations & Context** - Create files with permission analysis
2. **Multi-tool Workflow** - Coordinate multiple tools safely
3. **Context Memory Test** - Verify conversation continuity

## 📁 **Data Files**

The script creates and manages:

- **`.ultimate-claude-session.json`** - Session context and history
- **Enhanced permission statistics** - Tool usage and decisions
- **Cost tracking** - Accumulated costs across sessions
- **Tool usage patterns** - Analytics for optimization

## 🎵 **Hooks Integration**

Works with your existing hooks in `.claude/settings.local.json`:
- **Completion sounds** after successful operations
- **Pre/post tool execution** hooks
- **Custom logging** and notifications

## 🔌 **MCP Security Features**

For MCP tools, you get enhanced security analysis:

```
🔌 MCP TOOL PERMISSION REQUEST - HIGH RISK
🛡️  SECURITY ANALYSIS: External MCP Tool Request

📊 MCP TOOL DETAILS:
   🔧 Tool Name: filesystem_read
   🌐 MCP Server: @modelcontextprotocol/server-filesystem
   ⚠️  Risk Level: HIGH (External integration)

⚠️  MCP SECURITY WARNINGS:
   🔒 External tools may access your file system
   🌐 External tools may make network requests
   💾 External tools may store or transmit data
   🔄 External tools may modify external services
   📡 Parameters are sent to third-party MCP server

🛡️  WHAT YOU SHOULD VERIFY:
   ✅ Trust the MCP server source and author
   ✅ Understand what this tool does
   ✅ Review all parameters being sent
   ✅ Consider if data exposure is acceptable
```

## 💡 **Pro Tips**

### **For Efficient Workflow:**
1. Start with **interactive mode** for exploration
2. Use **`a` (allow all)** for trusted operations
3. Use **continue mode** for multi-step projects
4. Check **stats** regularly to track usage

### **For Security:**
1. Always **review file content previews**
2. Be **cautious with MCP tools** from unknown sources
3. Use **`i` (info)** option when unsure about tools
4. **Check statistics** to monitor tool usage patterns

### **For Context Management:**
1. Use **continue** for building on previous work
2. Use **new** when starting different projects  
3. Use **resume** with specific session IDs for debugging
4. **Clear data** periodically for fresh starts

## 🎉 **Example Workflow**

```bash
# Start interactive mode
bun run ultimate-claude-sdk.ts

# In interactive mode:
Ultimate> query Create a project structure for a web app
# Choose context strategy, review permissions, allow tools

Ultimate> query Add package.json and basic files to the project  
# Continue context, build on previous work

Ultimate> stats
# Check costs, tool usage, session info

Ultimate> test
# Run comprehensive test suite

Ultimate> clear
# Clean slate for next project

Ultimate> exit
```

## 🏆 **The Ultimate Experience**

This single script provides:
- **🔒 Maximum security** with detailed permission analysis
- **🧠 Perfect memory** with context preservation  
- **📊 Complete visibility** into all operations
- **🎯 Ultimate control** over every aspect
- **🚀 Professional workflow** for serious development

**One script. All features. Ultimate power.** 👑