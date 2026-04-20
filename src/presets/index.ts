import { AgentPresetName } from "../core/types.js";

export interface PresetConfig {
  name: AgentPresetName;
  description: string;
  emphasis: string;
}

const presets: Record<AgentPresetName, PresetConfig> = {
  codex: {
    name: "codex",
    description: "Optimized for code-editing agents that need high-signal project context.",
    emphasis: "entry points, run commands, key source files"
  },
  claude: {
    name: "claude",
    description: "Optimized for long-form reasoning and repo understanding.",
    emphasis: "architecture notes, docs, high-value snippets"
  },
  cursor: {
    name: "cursor",
    description: "Optimized for interactive editor assistance.",
    emphasis: "source tree, config, targeted snippets"
  },
  generic: {
    name: "generic",
    description: "Balanced preset for general AI tools.",
    emphasis: "overall repo summary and representative files"
  }
};

export function getPreset(name: AgentPresetName): PresetConfig {
  return presets[name];
}