"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createListing } from "@/app/actions/listings"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORIES } from "@/lib/format"

export function SellForm() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState("")
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const id = await createListing({
          title: String(form.get("title") ?? ""),
          category,
          price: Number(form.get("price") ?? 0),
          description: String(form.get("description") ?? ""),
          rank: String(form.get("rank") ?? ""),
          level: Number(form.get("level") ?? 0),
          skins: Number(form.get("skins") ?? 0),
          contactWa: String(form.get("contactWa") ?? ""),
          images,
        })
        toast.success("Listing dikirim! Menunggu persetujuan admin.")
        router.push("/dashboard")
      } catch (e) {
        if (e instanceof Error && e.message === "Unauthorized") {
          router.push("/sign-in")
          return
        }
        toast.error(e instanceof Error ? e.message : "Gagal membuat listing")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="pb-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Foto Akun</FieldLabel>
          <ImageUpload value={images} onChange={setImages} />
          <FieldDescription>Unggah 1-6 foto bukti akun (screenshot profil, rank, skin).</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="title">Judul Listing</FieldLabel>
          <Input id="title" name="title" placeholder="Contoh: Akun ML Mythic Full Skin" required maxLength={120} />
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Kategori Game</FieldLabel>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Pilih game" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="price">Harga (Rp)</FieldLabel>
          <Input id="price" name="price" type="number" min={1000} placeholder="150000" required />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field>
            <FieldLabel htmlFor="rank">Rank</FieldLabel>
            <Input id="rank" name="rank" placeholder="Mythic" />
          </Field>
          <Field>
            <FieldLabel htmlFor="level">Level</FieldLabel>
            <Input id="level" name="level" type="number" min={0} placeholder="80" />
          </Field>
          <Field>
            <FieldLabel htmlFor="skins">Skin</FieldLabel>
            <Input id="skins" name="skins" type="number" min={0} placeholder="20" />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
          <Textarea id="description" name="description" placeholder="Detail tambahan tentang akun..." rows={4} />
        </Field>

        <Field>
          <FieldLabel htmlFor="contactWa">Nomor WhatsApp</FieldLabel>
          <Input id="contactWa" name="contactWa" placeholder="62812xxxxxxx" required />
          <FieldDescription>Pembeli akan menghubungi kamu lewat nomor ini.</FieldDescription>
        </Field>

        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Mengirim..." : "Kirim Listing"}
        </Button>
      </FieldGroup>
    </form>
  )
}
