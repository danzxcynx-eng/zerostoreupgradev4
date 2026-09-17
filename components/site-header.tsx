import Link from "next/link"
import { getCurrentSession } from "@/lib/session"
import { getUnreadNotificationCount } from "@/app/actions/notifications"
import { getUnreadMessageCount } from "@/app/actions/messages"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search-form"
import { Gamepad2, Bell, MessageCircle } from "lucide-react"

export async function SiteHeader() {
  const session = await getCurrentSession()
  const [unreadNotifs, unreadMsgs] = session?.user
    ? await Promise.all([getUnreadNotificationCount(), getUnreadMessageCount()])
    : [0, 0]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Gamepad2 className="size-4" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            Zero<span className="text-primary">Store</span>
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <SearchForm />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {session?.user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/messages" aria-label="Pesan">
                  <MessageCircle />
                  {unreadMsgs > 0 && (
                    <span className="absolute right-1 top-1 flex size-2 rounded-full bg-primary" />
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications" aria-label="Notifikasi">
                  <Bell />
                  {unreadNotifs > 0 && (
                    <span className="absolute right-1 top-1 flex size-2 rounded-full bg-primary" />
                  )}
                </Link>
              </Button>
              <UserMenu user={session.user} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Masuk</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
