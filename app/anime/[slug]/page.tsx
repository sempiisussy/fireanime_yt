import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { API_BASE_IMG_URL, getAnimeDetails } from "@/lib/api"
import { SelectWatchStatus } from "@/components/select-watch-status"
import { AnimeEpisodesBrowser } from "@/components/anime-episodes-browser"

export async function generateMetadata(props: { params: { slug: string } }) {
  const { slug } = await props.params

  try {
    const response = await getAnimeDetails(slug)
    const anime = response.data

    return {
      title: `${anime.title} - Ani.cx`,
      description: anime.desc.substring(0, 160),
    }
  } catch (error) {
    return {
      title: "Anime - Ani.cx",
      description: "View anime details and episodes",
    }
  }
}

export default async function AnimePage(props: { params: { slug: string } }) {
  const { slug } = await props.params

  let anime

  try {
    const response = await getAnimeDetails(slug)
    anime = response.data
  } catch (error) {
    notFound()
  }

  return (
    <div className="flex flex-col w-full lg:pl-60">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[300px] shrink-0">
            <div className="aspect-video md:aspect-[2/3] relative rounded-lg overflow-hidden">
              <Image
                src={
                  anime.poster
                    ? `${API_BASE_IMG_URL}/img/posters/small-${anime.poster}.webp`
                    : "/placeholder.svg"
                }
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">
                  {anime.vote_avg.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({anime.vote_count} votes)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  {anime.start}
                  {anime.end ? ` - ${anime.end}` : ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.generes.map((genre: any) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              {anime.anime_seasons.length > 0 &&
                anime.anime_seasons[0].anime_episodes.length > 0 && (
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    asChild
                  >
                    <Link href={`/anime/${anime.slug}/1/1`}>
                      <Play className="mr-2 h-5 w-5" /> Watch Now
                    </Link>
                  </Button>
                )}

              <SelectWatchStatus animeId={anime.id} />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {anime.title}
            </h1>

            <AnimeEpisodesBrowser anime={anime} />
          </div>
        </div>
      </div>
    </div>
  )
}

