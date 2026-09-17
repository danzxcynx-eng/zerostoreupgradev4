"use client"

import { useRef, useState, useTransition } from "react"
import { sendMessage } from "@/app/actions/messages"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { formatRelativeTime } from "@/lib/format"
import { SendHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: number
  senderId: string
  body: string
  createdAt: Date
}

export function ConversationThread({
  conversationId,
  initialMessages,
  currentUserId,
}: {
  conversationId: number
  initialMessages: Message[]
  currentUserId: string
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState("")
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const body = text.trim()
    if (!body) return

    const optimistic: Message = {
      id: Date.now(),
      senderId: currentUserId,
      body,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, optimistic])
    setText("")

    startTransition(async () => {
      await sendMessage(conversationId, body)
    })
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.map((m) => {
          const mine = m.senderId === currentUserId
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                  mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
              >
                <p className="whitespace-pre-line">{m.body}</p>
                <p className={cn("mt-0.5 text-[10px] opacity-70")}>{formatRelativeTime(m.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="border-t border-border p-3">
        <InputGroup>
          <InputGroupInput
            placeholder="Tulis pesan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" type="submit" disabled={pending || !text.trim()}>
              <SendHorizontal />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}
