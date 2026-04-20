import { basename } from "../utils/paths.js";
import { RankedFile, RepoMap } from "./types.js";

function renderTree(files: RankedFile[]): string {
  return files.slice(0, 20).map((file) => `- ${file.path}`).join("\n");
}

function renderReasons(file: RankedFile): string {
  return file.reason.slice(0, 3).join(", ");
}

export function renderMarkdown(repoMap: RepoMap, files: RankedFile[]): string {
  const keyFiles = files.slice(0, 10)
    .map((file) => `### ${file.path}\n- Score: ${file.score}\n- Why it matters: ${renderReasons(file)}\n- Preview:\n\n\`\`\`text\n${file.preview}\n\`\`\``)
    .join("\n\n");

  const snippets = files.slice(0, 5)
    .map((file) => `### ${basename(file.path)}\n\`\`\`text\n${file.preview}\n\`\`\``)
    .join("\n\n");

  const sourceDirs = repoMap.sourceDirectories.length > 0 ? repoMap.sourceDirectories.map((dir) => `- ${dir}`).join("\n") : "- No dominant source directories detected";

  return `# RepoPack Context\n\n## Project Summary\n${repoMap.summary}\n\n## Repository Tree\n${renderTree(files)}\n\n## How To Run\n${repoMap.runCommands.length > 0 ? repoMap.runCommands.map((command) => `- ${command}`).join("\n") : "- No obvious run commands detected"}\n\n## Important Config\n${repoMap.configFiles.length > 0 ? repoMap.configFiles.map((file) => `- ${file}`).join("\n") : "- No high-signal config files detected"}\n\n## Key Entry Points\n${repoMap.entryPoints.length > 0 ? repoMap.entryPoints.map((file) => `- ${file}`).join("\n") : "- No clear entry points detected"}\n\n## Source Directories\n${sourceDirs}\n\n## Architecture Notes\n- Stack: ${repoMap.stack.length > 0 ? repoMap.stack.join(", ") : "unknown"}\n- Package manager: ${repoMap.packageManager.length > 0 ? repoMap.packageManager.join(", ") : "unknown"}\n- Selected files: ${repoMap.selectedFiles} of ${repoMap.scannedFiles}\n- Budget: ${repoMap.budget.usedTokens}/${repoMap.budget.maxTokens} estimated tokens\n\n## Important Files\n${keyFiles}\n\n## Selected Snippets\n${snippets}\n\n## Caveats\n${repoMap.caveats.map((item) => `- ${item}`).join("\n")}`;
}