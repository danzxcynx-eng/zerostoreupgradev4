"use client"

import { useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { markListingSold, deleteListing } from "@/app/actions/listings"
import { formatPrice, categoryLabel } from "@/lib/format"
import { ImageOff, CheckCircle2, Trash2 } from "lucide-react"

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Menunggu Review", variant: "outline" },
  active: { label: "Aktif", variant: "default" },
  rejected: { label: "Ditolak", variant: "destructive" },
  sold: { label: "Terjual", variant: "secondary" },
  removed: { label: "Dihapus", variant: "secondary" },
}

export function DashboardListingItem({
  listing,
}: {
  listing: {
    id: number
    title: string
    category: string
    price: number
    status: string
    image: string | null
    rejectionReason: string | null
    views: number
  }
}) {
  const [pending, startTransition] = useTransition()
  const status = STATUS_LABEL[listing.status] ?? STATUS_LABEL.pending

  function handleSold() {
    startTransition(async () => {
      await markListingSold(listing.id)
      toast.success("Ditandai terjual")
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteListing(listing.id)
      toast.success("Listing dihapus")
    })
  }

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-3">
      <Link href={`/listing/${listing.id}`} className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {listing.image ? (
          <Image src={listing.image || "/placeholder.svg"} alt="" fill className="object-cover" crossOrigin="anonymous" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-5" />
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/listing/${listing.id}`} className="line-clamp-1 text-sm font-medium">
            {listing.title}
          </Link>
          <Badge variant={status.variant} className="shrink-0">
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {categoryLabel(listing.category)} · {listing.views} dilihat
        </p>
        <p className="mt-0.5 text-sm font-bold text-primary">{formatPrice(listing.price)}</p>
        {listing.status === "rejected" && listing.rejectionReason && (
          <p className="mt-1 text-xs text-destructive">Alasan: {listing.rejectionReason}</p>
        )}
        {listing.status === "active" && (
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSold} disabled={pending}>
              <CheckCircle2 data-icon="inline-start" />
              Tandai Terjual
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDelete} disabled={pending}>
              <Trash2 data-icon="inline-start" />
              Hapus
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
