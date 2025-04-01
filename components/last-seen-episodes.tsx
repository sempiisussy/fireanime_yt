"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, Play } from "lucide-react"
import { getUserLastSeen, API_BASE_IMG_URL, type UserLastSeen } from "@/lib/api"
import { useAuth } from "@/lib/auth"

export default function LastSeenEpisodes() {
  const [lastSeen, setLastSeen] = useState<UserLastSeen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchLastSeen = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getUserLastSeen()
        setLastSeen(response.data.slice(0, 8)) // Only show the last 8 episodes on homepage
        setLoading(false)
      } catch (err) {
        setError("Failed to load last seen episodes")
        setLoading(false)
      }
    }

    fetchLastSeen()
  }, [user])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="w-full py-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (lastSeen.length === 0) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-muted-foreground">No watch history yet</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Continue Watching</h2>
        <Button variant="ghost" asChild>
          <Link href="/history" className="flex items-center text-sm">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lastSeen.map((item) => (
          <Link
            key={`${item.anime_id}-${item.season}-${item.episode}`}
            href={`/anime/${item.anime.slug}/${item.season}/${item.episode}`}
            className="group"
          >
            <div className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={
                    item.anime.poster
                      ? `${API_BASE_IMG_URL}/img/posters/small-${item.anime.poster}.webp`
                      : "/placeholder.svg"
                  }
                  alt={item.anime.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
                {item.position > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${item.position}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium line-clamp-1 text-sm">{item.anime.title}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    S{item.season} E{item.episode}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

