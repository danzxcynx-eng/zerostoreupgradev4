"use server"

import { db } from "@/lib/db"
import { conversations, messages, listings, listingImages, user } from "@/lib/db/schema"
import { requireUserId } from "@/lib/session"
import { and, desc, eq, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function startConversation(listingId: number) {
  const buyerId = await requireUserId()

  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId))
  if (!listing) throw new Error("Listing tidak ditemukan")
  if (listing.sellerId === buyerId) throw new Error("Tidak bisa chat dengan diri sendiri")

  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.listingId, listingId), eq(conversations.buyerId, buyerId)))

  if (existing) return existing.id

  const [created] = await db
    .insert(conversations)
    .values({ listingId, buyerId, sellerId: listing.sellerId })
    .returning()

  return created.id
}

export async function getMyConversations() {
  const userId = await requireUserId()

  const rows = await db
    .select({
      id: conversations.id,
      listingId: conversations.listingId,
      buyerId: conversations.buyerId,
      sellerId: conversations.sellerId,
      lastMessageAt: conversations.lastMessageAt,
      listingTitle: listings.title,
    })
    .from(conversations)
    .leftJoin(listings, eq(listings.id, conversations.listingId))
    .where(or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)))
    .orderBy(desc(conversations.lastMessageAt))

  const otherIds = rows.map((r) => (r.buyerId === userId ? r.sellerId : r.buyerId))
  const others = otherIds.length
    ? await db.select().from(user).where(or(...otherIds.map((id) => eq(user.id, id))))
    : []
  const otherMap = new Map(others.map((o) => [o.id, o]))

  const images = await db.select().from(listingImages).orderBy(listingImages.position)
  const imageMap = new Map<number, string>()
  for (const img of images) {
    if (!imageMap.has(img.listingId)) imageMap.set(img.listingId, img.url)
  }

  return rows.map((r) => {
    const otherId = r.buyerId === userId ? r.sellerId : r.buyerId
    return {
      ...r,
      otherUserId: otherId,
      otherUserName: otherMap.get(otherId)?.name ?? "Pengguna",
      image: imageMap.get(r.listingId) ?? null,
    }
  })
}

export async function getConversation(id: number) {
  const userId = await requireUserId()

  const [conv] = await db
    .select({
      id: conversations.id,
      listingId: conversations.listingId,
      buyerId: conversations.buyerId,
      sellerId: conversations.sellerId,
      listingTitle: listings.title,
    })
    .from(conversations)
    .leftJoin(listings, eq(listings.id, conversations.listingId))
    .where(eq(conversations.id, id))

  if (!conv || (conv.buyerId !== userId && conv.sellerId !== userId)) {
    throw new Error("Tidak ditemukan")
  }

  const otherId = conv.buyerId === userId ? conv.sellerId : conv.buyerId
  const [other] = await db.select().from(user).where(eq(user.id, otherId))

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt)

  await db
    .update(messages)
    .set({ read: true })
    .where(and(eq(messages.conversationId, id), eq(messages.senderId, otherId)))

  return { conv, otherUserName: other?.name ?? "Pengguna", messages: msgs, userId }
}

export async function sendMessage(conversationId: number, body: string) {
  const senderId = await requireUserId()
  if (!body.trim()) return

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, conversationId))
  if (!conv || (conv.buyerId !== senderId && conv.sellerId !== senderId)) {
    throw new Error("Tidak diizinkan")
  }

  await db.insert(messages).values({ conversationId, senderId, body: body.trim() })
  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId))

  const recipientId = conv.buyerId === senderId ? conv.sellerId : conv.buyerId
  await createNotification({
    userId: recipientId,
    type: "new_message",
    title: "Pesan baru",
    body: body.trim().slice(0, 80),
    link: `/messages/${conversationId}`,
  })

  revalidatePath(`/messages/${conversationId}`)
}

export async function getUnreadMessageCount() {
  const userId = await requireUserId().catch(() => null)
  if (!userId) return 0

  const myConvs = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(or(eq(conversations.buyerId, userId), eq(conversations.sellerId, userId)))

  if (!myConvs.length) return 0

  const unread = await db
    .select()
    .from(messages)
    .where(
      and(
        or(...myConvs.map((c) => eq(messages.conversationId, c.id))),
        eq(messages.read, false),
      ),
    )

  return unread.filter((m) => m.senderId !== userId).length
}
