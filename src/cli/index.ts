#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { cac } from "cac";
import { buildContextPack, writeOutputs } from "../core/build.js";
import { AgentPresetName, RunOptions } from "../core/types.js";

const cli = cac("repopack");

cli
  .command("[target]", "Generate an agent-ready context pack for a repository")
  .option("--budget <budget>", "Token budget, e.g. 8k or 20000", { default: "20k" })
  .option("--for <preset>", "Preset: codex, claude, cursor, generic", { default: "codex" })
  .option("--output <file>", "Markdown output file", { default: "REPOPACK.md" })
  .option("--json <file>", "JSON output file", { default: "repo-map.json" })
  .option("--stdout", "Print markdown to stdout after writing files", { default: false })
  .option("--include <pattern>", "Extra include glob pattern", { default: [] })
  .option("--exclude <pattern>", "Extra exclude glob pattern", { default: [] })
  .example("repopack . --for codex --budget 20k")
  .example("repopack ../legacy-app --for claude --budget 50k")
  .example("repopack . --include \"src/**\" --exclude \"tests/**\"")
  .action(async (target: string | undefined, flags: {
    budget: string;
    for: AgentPresetName;
    output: string;
    json: string;
    stdout: boolean;
    include: string | string[];
    exclude: string | string[];
  }) => {
    const rootDir = path.resolve(target ?? process.cwd());
    const options: RunOptions = {
      rootDir,
      outputDir: process.cwd(),
      outputPath: flags.output,
      jsonPath: flags.json,
      budget: flags.budget,
      preset: flags.for,
      stdout: flags.stdout,
      include: toArray(flags.include),
      exclude: toArray(flags.exclude)
    };

    const result = await buildContextPack(options);
    await writeOutputs(result, options);

    process.stdout.write(
      [
        `RepoPack complete for ${rootDir}`,
        `Scanned ${result.repoMap.scannedFiles} files`,
        `Selected ${result.repoMap.selectedFiles} files`,
        `Estimated tokens ${result.repoMap.budget.usedTokens}/${result.repoMap.budget.maxTokens}`,
        `Wrote ${path.resolve(options.outputDir, options.outputPath)} and ${path.resolve(options.outputDir, options.jsonPath)}`
      ].join("\n") + "\n"
    );

    if (options.stdout) {
      process.stdout.write(`\n${result.markdown}\n`);
    }
  });

cli.help();
cli.parse();

function toArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : value ? [value] : [];
}