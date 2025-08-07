---

# Claude Code SDK Examples Project

This project demonstrates comprehensive Claude Code SDK integration using TypeScript and Bun. It includes examples ranging from basic usage to enterprise-grade features with enhanced security, context preservation, and external integrations.

## Development Standards

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

## Claude Code SDK Integration

This project demonstrates comprehensive Claude Code SDK integration with:

### Key Components
- **Examples Directory**: `scripts/examples/` - Complete collection of SDK examples
- **Enhanced Permission System**: `enhanced-permission-system.ts` - Enterprise-grade security
- **Context Management**: Session preservation and memory retention
- **MCP Integration**: External tool server support
- **Hooks System**: Automation and completion events

### Quick Start
```bash
# Interactive examples browser
bun run index.ts

# Basic SDK test
bun run scripts/examples/simple-claude-test.ts

# Ultimate integration
bun run scripts/examples/ultimate-claude-sdk.ts
```

### Security Features
- 4-level risk assessment (LOW/MEDIUM/HIGH/CRITICAL)
- Content security scanning for sensitive data
- Parameter analysis with security implications
- MCP tool safety analysis
- Interactive permission controls

### Testing Commands
```bash
# Run comprehensive tool testing
bun run scripts/examples/comprehensive-tools-test.ts

# Test with enhanced security
bun run scripts/examples/enhanced-comprehensive-test.ts

# Test context preservation
bun run scripts/examples/context-preserving-test.ts

# Test MCP integration (requires MCP servers)
bun run scripts/examples/mcp-test.ts

# Test hooks system (requires done.mp3)
bun run scripts/examples/hooks-test.ts
```

### Configuration Files
- `.claude/settings.local.json` - Hooks and automation configuration
- Session files - Context preservation across interactions
- Enhanced permission state - Security analysis persistence

### Development Workflow
1. Start with basic examples (`simple-claude-test.ts`)
2. Learn permissions (`claude-file-creator.ts`)
3. Explore advanced features (`comprehensive-tools-test.ts`)
4. Test security features (`enhanced-comprehensive-test.ts`)
5. Master the ultimate integration (`ultimate-claude-sdk.ts`)

All examples include comprehensive documentation and follow enterprise security best practices.
