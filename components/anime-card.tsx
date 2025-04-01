import Link from "next/link"
import Image from "next/image"
import { API_BASE_IMG_URL, type AnimeSearchItem } from "@/lib/api"

interface AnimeCardProps {
  anime: AnimeSearchItem
  className?: string
}

const AnimeCard = ({ anime, className = "" }: AnimeCardProps) => {
  return (
    <Link href={`/anime/${anime.slug}`} className={`group block ${className}`}>
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
            {anime.vote_avg.toFixed(1)}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-2 text-sm">{anime.title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{anime.start}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard

