import { getBestLast24h } from "@/lib/api"
import AnimeGrid from "@/components/anime-grid"

export default async function Best24hAnimeGrid() {
  const bestLast24hResponse = await getBestLast24h(1)
  const bestLast24h = bestLast24hResponse.data.slice(0, 12)

  return <AnimeGrid animes={bestLast24h} />
}