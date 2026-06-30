import type { ChatMessage, TokenUsage } from "@/lib/chat"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

export interface GroqReply {
  content: string
  usage: TokenUsage
  responseTimeMs: number
}

export async function fetchGroqReply(history: ChatMessage[]): Promise<GroqReply> {
  const startTime = performance.now()

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: history.map(({ role, content }) => ({ role, content })),
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API request failed with status ${response.status}`)
  }

  const data = await response.json()
  const responseTimeMs = performance.now() - startTime

  return {
    content: data.choices[0].message.content,
    usage: {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    },
    responseTimeMs,
  }
}