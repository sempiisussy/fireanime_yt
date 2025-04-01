"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { getUserAnimeWatchStatuses, API_BASE_IMG_URL, type UserAnimeWatchStatuse } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import AnimePagination from "@/components/pagination-universal"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, Play } from "lucide-react"

type WatchStatus = "watching" | "plan_to_watch" | "rewatching" | "completed" | "paused" | "dropped"

const statusLabels: Record<WatchStatus, string> = {
  watching: "Watching",
  plan_to_watch: "Plan to Watch",
  rewatching: "Rewatching",
  completed: "Completed",
  paused: "Paused",
  dropped: "Dropped",
}

export default function WatchlistPage() {
  const [animes, setAnimes] = useState<UserAnimeWatchStatuse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const searchParams = useSearchParams()
  const currentPage = searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1
  const statusParam = searchParams.get("status") as WatchStatus | null
  const status: WatchStatus = statusParam || "watching"

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getUserAnimeWatchStatuses(status, currentPage)
        setAnimes(response.data)
        setTotalPages(response.pages || 1)
        setLoading(false)
      } catch (err) {
        setError("Failed to load watchlist")
        setLoading(false)
      }
    }

    fetchWatchlist()
  }, [user, currentPage, status])

  if (loading) {
    return (
      <div className="w-full lg:pl-60">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">My Watchlist</h1>
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
          <h1 className="text-2xl font-bold mb-6">My Watchlist</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You need to be logged in to view your watchlist</p>
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

  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">My Watchlist</h1>

        <Tabs value={status} className="mb-6">
          <TabsList className="w-full flex flex-wrap h-auto">
            {(Object.keys(statusLabels) as WatchStatus[]).map((statusKey) => (
              <TabsTrigger key={statusKey} value={statusKey} asChild className="flex-1">
                <Link href={`/watchlist?status=${statusKey}`}>{statusLabels[statusKey]}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : animes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No anime in this category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {animes.map((anime) => (
                <Link key={anime.anime_id} href={`/anime/${anime.slug}`} className="group">
                  <div className="space-y-2">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={
                          anime.poster
                            ? `${API_BASE_IMG_URL}/img/posters/small-${anime.poster}.webp`
                            : "/placeholder.svg"
                        }
                        alt={anime.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium line-clamp-2 text-sm">{anime.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{anime.start}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          <span>{status === "completed" ? "Completed" : statusLabels[status]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <AnimePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pathPrefix={`/watchlist?status=${status}`}
            />
          </>
        )}
      </div>
    </div>
  )
}

