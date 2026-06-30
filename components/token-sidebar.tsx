"use client"

import { Trash2, Activity, ArrowUp, ArrowDown, Sigma, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TokenUsage } from "@/lib/chat"

interface TokenSidebarProps {
  usage: TokenUsage
  messageCount: number
  onClear: () => void
  tokensPerSecond: number | null
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  )
}

export function TokenSidebar({ usage, messageCount, onClear, tokensPerSecond }: TokenSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-4 border-border bg-sidebar p-4 md:w-72 md:border-l">
      <div className="flex items-center gap-2">
        <Activity className="size-5 text-foreground" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Token Usage</h2>
      </div>

      <div className="flex flex-col gap-2">
        <StatRow
          icon={<ArrowUp className="size-4" aria-hidden="true" />}
          label="Prompt tokens"
          value={usage.promptTokens.toLocaleString()}
        />
        <StatRow
          icon={<ArrowDown className="size-4" aria-hidden="true" />}
          label="Completion tokens"
          value={usage.completionTokens.toLocaleString()}
        />
        <StatRow
          icon={<Sigma className="size-4" aria-hidden="true" />}
          label="Total tokens"
          value={usage.totalTokens.toLocaleString()}
        />
        <StatRow
          icon={<Zap className="size-4" aria-hidden="true" />}
          label="Tokens / sec"
          value={tokensPerSecond === null ? "—" : tokensPerSecond.toFixed(1)}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {messageCount} {messageCount === 1 ? "message" : "messages"} in this conversation.
      </p>

      <div className="mt-auto">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center gap-2 bg-transparent"
          onClick={onClear}
          disabled={messageCount === 0}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Clear conversation
        </Button>
      </div>
    </aside>
  )
}