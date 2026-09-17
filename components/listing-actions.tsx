"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { toggleFavorite } from "@/app/actions/favorites"
import { startConversation } from "@/app/actions/messages"
import { Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ListingActions({
  listing,
}: {
  listing: { id: number; isFavorited: boolean; isOwner: boolean; status: string; contactWa: string }
}) {
  const router = useRouter()
  const [favorited, setFavorited] = useState(listing.isFavorited)
  const [pending, startFavTransition] = useTransition()
  const [chatPending, startChatTransition] = useTransition()

  function handleFavorite() {
    startFavTransition(async () => {
      try {
        const result = await toggleFavorite(listing.id)
        setFavorited(result)
        toast.success(result ? "Ditambahkan ke favorit" : "Dihapus dari favorit")
      } catch (e) {
        if (e instanceof Error && e.message === "Unauthorized") {
          router.push("/sign-in")
          return
        }
        toast.error("Gagal memperbarui favorit")
      }
    })
  }

  function handleChat() {
    startChatTransition(async () => {
      try {
        const id = await startConversation(listing.id)
        router.push(`/messages/${id}`)
      } catch (e) {
        if (e instanceof Error && e.message === "Unauthorized") {
          router.push("/sign-in")
          return
        }
        toast.error(e instanceof Error ? e.message : "Gagal membuka chat")
      }
    })
  }

  if (listing.isOwner) return null

  const waLink = `https://wa.me/${listing.contactWa.replace(/[^0-9]/g, "")}`

  return (
    <div className="fixed inset-x-0 bottom-16 z-30 flex gap-2 border-t border-border bg-background p-3 sm:sticky sm:bottom-0 sm:mt-6 sm:rounded-lg sm:border">
      <Button variant="outline" size="icon" onClick={handleFavorite} disabled={pending} aria-label="Favorit">
        <Heart className={cn(favorited && "fill-primary text-primary")} />
      </Button>
      <Button variant="secondary" className="flex-1" onClick={handleChat} disabled={chatPending || listing.status !== "active"}>
        <MessageCircle data-icon="inline-start" />
        Chat Penjual
      </Button>
      <Button className="flex-1" asChild disabled={listing.status !== "active"}>
        <a href={waLink} target="_blank" rel="noopener noreferrer">
          Hubungi WA
        </a>
      </Button>
    </div>
  )
}
