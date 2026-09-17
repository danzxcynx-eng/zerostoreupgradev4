"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Heart, MessageCircle, ShieldCheck, LogOut, Plus } from "lucide-react"

export function UserMenu({
  user,
}: {
  user: { id: string; name: string; email: string; image?: string | null; role: string }
}) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar className="size-9">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/sell")}>
            <Plus data-icon="inline-start" />
            Jual Akun
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            <LayoutDashboard data-icon="inline-start" />
            Dashboard Penjual
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/favorites")}>
            <Heart data-icon="inline-start" />
            Favorit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/messages")}>
            <MessageCircle data-icon="inline-start" />
            Pesan
          </DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <ShieldCheck data-icon="inline-start" />
              Panel Admin
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          <LogOut data-icon="inline-start" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
