const budgetPattern = /^(\d+)(k)?$/i;

export function parseBudget(input: string): number {
  const value = input.trim();
  const match = value.match(budgetPattern);

  if (!match) {
    throw new Error(`Invalid budget: ${input}. Use values like 8000, 8k, or 20k.`);
  }

  const amount = Number(match[1]);
  return match[2] ? amount * 1000 : amount;
}

export function estimateTokens(text: string): number {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return 0;
  }

  return Math.ceil(normalized.length / 4);
}