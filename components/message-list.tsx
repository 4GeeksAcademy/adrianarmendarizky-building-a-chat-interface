"use client"

import { useEffect, useRef } from "react"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/chat"

interface MessageListProps {
  messages: ChatMessage[]
  isThinking: boolean
}

export function MessageList({ messages, isThinking }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  if (messages.length === 0 && !isThinking) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Bot className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Start a conversation</p>
          <p className="text-sm text-muted-foreground">Send a message to begin chatting.</p>
        </div>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-4" aria-live="polite">
      {messages.map((message) => (
        <li
          key={message.id}
          className={cn(
            "flex items-start gap-3",
            message.role === "user" ? "flex-row-reverse" : "flex-row",
          )}
        >
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
            aria-hidden="true"
          >
            {message.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
          </div>
          <div
            className={cn(
              "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              message.role === "user"
                ? "rounded-tr-sm bg-primary text-primary-foreground"
                : "rounded-tl-sm bg-muted text-foreground",
            )}
          >
            <span className="sr-only">{message.role === "user" ? "You said: " : "Assistant said: "}</span>
            {message.content}
          </div>
        </li>
      ))}

      {isThinking && (
        <li className="flex items-start gap-3">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
            aria-hidden="true"
          >
            <Bot className="size-4" />
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
            <span className="sr-only">Assistant is typing</span>
            <span className="flex gap-1">
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground/60" />
            </span>
          </div>
        </li>
      )}

      <div ref={bottomRef} />
    </ul>
  )
}
