"use server"

import { db } from "@/lib/db"
import { favorites, listings, listingImages, user } from "@/lib/db/schema"
import { requireUserId } from "@/lib/session"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function toggleFavorite(listingId: number) {
  const userId = await requireUserId()

  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.listingId, listingId)))

  if (existing) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.listingId, listingId)))
    revalidatePath("/favorites")
    return false
  }

  await db.insert(favorites).values({ userId, listingId })
  revalidatePath("/favorites")
  return true
}

export async function getMyFavorites() {
  const userId = await requireUserId()

  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      category: listings.category,
      price: listings.price,
      status: listings.status,
      sellerId: listings.sellerId,
      sellerName: user.name,
      favoritedAt: favorites.createdAt,
    })
    .from(favorites)
    .innerJoin(listings, eq(listings.id, favorites.listingId))
    .leftJoin(user, eq(user.id, listings.sellerId))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt))

  const images = await db.select().from(listingImages).orderBy(listingImages.position)
  const imageMap = new Map<number, string>()
  for (const img of images) {
    if (!imageMap.has(img.listingId)) imageMap.set(img.listingId, img.url)
  }

  return rows.map((r) => ({ ...r, image: imageMap.get(r.id) ?? null }))
}
