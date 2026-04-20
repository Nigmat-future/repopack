export type AgentPresetName = "codex" | "claude" | "cursor" | "generic";

export interface RunOptions {
  rootDir: string;
  outputDir: string;
  outputPath: string;
  jsonPath: string;
  budget: string;
  preset: AgentPresetName;
  stdout: boolean;
  include: string[];
  exclude: string[];
}

export interface RepoFile {
  path: string;
  absolutePath: string;
  size: number;
  extension: string;
}

export interface ProjectDetection {
  name: string;
  stack: string[];
  packageManager: string[];
  runCommands: string[];
  envFiles: string[];
  configFiles: string[];
  entryPoints: string[];
  docsFiles: string[];
  sourceDirectories: string[];
}

export interface RankedFile extends RepoFile {
  score: number;
  reason: string[];
  preview: string;
  estimatedTokens: number;
}

export interface RepoMap {
  name: string;
  summary: string;
  stack: string[];
  packageManager: string[];
  runCommands: string[];
  envFiles: string[];
  configFiles: string[];
  entryPoints: string[];
  sourceDirectories: string[];
  importantFiles: Array<{
    path: string;
    score: number;
    reason: string[];
    estimatedTokens: number;
  }>;
  selectedFiles: number;
  scannedFiles: number;
  budget: {
    requested: string;
    maxTokens: number;
    usedTokens: number;
  };
  caveats: string[];
}

export interface BuildResult {
  markdown: string;
  repoMap: RepoMap;
}