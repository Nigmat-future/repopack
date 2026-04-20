import fs from "node:fs";
import path from "node:path";
import ignore from "ignore";
import { normalizePath } from "./paths.js";

const defaultIgnores = [
  ".git",
  "node_modules",
  "node_modules/**",
  "dist",
  "dist/**",
  "build",
  "build/**",
  ".next",
  ".next/**",
  "coverage",
  "coverage/**",
  ".turbo",
  ".turbo/**",
  ".cache",
  ".cache/**",
  ".idea",
  ".idea/**",
  ".vscode",
  ".vscode/**",
  ".tmp",
  ".tmp/**",
  "tmp",
  "tmp/**",
  "temp",
  "temp/**",
  "fixtures",
  "fixtures/**",
  "test",
  "test/**",
  "tests",
  "tests/**",
  "examples",
  "examples/**",
  ".github",
  ".github/**",
  "*.png",
  "*.jpg",
  "*.jpeg",
  "*.gif",
  "*.webp",
  "*.svg",
  "*.ico",
  "*.pdf",
  "*.zip",
  "*.tar",
  "*.gz",
  "*.mp4",
  "*.mov",
  "*.exe",
  "*.dll",
  "*.so"
];

export function createIgnoreMatcher(rootDir: string, extraExcludes: string[] = [], extraIncludes: string[] = []) {
  const matcher = ignore().add(defaultIgnores);
  const gitignorePath = path.join(rootDir, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    matcher.add(fs.readFileSync(gitignorePath, "utf8"));
  }

  if (extraExcludes.length > 0) {
    matcher.add(extraExcludes);
  }

  if (extraIncludes.length > 0) {
    matcher.add(extraIncludes.map((pattern) => `!${pattern}`));
  }

  return {
    ignores(filePath: string) {
      return matcher.ignores(normalizePath(filePath));
    }
  };
}