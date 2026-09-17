import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getCurrentSession } from "@/lib/session"
import { getMyConversations } from "@/app/actions/messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { formatRelativeTime } from "@/lib/format"
import { MessageCircle, ImageOff } from "lucide-react"

export default async function MessagesPage() {
  const session = await getCurrentSession()
  if (!session?.user) redirect("/sign-in")

  const conversations = await getMyConversations()

  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <h1 className="mb-4 text-xl font-bold">Pesan</h1>

      {conversations.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageCircle />
            </EmptyMedia>
            <EmptyTitle>Belum ada percakapan</EmptyTitle>
            <EmptyDescription>Chat penjual dari halaman listing untuk mulai percakapan.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-1">
          {conversations.map((c) => {
            const initials = c.otherUserName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
              >
                <Avatar className="size-11 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.otherUserName}</p>
                  <p className="truncate text-sm text-muted-foreground">{c.listingTitle}</p>
                </div>
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  {c.image ? (
                    <Image src={c.image || "/placeholder.svg"} alt="" fill className="object-cover" crossOrigin="anonymous" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageOff className="size-3.5" />
                    </div>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(c.lastMessageAt)}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
