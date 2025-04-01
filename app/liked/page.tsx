"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Play } from "lucide-react"
import { getUserEpisodesLiked, API_BASE_IMG_URL, type UserLikedEpisode } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import AnimePagination from "@/components/pagination-universal"
import { useSearchParams } from "next/navigation"

export default function LikedEpisodesPage() {
  const [likedEpisodes, setLikedEpisodes] = useState<UserLikedEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const currentPage = searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1

  useEffect(() => {
    const fetchLikedEpisodes = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getUserEpisodesLiked(currentPage)
        setLikedEpisodes(response.data)
        setTotalPages(response.pages || 1)
        setLoading(false)
      } catch (err) {
        setError("Failed to load liked episodes")
        setLoading(false)
      }
    }

    fetchLikedEpisodes()
  }, [user, currentPage])

  if (loading) {
    return (
      <div className="w-full lg:pl-60">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Liked Episodes</h1>
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
          <h1 className="text-2xl font-bold mb-6">Liked Episodes</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You need to be logged in to view your liked episodes</p>
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
          <h1 className="text-2xl font-bold mb-6">Liked Episodes</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (likedEpisodes.length === 0) {
    return (
      <div className="w-full lg:pl-60">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Liked Episodes</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">You haven't liked any episodes yet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Liked Episodes</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {likedEpisodes.map((item) => (
            <Link
              key={`${item.anime_id}-${item.season}-${item.episode}`}
              href={`/anime/${item.slug}/${item.season}/${item.episode}`}
              className="group"
            >
              <div className="space-y-2">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={item.poster ? `${API_BASE_IMG_URL}/img/posters/small-${item.poster}.webp` : "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full p-1">
                    <Heart className="h-4 w-4 fill-current" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium line-clamp-1 text-sm">{item.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>
                      Season {item.season}, Episode {item.episode}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AnimePagination currentPage={currentPage} totalPages={totalPages} pathPrefix="/liked" />
      </div>
    </div>
  )
}

