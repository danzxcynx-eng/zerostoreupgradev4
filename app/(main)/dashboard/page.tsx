import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentSession } from "@/lib/session"
import { getMyListings } from "@/app/actions/listings"
import { DashboardListingItem } from "@/components/dashboard-listing-item"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { formatPrice } from "@/lib/format"
import { Plus, Package, Eye, CheckCircle2 } from "lucide-react"

export default async function DashboardPage() {
  const session = await getCurrentSession()
  if (!session?.user) redirect("/sign-in")

  const listings = await getMyListings()
  const activeCount = listings.filter((l) => l.status === "active").length
  const soldCount = listings.filter((l) => l.status === "sold").length
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0)
  const totalSalesValue = listings.filter((l) => l.status === "sold").reduce((sum, l) => sum + l.price, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard Penjual</h1>
        <Button asChild size="sm">
          <Link href="/sell">
            <Plus data-icon="inline-start" />
            Jual
          </Link>
        </Button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <Package className="mb-1 size-4 text-muted-foreground" />
          <p className="text-lg font-bold">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Listing Aktif</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <CheckCircle2 className="mb-1 size-4 text-muted-foreground" />
          <p className="text-lg font-bold">{soldCount}</p>
          <p className="text-xs text-muted-foreground">Terjual</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <Eye className="mb-1 size-4 text-muted-foreground" />
          <p className="text-lg font-bold">{totalViews}</p>
          <p className="text-xs text-muted-foreground">Total Dilihat</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="mb-1 text-lg font-bold text-primary">{formatPrice(totalSalesValue)}</p>
          <p className="text-xs text-muted-foreground">Total Penjualan</p>
        </div>
      </div>

      {listings.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>Belum ada listing</EmptyTitle>
            <EmptyDescription>Mulai jual akun game pertamamu sekarang.</EmptyDescription>
          </EmptyHeader>
          <Button asChild>
            <Link href="/sell">Jual Akun</Link>
          </Button>
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((listing) => (
            <DashboardListingItem key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
