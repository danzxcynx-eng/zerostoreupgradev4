import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentSession } from "@/lib/session"
import { getConversation } from "@/app/actions/messages"
import { ConversationThread } from "@/components/conversation-thread"
import { ChevronLeft } from "lucide-react"

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getCurrentSession()
  if (!session?.user) redirect("/sign-in")

  let data
  try {
    data = await getConversation(Number(id))
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Link href="/messages" className="text-muted-foreground">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{data.otherUserName}</p>
          <Link href={`/listing/${data.conv.listingId}`} className="truncate text-xs text-muted-foreground">
            {data.conv.listingTitle}
          </Link>
        </div>
      </div>

      <ConversationThread
        conversationId={data.conv.id}
        initialMessages={data.messages}
        currentUserId={data.userId}
      />
    </div>
  )
}
