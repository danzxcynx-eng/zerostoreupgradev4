"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { uploadListingImage } from "@/app/actions/upload"
import { ImagePlus, X } from "lucide-react"

const MAX_IMAGES = 6

export function ImageUpload({
  value,
  onChange,
}: {
  value: string[]
  onChange: (urls: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const remaining = MAX_IMAGES - value.length
    const toUpload = Array.from(files).slice(0, remaining)

    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of toUpload) {
        const formData = new FormData()
        formData.set("file", file)
        const url = await uploadListingImage(formData)
        uploaded.push(url)
      }
      onChange([...value, ...uploaded])
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengunggah gambar")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {value.map((url, i) => (
        <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-border">
          <Image src={url || "/placeholder.svg"} alt="" fill className="object-cover" crossOrigin="anonymous" />
          <button
            type="button"
            onClick={() => removeAt(i)}
            className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/90 text-foreground"
            aria-label="Hapus foto"
          >
            <X className="size-3.5" />
          </button>
          {i === 0 && (
            <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              Utama
            </span>
          )}
        </div>
      ))}
      {value.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground disabled:opacity-60"
        >
          {uploading ? <Spinner /> : <ImagePlus className="size-5" />}
          <span className="text-[11px]">Tambah</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
