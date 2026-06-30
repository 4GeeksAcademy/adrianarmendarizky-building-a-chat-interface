"use client"

import { useCallback, useEffect, useState } from "react"
import { MessageSquare } from "lucide-react"
import { MessageList } from "@/components/message-list"
import { ChatInput } from "@/components/chat-input"
import { TokenSidebar } from "@/components/token-sidebar"
import { fetchGroqReply } from "@/lib/groq"
import type { ChatMessage, TokenUsage } from "@/lib/chat"

const EMPTY_USAGE: TokenUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
}

const STORAGE_KEY = "chat-history"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [usage, setUsage] = useState<TokenUsage>(EMPTY_USAGE)
  const [error, setError] = useState<string | null>(null)
  const [tokensPerSecond, setTokensPerSecond] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const handleSend = useCallback(
    async (text: string) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      }

      const updatedHistory = [...messages, userMessage]
      setMessages(updatedHistory)
      setIsThinking(true)
      setError(null)

      try {
        const reply = await fetchGroqReply(updatedHistory)

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply.content,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setUsage((prev) => ({
          promptTokens: prev.promptTokens + reply.usage.promptTokens,
          completionTokens: prev.completionTokens + reply.usage.completionTokens,
          totalTokens: prev.totalTokens + reply.usage.totalTokens,
        }))

        const seconds = reply.responseTimeMs / 1000
        setTokensPerSecond(reply.usage.completionTokens / seconds)
      } catch (err) {
        setError("Something went wrong talking to the AI. Please try again.")
      } finally {
        setIsThinking(false)
      }
    },
    [messages],
  )

  const handleClear = useCallback(() => {
    setMessages([])
    setUsage(EMPTY_USAGE)
    setError(null)
    setIsThinking(false)
    setTokensPerSecond(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <main className="flex h-screen w-full flex-col bg-background md:flex-row">
      <section className="flex min-h-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <MessageSquare className="size-5 text-foreground" aria-hidden="true" />
          <h1 className="text-sm font-semibold text-foreground">Chat</h1>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto h-full w-full max-w-2xl">
            <MessageList messages={messages} isThinking={isThinking} />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <ChatInput onSend={handleSend} disabled={isThinking} />
        </div>
      </section>

      <TokenSidebar
        usage={usage}
        messageCount={messages.length}
        onClear={handleClear}
        tokensPerSecond={tokensPerSecond}
      />
    </main>
  )
}