import { getNewestEpisodes } from "@/lib/api"
import AnimeEpisodeGrid from "@/components/anime-episode-grid"

export default async function NewReleasesAnimeGrid() {
  const newReleasesResponse = await getNewestEpisodes(1)
  const newReleases = newReleasesResponse.data.slice(0, 12)

  return <AnimeEpisodeGrid animes={newReleases} />
}