import { SiteHeader } from "@/components/site-header"
import { BottomNav } from "@/components/bottom-nav"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 sm:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
