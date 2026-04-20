# RepoPack

<p align="center">
  <img src="./assets/hero.svg" alt="RepoPack Hero" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/Nigmat-future/repopack/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Nigmat-future/repopack/ci.yml?branch=main&style=flat-square" alt="CI" /></a>
  <a href="https://github.com/Nigmat-future/repopack/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Nigmat-future/repopack?style=flat-square" alt="License" /></a>
  <a href="https://github.com/Nigmat-future/repopack"><img src="https://img.shields.io/github/stars/Nigmat-future/repopack?style=flat-square" alt="Stars" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D20-0B1020?style=flat-square" alt="Node >=20" />
</p>

<p align="center">
  <strong>EN</strong><br/>
  Turn any codebase into a clean, token-budgeted, agent-ready context pack.
</p>

<p align="center">
  <strong>中文</strong><br/>
  把任意代码仓库编译成干净、限预算、可直接给 AI 编程代理使用的上下文包。
</p>

<p align="center">
  RepoPack is a context compiler for AI coding workflows.<br/>
  RepoPack 是面向 AI 编程工作流的上下文编译器。
</p>

## Overview

RepoPack is for developers using Codex, Claude Code, Cursor, and other AI coding tools who are tired of manually stitching together repository context. Instead of dumping an entire codebase into a prompt, RepoPack scans the repo, filters noise, ranks high-signal files, respects a token budget, and emits a structured Markdown pack plus a machine-readable JSON repo map.

RepoPack 面向使用 Codex、Claude Code、Cursor 等工具的开发者。它不做整仓库粗暴导出，而是扫描代码库、过滤噪音、排序高信号文件、控制 token 预算，并输出结构化 Markdown 上下文包和机器可读的 JSON repo map。

## Why RepoPack

Most “repo to markdown” tools are exporters. RepoPack is opinionated infrastructure for AI coding workflows.

It is designed around one practical question:

> What is the smallest, cleanest, highest-signal context bundle I can hand to an AI agent so it can work on this repository without wasting tokens?

RepoPack answers that with four principles:

- Find signal instead of dumping everything.
- Fit the context into a real token budget.
- Structure output for agents, not just humans.
- Emit both Markdown and JSON so the result becomes reusable workflow infrastructure.

大多数“repo 转 markdown”工具只是导出器，RepoPack 更像 AI 编程工作流里的上下文编译器。

它围绕一个非常实际的问题设计：

> 我怎样才能把一个仓库最小化、结构化、高信号地交给 AI 代理，而不是浪费上下文窗口？

RepoPack 的答案来自四条原则：

- 找信号，而不是全量倾倒
- 控制预算，而不是无限膨胀
- 按 agent 消费方式组织结构，而不是只给人看
- 同时输出 Markdown 和 JSON，让结果能沉淀成自动化基础设施

## Quickstart

```bash
npm install
npm run build
node dist/cli/index.js . --for codex --budget 20k
```

Example output:

```text
RepoPack complete for D:\repo
Scanned 128 files
Selected 14 files
Estimated tokens 6031/20000
Wrote D:\repo\REPOPACK.md and D:\repo\repo-map.json
```

Generated artifacts:

- `REPOPACK.md` for direct AI agent or human consumption
- `repo-map.json` for automation, pipelines, and future tooling

## At A Glance

| Without RepoPack | With RepoPack |
|---|---|
| Manual file picking | Automatic scan and filtering |
| Low-value files bloat context | High-signal files rise to the top |
| Entry points get buried | Entrypoints, config, docs, and run commands are surfaced |
| Every model switch means rebuilding context | Output can be reused across Codex, Claude Code, Cursor, and generic workflows |

## Features

- Smart file selection instead of full dumps
- Token-budgeted output for real LLM use
- Presets for `codex`, `claude`, `cursor`, and `generic`
- `.gitignore`-aware scanning
- Markdown output for direct prompt and context usage
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

## Output Model

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

## Scope

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