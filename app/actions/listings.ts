"use server"

import { db } from "@/lib/db"
import { listings, listingImages, user, favorites, reviews } from "@/lib/db/schema"
import { requireUserId, getCurrentSession } from "@/lib/session"
import { and, avg, count, desc, eq, ilike, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function createListing(input: {
  title: string
  category: string
  price: number
  description?: string
  rank?: string
  level?: number
  skins?: number
  contactWa: string
  images: string[]
}) {
  const userId = await requireUserId()

  if (!input.title.trim() || input.title.length > 120) {
    throw new Error("Judul wajib diisi (maks 120 karakter)")
  }
  if (!Number.isFinite(input.price) || input.price <= 0) {
    throw new Error("Harga tidak valid")
  }
  if (!input.contactWa.trim()) {
    throw new Error("Nomor WhatsApp wajib diisi")
  }
  if (!input.images.length) {
    throw new Error("Minimal 1 foto akun wajib diunggah")
  }

  const [row] = await db
    .insert(listings)
    .values({
      sellerId: userId,
      title: input.title.trim(),
      category: input.category,
      price: Math.round(input.price),
      description: input.description?.trim() || null,
      rank: input.rank?.trim() || null,
      level: input.level ?? 0,
      skins: input.skins ?? 0,
      contactWa: input.contactWa.trim(),
      status: "pending",
    })
    .returning()

  await db.insert(listingImages).values(
    input.images.map((url, i) => ({
      listingId: row.id,
      url,
      position: i,
    })),
  )

  revalidatePath("/dashboard")
  return row.id
}

export async function getActiveListings(filters?: {
  category?: string
  q?: string
  minPrice?: number
  maxPrice?: number
  sort?: "newest" | "price-asc" | "price-desc"
}) {
  const conditions = [eq(listings.status, "active")]

  if (filters?.category && filters.category !== "all") {
    conditions.push(eq(listings.category, filters.category))
  }
  if (filters?.q) {
    conditions.push(ilike(listings.title, `%${filters.q}%`))
  }
  if (filters?.minPrice !== undefined) {
    conditions.push(sql`${listings.price} >= ${filters.minPrice}`)
  }
  if (filters?.maxPrice !== undefined) {
    conditions.push(sql`${listings.price} <= ${filters.maxPrice}`)
  }

  const orderBy =
    filters?.sort === "price-asc"
      ? listings.price
      : filters?.sort === "price-desc"
        ? desc(listings.price)
        : desc(listings.createdAt)

  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      category: listings.category,
      price: listings.price,
      rank: listings.rank,
      level: listings.level,
      views: listings.views,
      createdAt: listings.createdAt,
      sellerId: listings.sellerId,
      sellerName: user.name,
    })
    .from(listings)
    .leftJoin(user, eq(user.id, listings.sellerId))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(60)

  const images = await db.select().from(listingImages).orderBy(listingImages.position)
  const imageMap = new Map<number, string>()
  for (const img of images) {
    if (!imageMap.has(img.listingId)) imageMap.set(img.listingId, img.url)
  }

  return rows.map((r) => ({ ...r, image: imageMap.get(r.id) ?? null }))
}

export async function getListingDetail(id: number) {
  const [listing] = await db
    .select({
      id: listings.id,
      title: listings.title,
      category: listings.category,
      price: listings.price,
      description: listings.description,
      rank: listings.rank,
      level: listings.level,
      skins: listings.skins,
      contactWa: listings.contactWa,
      status: listings.status,
      views: listings.views,
      createdAt: listings.createdAt,
      sellerId: listings.sellerId,
      sellerName: user.name,
      sellerImage: user.image,
    })
    .from(listings)
    .leftJoin(user, eq(user.id, listings.sellerId))
    .where(eq(listings.id, id))

  if (!listing) return null

  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, id))
    .orderBy(listingImages.position)

  const [ratingRow] = await db
    .select({ avg: avg(reviews.rating), count: count(reviews.id) })
    .from(reviews)
    .where(eq(reviews.sellerId, listing.sellerId))

  await db
    .update(listings)
    .set({ views: sql`${listings.views} + 1` })
    .where(eq(listings.id, id))

  const session = await getCurrentSession()
  let isFavorited = false
  if (session?.user) {
    const [fav] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.listingId, id)))
    isFavorited = !!fav
  }

  return {
    ...listing,
    images: images.map((i) => i.url),
    sellerRating: ratingRow?.avg ? Number(ratingRow.avg) : null,
    sellerReviewCount: ratingRow?.count ?? 0,
    isFavorited,
    isOwner: session?.user?.id === listing.sellerId,
  }
}

export async function getMyListings() {
  const userId = await requireUserId()
  const rows = await db
    .select()
    .from(listings)
    .where(eq(listings.sellerId, userId))
    .orderBy(desc(listings.createdAt))

  const images = await db.select().from(listingImages).orderBy(listingImages.position)
  const imageMap = new Map<number, string>()
  for (const img of images) {
    if (!imageMap.has(img.listingId)) imageMap.set(img.listingId, img.url)
  }

  return rows.map((r) => ({ ...r, image: imageMap.get(r.id) ?? null }))
}

export async function markListingSold(id: number) {
  const userId = await requireUserId()
  await db
    .update(listings)
    .set({ status: "sold" })
    .where(and(eq(listings.id, id), eq(listings.sellerId, userId)))
  revalidatePath("/dashboard")
}

export async function deleteListing(id: number) {
  const userId = await requireUserId()
  await db
    .update(listings)
    .set({ status: "removed" })
    .where(and(eq(listings.id, id), eq(listings.sellerId, userId)))
  revalidatePath("/dashboard")
}

export async function getSellerProfile(sellerId: string) {
  const [seller] = await db.select().from(user).where(eq(user.id, sellerId))
  if (!seller) return null

  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      category: listings.category,
      price: listings.price,
      status: listings.status,
      createdAt: listings.createdAt,
    })
    .from(listings)
    .where(and(eq(listings.sellerId, sellerId), eq(listings.status, "active")))
    .orderBy(desc(listings.createdAt))

  const images = await db.select().from(listingImages).orderBy(listingImages.position)
  const imageMap = new Map<number, string>()
  for (const img of images) {
    if (!imageMap.has(img.listingId)) imageMap.set(img.listingId, img.url)
  }

  const sellerReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      reviewerId: reviews.reviewerId,
      reviewerName: user.name,
    })
    .from(reviews)
    .leftJoin(user, eq(user.id, reviews.reviewerId))
    .where(eq(reviews.sellerId, sellerId))
    .orderBy(desc(reviews.createdAt))

  const [ratingRow] = await db
    .select({ avg: avg(reviews.rating), count: count(reviews.id) })
    .from(reviews)
    .where(eq(reviews.sellerId, sellerId))

  return {
    seller,
    listings: rows.map((r) => ({ ...r, image: imageMap.get(r.id) ?? null })),
    reviews: sellerReviews,
    rating: ratingRow?.avg ? Number(ratingRow.avg) : null,
    reviewCount: ratingRow?.count ?? 0,
  }
}
