# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FixHive is a Claude Code MCP (Model Context Protocol) server that automatically captures errors during development sessions, queries a community knowledge base for solutions, and shares resolved errors with other developers.

**Architecture: CodeCaseDB v2.0**

## Development Commands

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode (development)
npm run dev

# Type check
npm run typecheck

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Architecture

This is a TypeScript MCP server with the following structure:

```
src/
├── index.ts                  # Entry point
├── server/
│   ├── index.ts              # MCP server definition
│   └── tools/
│       ├── index.ts          # Tool registry (3 tools)
│       ├── search-cases.tool.ts
│       ├── report-resolution.tool.ts
│       └── vote.tool.ts
├── config/
│   ├── index.ts              # Config loader (device_id based)
│   └── schema.ts             # Zod validation
└── utils/
    ├── logger.ts             # Pino logger
    └── errors.ts             # Error handling

# Shared package (../packages/shared)
packages/shared/
├── src/
│   ├── types/                # CaseGroup, CaseVariant, Resolution, Vote
│   ├── device/               # device_id management (~/.codecasedb/device_id)
│   ├── cloud/                # Supabase client, ranking algorithm
│   └── utils/                # hash, privacy filtering
```

### MCP Tools (CodeCaseDB v2.0)

1. **fixhive_search_cases**: Search for error solutions
   - Input: error_message, error_signature (normalized), language, framework, packages
   - Returns ranked solutions with environment match scores

2. **fixhive_report_resolution**: Report an error resolution
   - Input: error_message, error_signature, solution, cause, environment
   - Can also report that an existing solution worked (used_variant_id)

3. **fixhive_vote**: Vote on solution quality
   - Input: variant_id, value (up/down/report), reason
   - Helps community identify best solutions

### Key Components

- **Shared Package** (`@the-magic-tower/fixhive-shared`): Common types, cloud client, ranking algorithm
- **device_id**: Persistent UUID stored in `~/.codecasedb/device_id`
- **Privacy Filter**: Redacts sensitive data before sharing

### Data Flow

1. Error occurs in tool output
2. AI normalizes error using signature rules (placeholders)
3. Cloud search via Supabase + pgvector
4. Display ranked solutions (similarity + environment match + votes)
5. Resolution uploads to community

## Error Signature Normalization

When calling search_cases or report_resolution, normalize error messages using these placeholders:

| Target | Placeholder | Example |
|--------|-------------|---------|
| User-defined class | `{class}` | `App\Models\User` -> `App\Models\{class}` |
| User-defined file | `{file}` | `UserController.php` -> `{file}` |
| Numeric ID (4+ digits) | `{id}` | `user_id: 12345` -> `user_id: {id}` |
| UUID | `{uuid}` | `550e8400-e29b-...` -> `{uuid}` |
| Timestamp | `{timestamp}` | `2025-01-15 10:30:00` -> `{timestamp}` |
| User path | `{path}` | `/home/john/project/` -> `{path}` |
| Table.column | `{table}.{column}` | `users.deleted_at` -> `{table}.{column}` |
| Route name | `{route}` | `admin.users.show` -> `{route}` |
| View name | `{view}` | `admin.users.index` -> `{view}` |

**Keep unchanged**: Framework core classes (`Illuminate\*`, `React`, etc.), error codes (`SQLSTATE`, `TypeError`), package names

## Ranking Algorithm

Solutions are ranked using:

```
final_score = env_match × 0.4 + success_rate × 0.3 + vote_score × 0.2 + report_factor × 0.1

env_match = language_match × 0.4 + framework_match × 0.4 + packages_overlap × 0.1 × 2
```

## External Dependencies

- **Supabase**: Cloud database with pgvector for semantic search
- **@the-magic-tower/fixhive-shared**: Shared types, cloud client, utilities

## Environment Variables

```bash
# Optional: Custom Supabase instance (defaults to community server)
FIXHIVE_SUPABASE_URL=https://your-project.supabase.co
FIXHIVE_SUPABASE_KEY=your-anon-key
```
