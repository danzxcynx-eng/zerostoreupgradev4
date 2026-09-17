import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/session"
import { getMyFavorites } from "@/app/actions/favorites"
import { ListingCard } from "@/components/listing-card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Heart } from "lucide-react"

export default async function FavoritesPage() {
  const session = await getCurrentSession()
  if (!session?.user) redirect("/sign-in")

  const favorites = await getMyFavorites()

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <h1 className="mb-4 text-xl font-bold">Favorit Saya</h1>

      {favorites.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>Belum ada favorit</EmptyTitle>
            <EmptyDescription>Simpan akun yang kamu suka untuk dilihat nanti.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {favorites.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
