import Link from "next/link"
import Image from "next/image"
import type { NewestAnimeEpisode } from "@/lib/api"
import { API_BASE_IMG_URL } from "@/lib/api"

interface AnimeEpisodeCardProps {
  anime: NewestAnimeEpisode
  className?: string
}

const AnimeEpisodeCard = ({ anime, className = "" }: AnimeEpisodeCardProps) => {
  return (
    <Link href={`/anime/${anime.slug}/${anime.season}/${anime.episode}`} className={`group block ${className}`}>
      <div className="space-y-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={anime.poster ? `${API_BASE_IMG_URL}/img/posters/small-${anime.poster}.webp` : "/placeholder.svg"}
            alt={anime.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            S{anime.season} E{anime.episode}
          </div>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-2 text-sm">{anime.title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {anime.has_ger_sub ? "GER-SUB" : ""}
              {anime.has_ger_sub && anime.has_ger_dub ? " • " : ""}
              {anime.has_ger_dub ? "GER-DUB" : ""}
              {(anime.has_ger_sub || anime.has_ger_dub) && anime.has_eng_sub ? " • " : ""}
              {anime.has_eng_sub ? "ENG-SUB" : ""}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AnimeEpisodeCard

