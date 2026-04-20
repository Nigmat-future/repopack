import { RankedFile } from "./types.js";

export function selectFilesWithinBudget(files: RankedFile[], maxTokens: number): { selected: RankedFile[]; usedTokens: number } {
  const selected: RankedFile[] = [];
  let usedTokens = 0;

  for (const file of files) {
    if (selected.length >= 30) {
      break;
    }

    if (file.score < 0 && selected.length >= 10) {
      continue;
    }

    if (usedTokens + file.estimatedTokens > maxTokens && selected.length >= 8) {
      continue;
    }

    selected.push(file);
    usedTokens += file.estimatedTokens;
  }

  return { selected, usedTokens };
}