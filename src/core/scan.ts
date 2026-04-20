import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { RepoFile } from "./types.js";
import { getExtension, normalizePath } from "../utils/paths.js";
import { createIgnoreMatcher } from "../utils/ignore.js";

export async function scanRepo(rootDir: string, extraIncludes: string[], extraExcludes: string[]): Promise<RepoFile[]> {
  const matcher = createIgnoreMatcher(rootDir, extraExcludes, extraIncludes);
  const entries = await fg(["**/*"], {
    cwd: rootDir,
    dot: true,
    onlyFiles: true,
    unique: true,
    followSymbolicLinks: false
  });

  const files: RepoFile[] = [];

  for (const entry of entries) {
    const normalized = normalizePath(entry);
    if (matcher.ignores(normalized)) {
      continue;
    }

    const absolutePath = path.join(rootDir, entry);
    const stat = await fs.stat(absolutePath);

    if (stat.size > 512_000) {
      continue;
    }

    files.push({
      path: normalized,
      absolutePath,
      size: stat.size,
      extension: getExtension(normalized)
    });
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
}