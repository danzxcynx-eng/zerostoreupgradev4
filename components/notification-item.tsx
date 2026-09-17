"use client"

import { useTransition } from "react"
import Link from "next/link"
import { markNotificationRead } from "@/app/actions/notifications"
import { formatRelativeTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Star, MessageCircle, Bell } from "lucide-react"

const ICONS: Record<string, typeof Bell> = {
  listing_approved: CheckCircle2,
  listing_rejected: XCircle,
  listing_sold: CheckCircle2,
  new_review: Star,
  new_message: MessageCircle,
  favorite_price_drop: Bell,
  system: Bell,
}

export function NotificationItem({
  notification,
}: {
  notification: {
    id: number
    type: string
    title: string
    body: string | null
    link: string | null
    read: boolean
    createdAt: Date
  }
}) {
  const [, startTransition] = useTransition()
  const Icon = ICONS[notification.type] ?? Bell

  function handleClick() {
    if (!notification.read) {
      startTransition(async () => {
        await markNotificationRead(notification.id)
      })
    }
  }

  const content = (
    <div
      className={cn(
        "flex gap-3 rounded-lg p-3",
        !notification.read && "bg-accent",
      )}
      onClick={handleClick}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{notification.title}</p>
        {notification.body && <p className="text-sm text-muted-foreground">{notification.body}</p>}
        <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
      </div>
      {!notification.read && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
    </div>
  )

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>
  }
  return content
}
