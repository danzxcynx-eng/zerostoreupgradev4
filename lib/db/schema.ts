import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  doublePrecision,
  primaryKey,
} from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.
// Includes the admin plugin fields (role, banned, banReason, banExpires).

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  role: text("role").notNull().default("user"),
  banned: boolean("banned"),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables --------------------------------------------------------

export const GAME_CATEGORIES = [
  "Free Fire",
  "Mobile Legends",
  "PUBG Mobile",
  "Valorant",
  "Roblox",
  "Genshin Impact",
  "Lainnya",
] as const

export const LISTING_STATUS = [
  "pending",
  "active",
  "rejected",
  "sold",
  "removed",
] as const

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  sellerId: text("sellerId").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  rank: text("rank"),
  level: integer("level").default(0),
  skins: integer("skins").default(0),
  contactWa: text("contactWa").notNull(),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejectionReason"),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const listingImages = pgTable("listing_images", {
  id: serial("id").primaryKey(),
  listingId: integer("listingId").notNull(),
  url: text("url").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const favorites = pgTable(
  "favorites",
  {
    userId: text("userId").notNull(),
    listingId: integer("listingId").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.listingId] })],
)

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  sellerId: text("sellerId").notNull(),
  reviewerId: text("reviewerId").notNull(),
  listingId: integer("listingId"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const NOTIFICATION_TYPES = [
  "listing_approved",
  "listing_rejected",
  "listing_sold",
  "new_review",
  "new_message",
  "favorite_price_drop",
  "system",
] as const

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  link: text("link"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  listingId: integer("listingId").notNull(),
  buyerId: text("buyerId").notNull(),
  sellerId: text("sellerId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  lastMessageAt: timestamp("lastMessageAt").notNull().defaultNow(),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  senderId: text("senderId").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
