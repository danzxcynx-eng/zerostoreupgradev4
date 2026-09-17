import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireUserId() {
  const session = await getCurrentSession()
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function requireAdmin() {
  const session = await getCurrentSession()
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Forbidden")
  }
  return session.user.id
}
