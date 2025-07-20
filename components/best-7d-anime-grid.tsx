import { getBestLast7d } from "@/lib/api"
import AnimeGrid from "@/components/anime-grid"

export default async function Best7dAnimeGrid() {
  const bestLast7dResponse = await getBestLast7d(1)
  const bestLast7d = bestLast7dResponse.data.slice(0, 12)

  return <AnimeGrid animes={bestLast7d} />
}