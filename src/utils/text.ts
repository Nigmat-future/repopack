export function truncate(text: string, limit: number): string {
  const normalized = text.replace(/\r/g, "").trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, limit - 3)).trimEnd()}...`;
}

export function firstNonEmptyLines(text: string, count: number): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, count);
}