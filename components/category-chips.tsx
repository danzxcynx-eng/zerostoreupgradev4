"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { CATEGORIES } from "@/lib/format"

export function CategoryChips({ active }: { active: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={() => setCategory("all")}
        className={cn(
          "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
          active === "all"
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground",
        )}
      >
        Semua
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.value}
          onClick={() => setCategory(c.value)}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === c.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
