import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/session"
import { getMyNotifications } from "@/app/actions/notifications"
import { NotificationItem } from "@/components/notification-item"
import { MarkAllReadButton } from "@/components/mark-all-read-button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Bell } from "lucide-react"

export default async function NotificationsPage() {
  const session = await getCurrentSession()
  if (!session?.user) redirect("/sign-in")

  const notifications = await getMyNotifications()

  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Notifikasi</h1>
        {notifications.some((n) => !n.read) && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell />
            </EmptyMedia>
            <EmptyTitle>Tidak ada notifikasi</EmptyTitle>
            <EmptyDescription>Update tentang listing dan pesanmu akan muncul di sini.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-1">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      )}
    </div>
  )
}
