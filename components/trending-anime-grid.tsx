import { getBest } from "@/lib/api"
import AnimeGrid from "@/components/anime-grid"

export default async function TrendingAnimeGrid() {
  const trendingResponse = await getBest(1)
  const trendingAnime = trendingResponse.data.slice(0, 12)

  return <AnimeGrid animes={trendingAnime} />
}