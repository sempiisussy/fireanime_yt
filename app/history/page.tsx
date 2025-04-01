"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Play } from "lucide-react"
import { getUserLastSeen, API_BASE_IMG_URL, type UserLastSeen } from "@/lib/api"
import { useAuth } from "@/lib/auth"

export default function HistoryPage() {
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
        setLastSeen(response.data) // Show all last seen episodes
        setLoading(false)
      } catch (err) {
        setError("Failed to load watch history")
        setLoading(false)
      }
    }

    fetchLastSeen()
  }, [user])

  if (loading) {
    return (
      <div className="w-full lg:pl-60">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Watch History</h1>
          <div className="w-full py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full lg:pl-60">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Watch History</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You need to be logged in to view your watch history</p>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full lg:pl-60">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Watch History</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (lastSeen.length === 0) {
    return (
      <div className="w-full lg:pl-60">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Watch History</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your watch history is empty</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Watch History</h1>

        <div className="grid grid-cols-1 gap-4">
          {lastSeen.map((item) => (
            <Link
              key={`${item.anime_id}-${item.season}-${item.episode}`}
              href={`/anime/${item.anime.slug}/${item.season}/${item.episode}`}
              className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="relative w-40 h-24 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={
                    item.anime.poster
                      ? `${API_BASE_IMG_URL}/img/posters/small-${item.anime.poster}.webp`
                      : "/placeholder.svg"
                  }
                  alt={item.anime.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="h-10 w-10 rounded-full bg-black/70 flex items-center justify-center">
                    <Play className="h-5 w-5 text-white" />
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

              <div className="flex flex-col justify-center">
                <h3 className="font-medium text-base">{item.anime.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Season {item.season}, Episode {item.episode}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

