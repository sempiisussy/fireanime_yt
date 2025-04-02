import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Calendar, Play, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { API_BASE_IMG_URL, getAnimeDetails } from "@/lib/api"
import { SelectWatchStatus } from "@/components/select-watch-status"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const response = await getAnimeDetails(params.slug)
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

export default async function AnimePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  let anime

  try {
    const response = await getAnimeDetails(params.slug)
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
                src={anime.poster ? `${API_BASE_IMG_URL}/img/posters/small-${anime.poster}.webp` : "/placeholder.svg"}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{anime.vote_avg.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({anime.vote_count} votes)</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  {anime.start}
                  {anime.end ? ` - ${anime.end}` : ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.generes.map((genre) => (
                  <Badge key={genre} variant="secondary" className="rounded-full">
                    {genre}
                  </Badge>
                ))}
              </div>

              {anime.anime_seasons.length > 0 && anime.anime_seasons[0].anime_episodes.length > 0 && (
                <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                  <Link href={`/anime/${anime.slug}/1/1`}>
                    <Play className="mr-2 h-5 w-5" /> Watch Now
                  </Link>
                </Button>
              )}

              <SelectWatchStatus animeId={anime.id} />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{anime.title}</h1>

            <Tabs defaultValue="episodes" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="episodes">Episodes</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="episodes" className="space-y-6">
                {anime.anime_seasons.map((season) => (
                  <div key={season.id} className="space-y-4">
                    <h3 className="text-lg font-bold">Season {season.season}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {season.anime_episodes.map((episode) => (
                        <Link
                          key={episode.id}
                          href={`/anime/${anime.slug}/${season.season}/${episode.episode}`}
                          className="group"
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <Image
                              src={
                                episode.image
                                  ? `${API_BASE_IMG_URL}/img/thumbs/${episode.image}`
                                  : `${API_BASE_IMG_URL}/img/posters/small-${anime.backdrop}.webp`
                              }
                              alt={`Episode ${episode.episode}`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center">
                                <Play className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h4 className="font-medium text-sm">Episode {episode.episode}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{episode.view_count.toLocaleString()} views</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground">{anime.desc}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2">Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Title</p>
                        <p className="text-muted-foreground">{anime.title}</p>
                      </div>
                      {anime.alternate_titles && (
                        <div>
                          <p className="text-sm font-medium">Alternative Titles</p>
                          <p className="text-muted-foreground">{anime.alternate_titles}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">Release Year</p>
                        <p className="text-muted-foreground">{anime.start}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-muted-foreground">{anime.end ? "Completed" : "Ongoing"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Genres</p>
                        <p className="text-muted-foreground">{anime.generes.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

