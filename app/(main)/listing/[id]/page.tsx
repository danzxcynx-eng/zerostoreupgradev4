import { notFound } from "next/navigation"
import Link from "next/link"
import { getListingDetail } from "@/app/actions/listings"
import { ListingGallery } from "@/components/listing-gallery"
import { ListingActions } from "@/components/listing-actions"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatRelativeTime, categoryLabel } from "@/lib/format"
import { Star, Eye, Trophy, Layers } from "lucide-react"

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListingDetail(Number(id))

  if (!listing || (listing.status !== "active" && !listing.isOwner)) {
    notFound()
  }

  const initials = (listing.sellerName ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="mx-auto max-w-4xl px-4 py-5">
      <ListingGallery images={listing.images} title={listing.title} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{categoryLabel(listing.category)}</Badge>
        {listing.status === "sold" && <Badge variant="destructive">Terjual</Badge>}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="size-3.5" /> {listing.views} dilihat
        </span>
        <span className="text-xs text-muted-foreground">{formatRelativeTime(listing.createdAt)}</span>
      </div>

      <h1 className="mt-2 text-xl font-bold leading-snug">{listing.title}</h1>
      <p className="mt-1 text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>

      <div className="mt-3 flex gap-4 rounded-lg border border-border bg-card p-3">
        {listing.rank && (
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="size-4 text-muted-foreground" />
            <span>Rank {listing.rank}</span>
          </div>
        )}
        {!!listing.level && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Lv.{listing.level}</span>
          </div>
        )}
        {!!listing.skins && (
          <div className="flex items-center gap-2 text-sm">
            <Layers className="size-4 text-muted-foreground" />
            <span>{listing.skins} skin</span>
          </div>
        )}
      </div>

      {listing.description && (
        <div className="mt-4">
          <h2 className="mb-1 text-sm font-semibold">Deskripsi</h2>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{listing.description}</p>
        </div>
      )}

      <Separator className="my-4" />

      <Link
        href={`/profile/${listing.sellerId}`}
        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
      >
        <Avatar className="size-11">
          <AvatarImage src={listing.sellerImage ?? undefined} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{listing.sellerName}</p>
          {listing.sellerReviewCount > 0 ? (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {listing.sellerRating?.toFixed(1)} ({listing.sellerReviewCount} ulasan)
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Belum ada ulasan</p>
          )}
        </div>
      </Link>

      <ListingActions listing={listing} />
    </div>
  )
}
