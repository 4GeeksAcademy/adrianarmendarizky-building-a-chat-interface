export type Role = "user" | "assistant"

export interface ChatMessage {
  id: string
  role: Role
  content: string
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

// Rough token estimate: ~4 characters per token.
export function estimateTokens(text: string): number {
  if (!text.trim()) return 0
  return Math.max(1, Math.ceil(text.trim().length / 4))
}

const CANNED_REPLIES = [
  "That's a great question. Here's how I'd think about it: break the problem into smaller pieces, tackle the most uncertain part first, then iterate.",
  "Sure! I can help with that. Could you share a bit more detail about what you're trying to accomplish so I can give a precise answer?",
  "Absolutely. In short, the key trade-offs are readability, performance, and maintainability — and usually readability should win unless you have measured a real bottleneck.",
  "Here's a concise summary: focus on the fundamentals, keep your feedback loop tight, and don't optimize prematurely.",
  "Good point. I'd recommend starting with a minimal example, confirming it works, and then layering on complexity step by step.",
]

export function generateReply(prompt: string): string {
  const index = Math.abs(hashString(prompt)) % CANNED_REPLIES.length
  return CANNED_REPLIES[index]
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
