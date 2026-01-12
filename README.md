# FixHive for Claude Code

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ko.md">한국어</a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  </a>
  <img src="https://img.shields.io/badge/Node.js-18%20%7C%2020%20%7C%2022-green" alt="Node.js Version">
</p>

> Community-based Error Knowledge Sharing for Claude Code

FixHive is a Claude Code MCP server that automatically captures errors during development sessions, queries a community knowledge base for solutions, and shares resolved errors with other developers.

## Features

- **Auto Error Detection**: Automatically detects errors from tool outputs (bash, edit, etc.)
- **Cloud Knowledge Base**: Search community solutions using semantic similarity (pgvector)
- **Local Caching**: SQLite-based local storage for offline access
- **Privacy Filtering**: Automatically redacts sensitive data (API keys, paths, emails)
- **Real-time Sync**: Immediate cloud communication on error/resolution
- **Duplicate Prevention**: Smart deduplication using embeddings and hash matching

## Installation

```bash
npm install -g @the-magic-tower/fixhive-claude-code
```

## Quick Start

### 1. Install the package

```bash
npm install -g @the-magic-tower/fixhive-claude-code
```

### 2. Add to your Claude Code MCP settings

Add the following to your `~/.claude/claude_desktop_config.json` or project's `.mcp.json`:

```json
{
  "mcpServers": {
    "fixhive": {
      "command": "fixhive-claude-code",
      "args": []
    }
  }
}
```

### 3. Run Claude Code

```bash
claude
```

**That's it!** FixHive connects to the community knowledge base by default. No environment variables required.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        FixHive Flow                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. Error Occurs                                               │
│      ↓                                                          │
│   2. Auto Detection (MCP tool hook)                             │
│      ↓                                                          │
│   3. Privacy Filter (redact API keys, paths, etc.)              │
│      ↓                                                          │
│   4. Local Storage (SQLite)                                     │
│      ↓                                                          │
│   5. Cloud Search (Supabase + pgvector)                         │
│      ↓                                                          │
│   6. Display Solutions (ranked by similarity & votes)           │
│      ↓                                                          │
│   7. Resolution → Upload to Community                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration (Optional)

Environment variables to customize behavior:

```bash
# Use your own Supabase instance instead of community
FIXHIVE_SUPABASE_URL=https://your-project.supabase.co
FIXHIVE_SUPABASE_KEY=your-anon-key

# Enable semantic search (recommended)
OPENAI_API_KEY=sk-...

# Custom contributor ID (auto-generated if not set)
FIXHIVE_CONTRIBUTOR_ID=your-contributor-id
```

| Variable | Default | Description |
|----------|---------|-------------|
| `FIXHIVE_SUPABASE_URL` | Community DB | Your Supabase project URL |
| `FIXHIVE_SUPABASE_KEY` | Community Key | Your Supabase anon key |
| `OPENAI_API_KEY` | None | Enables semantic similarity search |
| `FIXHIVE_CONTRIBUTOR_ID` | Auto-generated | Your unique contributor ID |

## Available Tools

### `fixhive_search`

Search the knowledge base for error solutions.

```typescript
// Arguments
{
  errorMessage: string;   // Required: The error message to search for
  language?: string;      // Optional: Programming language (typescript, python, etc.)
  framework?: string;     // Optional: Framework (react, nextjs, express, etc.)
  limit?: number;         // Optional: Maximum results (default: 5)
}
```

### `fixhive_resolve`

Mark an error as resolved and share the solution.

```typescript
// Arguments
{
  errorId: string;        // Required: Error ID from fixhive_list
  resolution: string;     // Required: Description of how the error was resolved
  resolutionCode?: string; // Optional: Code fix or diff
  upload?: boolean;       // Optional: Upload to community (default: true)
}
```

### `fixhive_list`

List errors detected in the current session.

```typescript
// Arguments
{
  status?: 'unresolved' | 'resolved' | 'uploaded';  // Optional: Filter by status
  limit?: number;                                    // Optional: Maximum results (default: 10)
}
```

### `fixhive_vote`

Upvote or downvote a solution.

```typescript
// Arguments
{
  knowledgeId: string;  // Required: Knowledge entry ID
  helpful: boolean;     // Required: true for upvote, false for downvote
}
```

### `fixhive_stats`

View usage statistics.

```typescript
// No arguments required
```

### `fixhive_helpful`

Report that a solution was helpful.

```typescript
// Arguments
{
  knowledgeId: string;  // Required: Knowledge entry ID that helped
}
```

### `fixhive_report`

Report inappropriate content.

```typescript
// Arguments
{
  knowledgeId: string;  // Required: Knowledge entry ID to report
  reason?: string;      // Optional: Reason for reporting
}
```

## Example Workflow

```
1. Run a command that fails
   $ npm run build
   > error TS2307: Cannot find module '@/components/Button'

2. FixHive automatically:
   - Detects the error
   - Records it locally
   - Searches for solutions
   - Displays matching community solutions

3. Apply the fix from community solution
   $ npm install @/components/Button --save

4. Mark as resolved and share
   fixhive_resolve <error-id> "Missing alias configuration in tsconfig.json. Added paths mapping."

5. Your solution helps other developers!
```

## Privacy

FixHive automatically filters sensitive information before sharing:

| Category | Examples | Replacement |
|----------|----------|-------------|
| API Keys | `sk-abc123...`, `ghp_xxx...` | `[API_KEY_REDACTED]` |
| Tokens | `Bearer eyJ...`, `xoxb-...` | `[TOKEN_REDACTED]` |
| Emails | `user@example.com` | `[EMAIL_REDACTED]` |
| Paths | `/Users/john/projects/...` | `~/projects/...` |
| Env Vars | `DATABASE_URL=postgres://...` | `[ENV_REDACTED]` |
| Connection Strings | `mongodb://user:pass@...` | `[CONNECTION_STRING_REDACTED]` |
| IP Addresses | `192.168.1.100` | `[IP_REDACTED]` |

## Self-Hosted Setup (Optional)

Skip this section if you're using the default community knowledge base.

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project (Free tier works)
2. Wait for the project to be ready

### 2. Enable pgvector Extension

In SQL Editor, run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Run Setup Script

Copy and run the contents of `scripts/setup-supabase.sql` in the SQL Editor.

### 4. Configure Environment

```bash
# Get these from Settings > API
FIXHIVE_SUPABASE_URL=https://your-project.supabase.co
FIXHIVE_SUPABASE_KEY=your-anon-key
```

## Architecture

```
@the-magic-tower/fixhive-claude-code
├── src/
│   ├── server/
│   │   ├── index.ts          # MCP server definition
│   │   └── tools.ts          # Custom tools (7 tools)
│   ├── core/
│   │   ├── error-detector.ts # Multi-signal error detection
│   │   ├── privacy-filter.ts # Sensitive data redaction
│   │   └── hash.ts           # Fingerprinting & deduplication
│   ├── storage/
│   │   ├── local-store.ts    # SQLite local storage
│   │   └── migrations.ts     # Database migrations
│   ├── cloud/
│   │   ├── client.ts         # Supabase client
│   │   └── embedding.ts      # OpenAI embeddings
│   └── types/
│       └── index.ts          # TypeScript definitions
└── scripts/
    └── setup-supabase.sql    # Cloud schema
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run typecheck

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Create a Pull Request

### Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation
- Keep commits atomic

## License

MIT - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Claude Code](https://claude.ai/code) - AI coding assistant by Anthropic
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification
- [Supabase](https://supabase.com) - Backend as a Service
- [pgvector](https://github.com/pgvector/pgvector) - Vector similarity search
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Fast SQLite bindings
