"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { approveListing, rejectListing } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice, formatRelativeTime, categoryLabel } from "@/lib/format"
import { CheckCircle2, XCircle, ImageOff } from "lucide-react"

export function AdminListingReview({
  listing,
}: {
  listing: {
    id: number
    title: string
    category: string
    price: number
    description: string | null
    contactWa: string
    createdAt: Date
    sellerName: string | null
    sellerEmail: string | null
    images: string[]
  }
}) {
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState("")
  const [pending, startTransition] = useTransition()

  function handleApprove() {
    startTransition(async () => {
      await approveListing(listing.id)
      toast.success("Listing disetujui")
    })
  }

  function handleReject() {
    if (!reason.trim()) {
      toast.error("Isi alasan penolakan")
      return
    }
    startTransition(async () => {
      await rejectListing(listing.id, reason.trim())
      toast.success("Listing ditolak")
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex gap-2 overflow-x-auto">
        {listing.images.length > 0 ? (
          listing.images.map((img) => (
            <div key={img} className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={img || "/placeholder.svg"} alt="" fill className="object-cover" crossOrigin="anonymous" />
            </div>
          ))
        ) : (
          <div className="flex size-20 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <ImageOff className="size-5" />
          </div>
        )}
      </div>

      <p className="font-medium">{listing.title}</p>
      <p className="text-xs text-muted-foreground">
        {categoryLabel(listing.category)} · {formatRelativeTime(listing.createdAt)}
      </p>
      <p className="mt-1 font-bold text-primary">{formatPrice(listing.price)}</p>
      {listing.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        Penjual: {listing.sellerName} ({listing.sellerEmail}) · WA: {listing.contactWa}
      </p>

      {showReject ? (
        <div className="mt-3 flex flex-col gap-2">
          <Textarea
            placeholder="Alasan penolakan..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={handleReject} disabled={pending}>
              Kirim Penolakan
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowReject(false)} disabled={pending}>
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={handleApprove} disabled={pending}>
            <CheckCircle2 data-icon="inline-start" />
            Setujui
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowReject(true)} disabled={pending}>
            <XCircle data-icon="inline-start" />
            Tolak
          </Button>
        </div>
      )}
    </div>
  )
}
