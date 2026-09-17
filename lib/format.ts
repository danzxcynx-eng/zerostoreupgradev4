export function formatPrice(cents: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(cents)
}

export function formatRelativeTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "baru saja"
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} hari lalu`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} bulan lalu`
  return `${Math.floor(months / 12)} tahun lalu`
}

export const CATEGORIES = [
  { value: "mobile-legends", label: "Mobile Legends" },
  { value: "free-fire", label: "Free Fire" },
  { value: "pubg-mobile", label: "PUBG Mobile" },
  { value: "genshin-impact", label: "Genshin Impact" },
  { value: "valorant", label: "Valorant" },
  { value: "clash-of-clans", label: "Clash of Clans" },
  { value: "roblox", label: "Roblox" },
  { value: "other", label: "Lainnya" },
]

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}
