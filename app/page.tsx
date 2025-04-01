import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { getBest, getNewestEpisodes } from "@/lib/api"
import AnimeGrid from "@/components/anime-grid"
import AnimeEpisodeGrid from "@/components/anime-episode-grid"
import LastSeenEpisodes from "@/components/last-seen-episodes"

export const metadata = {
  title: "FireAnime - Home",
  description: "Watch the latest anime episodes and explore new series.",
}

export default async function HomePage() {
  // Fetch data server-side
  const trendingResponse = await getBest(1)
  const newReleasesResponse = await getNewestEpisodes(1)

  const trendingAnime = trendingResponse.data.slice(0, 12)
  const newReleases = newReleasesResponse.data.slice(0, 12)

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
          <AnimeGrid animes={trendingAnime} />
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
          <AnimeEpisodeGrid animes={newReleases} />
        </div>
      </div>
    </div>
  )
}

