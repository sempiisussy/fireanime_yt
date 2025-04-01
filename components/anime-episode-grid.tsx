import type { NewestAnimeEpisode } from "@/lib/api"
import AnimeEpisodeCard from "./anime-episode-card"

interface AnimeEpisodeGridProps {
  animes: NewestAnimeEpisode[]
  title?: string
  className?: string
}

const AnimeEpisodeGrid = ({ animes, title, className = "" }: AnimeEpisodeGridProps) => {
  if (animes.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-muted-foreground">No anime found</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {animes.map((anime) => (
          <AnimeEpisodeCard key={anime.episode_id} anime={anime} />
        ))}
      </div>
    </div>
  )
}

export default AnimeEpisodeGrid

