import fs from "node:fs/promises";
import path from "node:path";
import { detectProject, summarizeProject } from "./detect.js";
import { rankFiles } from "./rank.js";
import { scanRepo } from "./scan.js";
import { parseBudget } from "../utils/tokens.js";
import { selectFilesWithinBudget } from "./budget.js";
import { renderMarkdown } from "./render-markdown.js";
import { renderRepoMapJson } from "./render-json.js";
import { BuildResult, RunOptions } from "./types.js";
import { getPreset } from "../presets/index.js";

export async function buildContextPack(options: RunOptions): Promise<BuildResult> {
  const scannedFiles = await scanRepo(options.rootDir, options.include, options.exclude);
  const detection = detectProject(options.rootDir, scannedFiles);
  const rankedFiles = rankFiles(scannedFiles);
  const maxTokens = parseBudget(options.budget);
  const { selected, usedTokens } = selectFilesWithinBudget(rankedFiles, maxTokens);
  const preset = getPreset(options.preset);
  const summary = `${summarizeProject(detection)} Preset: ${preset.name} (${preset.emphasis}).`;

  const repoMap = {
    name: detection.name,
    summary,
    stack: detection.stack,
    packageManager: detection.packageManager,
    runCommands: detection.runCommands,
    envFiles: detection.envFiles,
    configFiles: detection.configFiles,
    entryPoints: detection.entryPoints,
    sourceDirectories: detection.sourceDirectories,
    importantFiles: selected.map((file) => ({
      path: file.path,
      score: file.score,
      reason: file.reason,
      estimatedTokens: file.estimatedTokens
    })),
    selectedFiles: selected.length,
    scannedFiles: scannedFiles.length,
    budget: {
      requested: options.budget,
      maxTokens,
      usedTokens
    },
    caveats: [
      "Token estimates use a simple character-based heuristic in v0.1.",
      "File ranking is rule-based and intentionally biased toward setup, docs, and entry paths.",
      "Binary files and very large files are skipped by design."
    ]
  };

  const markdown = renderMarkdown(repoMap, selected);
  return { markdown, repoMap };
}

export async function writeOutputs(result: BuildResult, options: RunOptions): Promise<void> {
  await fs.mkdir(path.resolve(options.outputDir), { recursive: true });
  await fs.writeFile(path.resolve(options.outputDir, options.outputPath), `${result.markdown}\n`, "utf8");
  await fs.writeFile(path.resolve(options.outputDir, options.jsonPath), renderRepoMapJson(result.repoMap), "utf8");
}