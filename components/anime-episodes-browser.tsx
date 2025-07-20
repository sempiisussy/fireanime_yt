"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Play, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AnimeDetails, API_BASE_IMG_URL } from "@/lib/api"

export function AnimeEpisodesBrowser({ anime }: { anime: AnimeDetails }) {
  const [selectedSeason, setSelectedSeason] = useState(
    anime.anime_seasons.length > 0 ? anime.anime_seasons[0].season : null
  )
  const [episodeNumber, setEpisodeNumber] = useState("")
  const router = useRouter()

  const handleGoToEpisode = () => {
    if (selectedSeason && episodeNumber) {
      router.push(`/anime/${anime.slug}/${selectedSeason}/${episodeNumber}`)
    }
  }

  const currentSeason = anime.anime_seasons.find(
    (s) => s.season === selectedSeason
  )

  return (
    <Tabs defaultValue="episodes" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="episodes">Episodes</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="episodes" className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          {anime.anime_seasons.length > 0 ? (
            <>
              <Select
                value={selectedSeason?.toString()}
                onValueChange={(value) => setSelectedSeason(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {anime.anime_seasons.map((season) => (
                    <SelectItem key={season.id} value={season.season}>
                      Season {season.season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Episode number"
                className="w-[180px]"
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(e.target.value)}
              />
              <Button onClick={handleGoToEpisode}>Go</Button>
            </>
          ) : (
            <p className="text-muted-foreground">No seasons available.</p>
          )}
        </div>

        {currentSeason && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Season {currentSeason.season}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentSeason.anime_episodes.length > 0 ?
                <>
                  {currentSeason.anime_episodes.map((episode) => (
                    <Link
                      key={episode.id}
                      href={`/anime/${anime.slug}/${currentSeason.season}/${episode.episode}`}
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
                        <h4 className="font-medium text-sm">
                          Episode {episode.episode}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{episode.view_count.toLocaleString()} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
                : <>
                  <p className="text-muted-foreground">No seasons available.</p>
                </>}


            </div>
          </div>
        )}

        {/* <p className="text-muted-foreground">
          Invalid Selection: <br />
          currentSeason: {currentSeason ? JSON.stringify(currentSeason) : currentSeason}
          selectedSeason: {selectedSeason}
        </p> */}
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
                  <p className="text-muted-foreground">
                    {anime.alternate_titles}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Release Year</p>
                <p className="text-muted-foreground">{anime.start}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-muted-foreground">
                  {anime.end ? "Completed" : "Ongoing"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Genres</p>
                <p className="text-muted-foreground">
                  {anime.generes.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}