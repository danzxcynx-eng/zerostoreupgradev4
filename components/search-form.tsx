"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { Search } from "lucide-react"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get("q") ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (q.trim()) {
      params.set("q", q.trim())
    } else {
      params.delete("q")
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupInput
          placeholder="Cari akun game..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari akun game"
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
