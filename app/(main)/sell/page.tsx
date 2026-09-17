import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/session"
import { SellForm } from "@/components/sell-form"

export default async function SellPage() {
  const session = await getCurrentSession()
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <h1 className="mb-1 text-xl font-bold">Jual Akun Game</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Listing kamu akan ditinjau admin sebelum tayang di marketplace.
      </p>
      <SellForm />
    </div>
  )
}
