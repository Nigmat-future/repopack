import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { buildContextPack, writeOutputs } from "../dist/core/build.js";

const fixtureRoot = path.resolve("fixtures/sample-repo");
const outputDir = path.resolve(".tmp/test-output");
fs.mkdirSync(outputDir, { recursive: true });

const result = await buildContextPack({
  rootDir: fixtureRoot,
  outputDir,
  outputPath: "fixture-pack.md",
  jsonPath: "fixture-map.json",
  budget: "8k",
  preset: "codex",
  stdout: false,
  include: [],
  exclude: []
});

assert.equal(result.repoMap.name, "sample-repo");
assert.ok(result.repoMap.runCommands.includes("npm run dev"));
assert.ok(result.repoMap.entryPoints.some((entry) => entry.toLowerCase().includes("src/index.ts")));
assert.ok(result.repoMap.importantFiles.some((file) => file.path === "package.json"));
assert.ok(!result.repoMap.importantFiles.some((file) => file.path === "package-lock.json"));
assert.match(result.markdown, /Project Summary/);
assert.match(result.markdown, /Key Entry Points/);

await writeOutputs(result, {
  rootDir: fixtureRoot,
  outputDir,
  outputPath: "fixture-pack.md",
  jsonPath: "fixture-map.json",
  budget: "8k",
  preset: "codex",
  stdout: false,
  include: [],
  exclude: []
});

assert.ok(fs.existsSync(path.join(outputDir, "fixture-pack.md")));
assert.ok(fs.existsSync(path.join(outputDir, "fixture-map.json")));

console.log("All RepoPack tests passed.");