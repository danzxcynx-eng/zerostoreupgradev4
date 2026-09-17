import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatPrice, categoryLabel } from "@/lib/format"
import { ImageOff } from "lucide-react"

export function ListingCard({
  listing,
}: {
  listing: {
    id: number
    title: string
    category: string
    price: number
    image: string | null
    rank?: string | null
    status?: string
    sellerName?: string | null
  }
}) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {listing.image ? (
          <Image
            src={listing.image || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" />
          </div>
        )}
        <Badge className="absolute left-2 top-2" variant="secondary">
          {categoryLabel(listing.category)}
        </Badge>
        {listing.status === "sold" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="destructive" className="text-sm">
              TERJUAL
            </Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">{listing.title}</h3>
        {listing.rank && <p className="text-xs text-muted-foreground">Rank {listing.rank}</p>}
        <p className="mt-auto pt-1 text-base font-bold text-primary">{formatPrice(listing.price)}</p>
        {listing.sellerName && (
          <p className="truncate text-xs text-muted-foreground">oleh {listing.sellerName}</p>
        )}
      </div>
    </Link>
  )
}
