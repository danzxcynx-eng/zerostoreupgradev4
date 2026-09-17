"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Heart, PlusCircle, MessageCircle, User } from "lucide-react"

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/favorites", label: "Favorit", icon: Heart },
  { href: "/sell", label: "Jual", icon: PlusCircle },
  { href: "/messages", label: "Pesan", icon: MessageCircle },
  { href: "/dashboard", label: "Akun", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur sm:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("size-5", item.href === "/sell" && "size-6")} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
