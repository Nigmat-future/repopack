import fs from "node:fs";
import path from "node:path";
import { basename } from "../utils/paths.js";
import { ProjectDetection, RepoFile } from "./types.js";

const entryPointCandidates = [
  "src/index.ts",
  "src/index.js",
  "src/main.ts",
  "src/main.js",
  "src/app.ts",
  "src/app.js",
  "src/main.tsx",
  "src/app.tsx",
  "main.py",
  "app.py",
  "manage.py",
  "cmd/main.go",
  "main.go",
  "server.ts",
  "server.js",
  "index.ts",
  "index.js"
];

export function detectProject(rootDir: string, files: RepoFile[]): ProjectDetection {
  const lowerPaths = new Set(files.map((file) => file.path.toLowerCase()));
  const stack = new Set<string>();
  const packageManager = new Set<string>();
  const runCommands = new Set<string>();
  const envFiles: string[] = [];
  const configFiles: string[] = [];
  const docsFiles: string[] = [];
  const entryPoints = new Set<string>();
  const sourceDirectories = new Set<string>();

  for (const file of files) {
    const lower = file.path.toLowerCase();
    const base = basename(file.path);

    if (lower.includes("/")) {
      sourceDirectories.add(lower.split("/")[0]);
    }

    if (base.startsWith("readme") || lower.includes("docs/")) {
      docsFiles.push(file.path);
    }

    if (base.includes("env") || base === ".env.example") {
      envFiles.push(file.path);
    }

    if (["dockerfile", "docker-compose.yml", "docker-compose.yaml", "package.json", "pyproject.toml", "requirements.txt", "go.mod", "cargo.toml", "makefile", "tsconfig.json", "vite.config.ts", "vite.config.js", "next.config.js", "next.config.ts"].includes(base)) {
      configFiles.push(file.path);
    }

    if (base === "package.json") {
      stack.add("nodejs");
      packageManager.add(detectNodePackageManager(rootDir));
      readNodeCommands(rootDir, runCommands);
      if (lowerPaths.has("next.config.js") || lowerPaths.has("next.config.ts")) stack.add("nextjs");
      if (lowerPaths.has("vite.config.ts") || lowerPaths.has("vite.config.js")) stack.add("vite");
      if (lowerPaths.has("nest-cli.json")) stack.add("nestjs");
      if (lowerPaths.has("tsconfig.json")) stack.add("typescript");
      if (lowerPaths.has("src/app.tsx") || lowerPaths.has("src/main.tsx") || lowerPaths.has("app/router.tsx")) stack.add("react");
    }

    if (base === "pyproject.toml" || base === "requirements.txt") {
      stack.add("python");
      runCommands.add("python main.py");
      runCommands.add("pytest");
    }

    if (base === "go.mod") {
      stack.add("go");
      runCommands.add("go run .");
      runCommands.add("go test ./...");
    }

    if (base === "cargo.toml") {
      stack.add("rust");
      runCommands.add("cargo run");
      runCommands.add("cargo test");
    }
  }

  for (const candidate of entryPointCandidates) {
    if (lowerPaths.has(candidate.toLowerCase())) {
      entryPoints.add(candidate);
    }
  }

  const packageJsonEntrypoints = detectPackageJsonEntrypoints(rootDir, lowerPaths);
  for (const entry of packageJsonEntrypoints) {
    entryPoints.add(entry);
  }

  const name = path.basename(rootDir);

  return {
    name,
    stack: Array.from(stack),
    packageManager: Array.from(packageManager),
    runCommands: Array.from(runCommands),
    envFiles,
    configFiles,
    entryPoints: Array.from(entryPoints),
    docsFiles,
    sourceDirectories: Array.from(sourceDirectories).filter(Boolean)
  };
}

function detectNodePackageManager(rootDir: string): string {
  if (fs.existsSync(path.join(rootDir, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(rootDir, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(rootDir, "bun.lockb")) || fs.existsSync(path.join(rootDir, "bun.lock"))) return "bun";
  return "npm";
}

function readNodeCommands(rootDir: string, commands: Set<string>) {
  const packageJsonPath = path.join(rootDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as { scripts?: Record<string, string> };
    const scripts = packageJson.scripts ?? {};
    for (const key of ["dev", "start", "build", "test", "lint"]) {
      if (scripts[key]) {
        commands.add(`npm run ${key}`);
      }
    }
  } catch {
    // Ignore malformed package.json for v0.1.
  }
}

function detectPackageJsonEntrypoints(rootDir: string, lowerPaths: Set<string>): string[] {
  const packageJsonPath = path.join(rootDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return [];
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as { main?: string; module?: string; exports?: string | Record<string, unknown> };
    const candidates = new Set<string>();

    for (const field of [packageJson.main, packageJson.module]) {
      if (typeof field === "string") {
        candidates.add(field.replace(/^\.\//, ""));
      }
    }

    if (typeof packageJson.exports === "string") {
      candidates.add(packageJson.exports.replace(/^\.\//, ""));
    }

    return Array.from(candidates).filter((candidate) => lowerPaths.has(candidate.toLowerCase()));
  } catch {
    return [];
  }
}

export function summarizeProject(detection: ProjectDetection): string {
  const stackSummary = detection.stack.length > 0 ? detection.stack.join(", ") : "unknown stack";
  const commandSummary = detection.runCommands.length > 0 ? detection.runCommands.slice(0, 3).join(", ") : "no obvious run commands detected";
  const entrySummary = detection.entryPoints.length > 0 ? detection.entryPoints.slice(0, 3).join(", ") : "no clear entry points detected";

  return `${detection.name} appears to be a ${stackSummary} repository. Likely run commands include ${commandSummary}. Entry points: ${entrySummary}.`;
}