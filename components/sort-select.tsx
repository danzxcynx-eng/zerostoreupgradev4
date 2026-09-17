"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SortSelect({ value }: { value: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", sort)
    router.push(`/?${params.toString()}`)
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[150px]" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="newest">Terbaru</SelectItem>
          <SelectItem value="price-asc">Harga Terendah</SelectItem>
          <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
