"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { markAllNotificationsRead } from "@/app/actions/notifications"

export function MarkAllReadButton() {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => markAllNotificationsRead())}
    >
      Tandai semua dibaca
    </Button>
  )
}
