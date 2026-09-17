import { getActiveListings } from "@/app/actions/listings"
import { ListingCard } from "@/components/listing-card"
import { CategoryChips } from "@/components/category-chips"
import { SortSelect } from "@/components/sort-select"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Search } from "lucide-react"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const params = await searchParams
  const category = params.category ?? "all"
  const sort = (params.sort as "newest" | "price-asc" | "price-desc") ?? "newest"

  const listings = await getActiveListings({
    category,
    q: params.q,
    sort,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <div className="mb-5 rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-5 text-primary-foreground">
        <h1 className="text-xl font-bold sm:text-2xl">Jual Beli Akun Game Terpercaya</h1>
        <p className="mt-1 text-sm text-primary-foreground/90">
          Transaksi aman, ribuan akun game siap pakai menanti kamu
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <CategoryChips active={category} />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {listings.length} akun {params.q ? `untuk "${params.q}"` : "ditemukan"}
          </p>
          <SortSelect value={sort} />
        </div>
      </div>

      {listings.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>Belum ada akun ditemukan</EmptyTitle>
            <EmptyDescription>Coba ubah filter atau kata kunci pencarian kamu.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
