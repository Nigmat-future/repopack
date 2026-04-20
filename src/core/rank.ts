import fs from "node:fs";
import { estimateTokens } from "../utils/tokens.js";
import { truncate } from "../utils/text.js";
import { RankedFile, RepoFile } from "./types.js";

const importantNames = new Set([
  "readme.md",
  "readme",
  "package.json",
  "tsconfig.json",
  "pyproject.toml",
  "requirements.txt",
  "cargo.toml",
  "go.mod",
  "dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  ".env.example",
  "makefile",
  "agents.md",
  "claude.md",
  "next.config.js",
  "next.config.ts",
  "vite.config.js",
  "vite.config.ts"
]);

const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java", ".rb", ".php", ".cs", ".md", ".json", ".toml", ".yml", ".yaml"]);
const noisyBaseNames = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
  ".gitignore",
  ".gitattributes"
]);
const noisyPrefixes = ["fixtures/", "test/", "tests/", "examples/", ".github/"];

export function rankFiles(files: RepoFile[]): RankedFile[] {
  return files
    .map((file) => rankFile(file))
    .filter((file) => file.score > -15)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
}

function rankFile(file: RepoFile): RankedFile {
  const reason: string[] = [];
  let score = 0;
  const lowerPath = file.path.toLowerCase();
  const base = lowerPath.split("/").pop() ?? lowerPath;

  if (importantNames.has(base)) {
    score += 40;
    reason.push("important config or documentation file");
  }

  if (noisyBaseNames.has(base)) {
    score -= 30;
    reason.push("low-signal housekeeping file");
  }

  if (noisyPrefixes.some((prefix) => lowerPath.startsWith(prefix))) {
    score -= 35;
    reason.push("project-internal fixture or metadata path");
  }

  if (lowerPath.startsWith("src/") || lowerPath.startsWith("app/") || lowerPath.startsWith("lib/") || lowerPath.startsWith("server/")) {
    score += 12;
    reason.push("inside source tree");
  }

  if (["src/index.ts", "src/index.js", "src/main.ts", "src/main.js", "src/main.tsx", "src/app.ts", "src/app.js", "main.py", "app.py", "main.go", "server.ts", "server.js", "index.ts", "index.js"].includes(lowerPath)) {
    score += 35;
    reason.push("likely entry point");
  }

  if (lowerPath.includes("config") || lowerPath.includes("env")) {
    score += 10;
    reason.push("configuration signal");
  }

  if (lowerPath.includes("docs/") || base.startsWith("readme")) {
    score += 15;
    reason.push("documentation signal");
  }

  if (lowerPath.includes("test") || lowerPath.includes("spec")) {
    score -= 8;
    reason.push("test file de-prioritized in v0.1");
  }

  if (!sourceExtensions.has(file.extension) && !importantNames.has(base)) {
    score -= 10;
    reason.push("lower-value file type");
  }

  if (file.size === 0) {
    score -= 20;
    reason.push("empty file");
  } else if (file.size < 4096) {
    score += 8;
    reason.push("small enough to include fully");
  } else if (file.size < 20000) {
    score += 4;
    reason.push("moderate file size");
  } else {
    score -= 10;
    reason.push("large file likely to consume budget");
  }

  let preview = "";
  try {
    preview = truncate(fs.readFileSync(file.absolutePath, "utf8"), 1200);
  } catch {
    preview = "[Unable to preview file as UTF-8 text]";
    score -= 15;
    reason.push("preview unavailable");
  }

  const estimatedTokens = estimateTokens(preview) + estimateTokens(file.path) + 20;

  return {
    ...file,
    score,
    reason,
    preview,
    estimatedTokens
  };
}