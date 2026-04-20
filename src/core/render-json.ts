import { RepoMap } from "./types.js";

export function renderRepoMapJson(repoMap: RepoMap): string {
  return `${JSON.stringify(repoMap, null, 2)}\n`;
}