import path from "node:path";

export function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

export function getExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

export function basename(filePath: string): string {
  return path.basename(filePath).toLowerCase();
}