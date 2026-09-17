"use server"

import { db } from "@/lib/db"
import { listings, listingImages, user } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/session"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function getPendingListings() {
  await requireAdmin()

  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      category: listings.category,
      price: listings.price,
      description: listings.description,
      contactWa: listings.contactWa,
      createdAt: listings.createdAt,
      sellerId: listings.sellerId,
      sellerName: user.name,
      sellerEmail: user.email,
    })
    .from(listings)
    .leftJoin(user, eq(user.id, listings.sellerId))
    .where(eq(listings.status, "pending"))
    .orderBy(desc(listings.createdAt))

  const images = await db.select().from(listingImages).orderBy(listingImages.position)
  const grouped = new Map<number, string[]>()
  for (const img of images) {
    if (!grouped.has(img.listingId)) grouped.set(img.listingId, [])
    grouped.get(img.listingId)!.push(img.url)
  }

  return rows.map((r) => ({ ...r, images: grouped.get(r.id) ?? [] }))
}

export async function approveListing(id: number) {
  await requireAdmin()
  const [listing] = await db
    .update(listings)
    .set({ status: "active", rejectionReason: null })
    .where(eq(listings.id, id))
    .returning()

  if (listing) {
    await createNotification({
      userId: listing.sellerId,
      type: "listing_approved",
      title: "Listing disetujui",
      body: `"${listing.title}" kini tayang di marketplace`,
      link: `/listing/${id}`,
    })
  }

  revalidatePath("/admin")
}

export async function rejectListing(id: number, reason: string) {
  await requireAdmin()
  const [listing] = await db
    .update(listings)
    .set({ status: "rejected", rejectionReason: reason })
    .where(eq(listings.id, id))
    .returning()

  if (listing) {
    await createNotification({
      userId: listing.sellerId,
      type: "listing_rejected",
      title: "Listing ditolak",
      body: reason || "Listing tidak memenuhi syarat",
      link: `/dashboard`,
    })
  }

  revalidatePath("/admin")
}

export async function getAllUsers() {
  await requireAdmin()
  return db.select().from(user).orderBy(desc(user.createdAt))
}

export async function toggleUserBan(userId: string, banned: boolean) {
  await requireAdmin()
  await db
    .update(user)
    .set({ banned, banReason: banned ? "Melanggar ketentuan platform" : null })
    .where(eq(user.id, userId))
  revalidatePath("/admin")
}

export async function getAdminStats() {
  await requireAdmin()
  const allListings = await db.select().from(listings)
  const allUsers = await db.select().from(user)

  return {
    totalUsers: allUsers.length,
    totalListings: allListings.length,
    activeListings: allListings.filter((l) => l.status === "active").length,
    pendingListings: allListings.filter((l) => l.status === "pending").length,
    soldListings: allListings.filter((l) => l.status === "sold").length,
  }
}
