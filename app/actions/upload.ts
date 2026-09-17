"use server"

import { put } from "@vercel/blob"
import { requireUserId } from "@/lib/session"

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function uploadListingImage(formData: FormData) {
  const userId = await requireUserId()
  const file = formData.get("file") as File | null

  if (!file || file.size === 0) {
    throw new Error("File tidak ditemukan")
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran gambar maksimal 5MB")
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, WEBP, atau GIF")
  }

  const ext = file.name.split(".").pop() || "jpg"
  const key = `listings/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
  })

  return blob.url
}
