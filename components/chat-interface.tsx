"use client"

import { useCallback, useMemo, useState } from "react"
import { MessageSquare } from "lucide-react"
import { MessageList } from "@/components/message-list"
import { ChatInput } from "@/components/chat-input"
import { TokenSidebar } from "@/components/token-sidebar"
import { estimateTokens, generateReply, type ChatMessage } from "@/lib/chat"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const usage = useMemo(() => {
    let promptTokens = 0
    let completionTokens = 0
    for (const message of messages) {
      const tokens = estimateTokens(message.content)
      if (message.role === "user") promptTokens += tokens
      else completionTokens += tokens
    }
    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    }
  }, [messages])

  const handleSend = useCallback((text: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsThinking(true)

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: generateReply(text),
      }
      setMessages((prev) => [...prev, reply])
      setIsThinking(false)
    }, 900)
  }, [])

  const handleClear = useCallback(() => {
    setMessages([])
    setIsThinking(false)
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
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <ChatInput onSend={handleSend} disabled={isThinking} />
        </div>
      </section>

      <TokenSidebar usage={usage} messageCount={messages.length} onClear={handleClear} />
    </main>
  )
}
