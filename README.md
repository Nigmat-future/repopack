# RepoPack

![RepoPack Hero](./assets/hero.svg)

**EN**  
Turn any codebase into a clean, token-budgeted, agent-ready context pack.

**中文**  
把任意代码仓库编译成干净、限预算、可直接给 AI 编程代理使用的上下文包。

RepoPack is a CLI for developers using Codex, Claude Code, Cursor, and other AI coding tools who are tired of manually stitching together repo context. Instead of dumping a whole repository into a prompt, RepoPack scans the codebase, filters noise, ranks high-signal files, applies a token budget, and emits a structured Markdown pack plus a machine-readable JSON repo map.

RepoPack 是一个面向 Codex、Claude Code、Cursor 等 AI 编程工作流的 CLI。它不做整仓库粗暴导出，而是扫描代码库、过滤噪音、排序高信号文件、控制 token 预算，并输出结构化 Markdown 上下文包和机器可读的 JSON repo map。

## Why It Exists

Most "repo to markdown" tools are exporters. RepoPack is opinionated infrastructure for AI coding workflows.

It is designed to answer the real question developers have:

"What is the smallest, cleanest, highest-signal context bundle I can hand to an AI agent so it can work on this repo without wasting tokens?"

RepoPack focuses on four things:

- It finds signal instead of dumping everything.
- It respects a token budget.
- It structures the result for agents, not just humans.
- It emits both Markdown and JSON so the output can become reusable workflow infrastructure.

大多数“repo 转 markdown”工具只是导出器，RepoPack 更像 AI 编程工作流里的上下文编译器。

它解决的核心问题是：

“我怎样才能把一个仓库最小化、结构化、高信号地交给 AI 代理，而不是浪费上下文窗口？”

它重点做四件事：

- 找信号，而不是全量倾倒
- 控制预算，而不是无限膨胀
- 按 agent 消费方式组织结构，而不是只给人看
- 同时输出 Markdown 和 JSON，让结果能沉淀成自动化基础设施

## Quick Demo

```bash
npm install
npm run build
node dist/cli/index.js . --for codex --budget 20k
```

Example result:

```text
RepoPack complete for D:\repo
Scanned 128 files
Selected 14 files
Estimated tokens 6031/20000
Wrote D:\repo\REPOPACK.md and D:\repo\repo-map.json
```

Generated artifacts:

- `REPOPACK.md`: a structured context pack for AI agents or humans
- `repo-map.json`: a machine-readable summary for future automation

## Before vs After

Without RepoPack:

- You manually pick files.
- You over-send low-value files.
- Important entry points get buried.
- Every model switch means rebuilding context again.

With RepoPack:

- The repo is scanned and filtered automatically.
- High-signal files are ranked and selected.
- Entry points, run commands, config, and docs are surfaced.
- The output is reusable across Codex, Claude Code, Cursor, and generic workflows.

没有 RepoPack 时：

- 你得手动挑文件
- 低价值文件会一起塞进去
- 关键入口点容易被淹没
- 每次换模型都得重组上下文

有了 RepoPack：

- 仓库自动扫描与过滤
- 高信号文件自动排序与选择
- 入口、运行方式、配置和文档被优先提取
- 输出能复用到 Codex、Claude Code、Cursor 和通用工作流

## Features

- Smart file selection instead of full dumps
- Token-budgeted output for real LLM use
- Presets for `codex`, `claude`, `cursor`, and `generic`
- `.gitignore`-aware scanning
- Markdown output for direct prompt/context usage
- JSON output for future automation and integrations
- Rule-based ranking tuned toward docs, config, and entry paths

## Usage

```bash
repopack [target] [--budget 20k] [--for codex] [--output REPOPACK.md] [--json repo-map.json]
```

Examples:

```bash
repopack . --for codex --budget 20k
repopack ../legacy-service --for claude --budget 50k
repopack . --include "src/**" --exclude "tests/**"
```

Options:

- `--budget <value>`: token budget such as `8k`, `20k`, or `50000`
- `--for <preset>`: `codex`, `claude`, `cursor`, `generic`
- `--output <file>`: Markdown output filename
- `--json <file>`: JSON output filename
- `--stdout`: also print Markdown to stdout
- `--include <pattern>`: extra include glob
- `--exclude <pattern>`: extra exclude glob

## Output Shape

`REPOPACK.md` is structured for direct AI consumption and currently includes:

- Project summary
- Repository tree
- Run commands
- Important config
- Key entry points
- Source directories
- Architecture notes
- Important files with rationale and preview
- Selected snippets
- Caveats

`repo-map.json` includes:

- Stack detection
- Package manager detection
- Run commands
- Entry points
- Source directories
- Important files and scores
- Budget metadata
- Caveats

## Current Scope

RepoPack v0.1 is intentionally narrow. It does not try to be a chat interface, RAG platform, vector database, or full repo intelligence system.

It does one thing: compile a repository into a cleaner context pack for AI coding workflows.

RepoPack v0.1 刻意保持边界清晰。它不做聊天界面、不做 RAG 平台、不做向量数据库，也不试图变成一个大而全的仓库智能系统。

它只做一件事：把代码仓库编译成更适合 AI 编程工作流消费的上下文包。

## Development

```bash
npm install
npm run check
npm run build
npm run test
```

## Roadmap

- Better framework and monorepo detection
- Stronger entry-point and dependency inference
- GitHub URL input
- `issue2context` subcommand
- Incremental project memory mode
- MCP server mode

## License

MIT