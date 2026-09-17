"use server"

import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { requireUserId } from "@/lib/session"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createNotification(input: {
  userId: string
  type: string
  title: string
  body?: string
  link?: string
}) {
  await db.insert(notifications).values(input)
}

export async function getMyNotifications() {
  const userId = await requireUserId()
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
}

export async function getUnreadNotificationCount() {
  const userId = await requireUserId().catch(() => null)
  if (!userId) return 0
  const rows = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))
  return rows.length
}

export async function markNotificationRead(id: number) {
  const userId = await requireUserId()
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
  revalidatePath("/notifications")
}

export async function markAllNotificationsRead() {
  const userId = await requireUserId()
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId))
  revalidatePath("/notifications")
}
