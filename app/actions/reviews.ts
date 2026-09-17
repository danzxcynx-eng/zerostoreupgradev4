"use server"

import { db } from "@/lib/db"
import { reviews } from "@/lib/db/schema"
import { requireUserId } from "@/lib/session"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function submitReview(input: {
  sellerId: string
  listingId?: number
  rating: number
  comment?: string
}) {
  const reviewerId = await requireUserId()

  if (reviewerId === input.sellerId) {
    throw new Error("Tidak bisa mengulas diri sendiri")
  }
  if (input.rating < 1 || input.rating > 5) {
    throw new Error("Rating harus 1-5")
  }

  const [existing] = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.sellerId, input.sellerId), eq(reviews.reviewerId, reviewerId)))

  if (existing) {
    await db
      .update(reviews)
      .set({ rating: input.rating, comment: input.comment?.trim() || null })
      .where(eq(reviews.id, existing.id))
  } else {
    await db.insert(reviews).values({
      sellerId: input.sellerId,
      reviewerId,
      listingId: input.listingId,
      rating: input.rating,
      comment: input.comment?.trim() || null,
    })

    await createNotification({
      userId: input.sellerId,
      type: "new_review",
      title: "Ulasan baru diterima",
      body: `Kamu mendapat ulasan bintang ${input.rating}`,
      link: `/profile/${input.sellerId}`,
    })
  }

  revalidatePath(`/profile/${input.sellerId}`)
}
