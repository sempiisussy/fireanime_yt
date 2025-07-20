import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import LastSeenEpisodes from "@/components/last-seen-episodes"
import { Suspense } from "react"
import AnimeGridSkeleton from "@/components/anime-grid-skeleton"
import TrendingAnimeGrid from "@/components/trending-anime-grid"
import Best24hAnimeGrid from "@/components/best-24h-anime-grid"
import Best7dAnimeGrid from "@/components/best-7d-anime-grid"
import NewReleasesAnimeGrid from "@/components/new-releases-anime-grid"
import AnimeEpisodeGridSkeleton from "@/components/anime-episode-grid-skeleton"

export const metadata = {
  title: "Ani.cx - Home",
  description: "Watch the latest anime episodes and explore new series.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col w-full lg:pl-60">
      <div className="container py-6">
        <LastSeenEpisodes />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Trending Now</h2>
            <Button variant="ghost" asChild>
              <Link href="/trending" className="flex items-center text-sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<AnimeGridSkeleton />}>
            <TrendingAnimeGrid />
          </Suspense>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Best of the Last 24 Hours</h2>
            <Button variant="ghost" asChild>
              <Link href="/best-24h" className="flex items-center text-sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<AnimeGridSkeleton />}>
            <Best24hAnimeGrid />
          </Suspense>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Best of the Last 7 Days</h2>
            <Button variant="ghost" asChild>
              <Link href="/best-7d" className="flex items-center text-sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<AnimeGridSkeleton />}>
            <Best7dAnimeGrid />
          </Suspense>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">New Releases</h2>
            <Button variant="ghost" asChild>
              <Link href="/new-releases" className="flex items-center text-sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Suspense fallback={<AnimeEpisodeGridSkeleton />}>
            <NewReleasesAnimeGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

