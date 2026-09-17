"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return <div className="aspect-video w-full rounded-xl bg-muted" />
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[active] || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          crossOrigin="anonymous"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2",
                active === i ? "border-primary" : "border-transparent",
              )}
            >
              <Image src={img || "/placeholder.svg"} alt="" fill className="object-cover" crossOrigin="anonymous" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
