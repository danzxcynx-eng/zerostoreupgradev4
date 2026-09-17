import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/session"
import { getPendingListings, getAllUsers, getAdminStats } from "@/app/actions/admin"
import { AdminListingReview } from "@/components/admin-listing-review"
import { AdminUserRow } from "@/components/admin-user-row"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { ShieldCheck, Users, Package, Clock } from "lucide-react"

export default async function AdminPage() {
  const session = await getCurrentSession()
  if (!session?.user) redirect("/sign-in")
  if (session.user.role !== "admin") redirect("/")

  const [pending, users, stats] = await Promise.all([getPendingListings(), getAllUsers(), getAdminStats()])

  return (
    <div className="mx-auto max-w-4xl px-4 py-5">
      <h1 className="mb-4 text-xl font-bold">Panel Admin</h1>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <Users className="mb-1 size-4 text-muted-foreground" />
          <p className="text-lg font-bold">{stats.totalUsers}</p>
          <p className="text-xs text-muted-foreground">Pengguna</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <Package className="mb-1 size-4 text-muted-foreground" />
          <p className="text-lg font-bold">{stats.activeListings}</p>
          <p className="text-xs text-muted-foreground">Listing Aktif</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <Clock className="mb-1 size-4 text-muted-foreground" />
          <p className="text-lg font-bold">{stats.pendingListings}</p>
          <p className="text-xs text-muted-foreground">Menunggu</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <ShieldCheck className="mb-1 size-4 text-muted-foreground" />
          <p className="text-lg font-bold">{stats.soldListings}</p>
          <p className="text-xs text-muted-foreground">Terjual</p>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Moderasi ({pending.length})</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pending.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldCheck />
                </EmptyMedia>
                <EmptyTitle>Tidak ada listing menunggu</EmptyTitle>
                <EmptyDescription>Semua listing sudah ditinjau.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((listing) => (
                <AdminListingReview key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <AdminUserRow key={u.id} user={u} />
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
