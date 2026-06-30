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