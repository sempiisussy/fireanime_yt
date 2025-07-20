"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type EpisodeDetails, type AnimeDetails, getEpisode, getAnimeDetails, API_BASE_IMG_URL } from "@/lib/api"
import { EpisodeInteractionButtons } from "@/components/episode-interaction-buttons"
import { Player } from "@/components/player"

export const metadata: Metadata = {
  robots: "noindex, nofollow",
}

export default function EpisodePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const season = params.season as string
  const episode = params.episode as string

  const [episodeData, setEpisodeData] = useState<EpisodeDetails | null>(null)
  const [animeData, setAnimeData] = useState<AnimeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingEpisode, setLoadingEpisode] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [episodeError, setEpisodeError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ger_sub")
  const [videoSource, setVideoSource] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !season || !episode) return

      try {
        setLoading(true)
        setLoadingEpisode(true)

        getEpisode(slug, season, episode)
          .then((episodeResponse) => {
            setEpisodeData(episodeResponse.data)
            // Set default language based on availability
            if (episodeResponse.data.has_ger_sub) {
              setSelectedLanguage("ger-sub")
            } else if (episodeResponse.data.has_eng_sub) {
              setSelectedLanguage("eng-sub")
            } else if (episodeResponse.data.has_ger_dub) {
              setSelectedLanguage("ger-dub")
            }
            const ger_sub_link = episodeResponse.data.anime_episode_links.filter((l) => l.lang == "ger-sub").at(0)?.link
            const ger_dub_link = episodeResponse.data.anime_episode_links.filter((l) => l.lang == "ger-dub").at(0)?.link
            const eng_sub_link = episodeResponse.data.anime_episode_links.filter((l) => l.lang == "eng-sub").at(0)?.link
            if (ger_sub_link) {
              setVideoSource(ger_sub_link)
            } else if (ger_dub_link) {
              setVideoSource(ger_dub_link)
            } else if (eng_sub_link) {
              setVideoSource(eng_sub_link)
            }
          })
          .catch((error) => {
            setEpisodeError(error)
          })
          .finally(() => {
            setLoadingEpisode(false)
          })
        const [animeResponse] = await Promise.all([getAnimeDetails(slug)])

        setAnimeData(animeResponse.data)

        setLoading(false)
      } catch (err) {
        setError("Failed to load episode")
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, season, episode])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center lg:pl-60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error || !animeData) {
    return (
      <div className="container py-12 text-center lg:pl-60">
        <p className="text-muted-foreground">{error || "Episode not found"}</p>
      </div>
    )
  }

  // Find current episode index and determine prev/next episodes
  const currentSeason = animeData.anime_seasons.find((s) => s.season === season)
  const currentEpisodeIndex = currentSeason?.anime_episodes.findIndex((e) => e.episode === episode) ?? -1

  const prevEpisode = currentEpisodeIndex > 0 ? currentSeason?.anime_episodes[currentEpisodeIndex - 1] : null

  const nextEpisode =
    currentEpisodeIndex < (currentSeason?.anime_episodes.length ?? 0) - 1
      ? currentSeason?.anime_episodes[currentEpisodeIndex + 1]
      : null

  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <div className="mb-4">
          <Link href={`/anime/${slug}`} className="text-muted-foreground hover:text-primary">
            &larr; Back to {animeData.title}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="w-full bg-black rounded-lg overflow-hidden mb-4">
              {videoSource ? (
                <div className="aspect-video relative">
                  <Player videoSource={videoSource} title={`${animeData.title} S${season}E${episode}`} slug={slug} season={season} episode={episode} />
                </div>
              ) : loadingEpisode ? (
                <div className="aspect-video flex items-center justify-center bg-muted">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Video source not available</p>
                </div>
              )}
            </div>

            <h1 className="text-xl font-bold mb-2">
              {animeData.title} - Season {season}, Episode {episode}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                {episodeData && (
                  <>
                    <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-full max-w-md">
                      <TabsList>
                        {episodeData.has_ger_sub && <TabsTrigger value="ger-sub">German Sub</TabsTrigger>}
                        {episodeData.has_ger_dub && <TabsTrigger value="ger-dub">German Dub</TabsTrigger>}
                        {episodeData.has_eng_sub && <TabsTrigger value="eng-sub">English Sub</TabsTrigger>}
                      </TabsList>
                    </Tabs>
                    <Tabs value={videoSource || ""} onValueChange={setVideoSource} className="w-full max-w-md">
                      <TabsList>
                        {episodeData.anime_episode_links
                          .filter((l) => l.lang == selectedLanguage)
                          .map((link) => (
                            <TabsTrigger key={link.id} value={link.link}>
                              {link.name}
                            </TabsTrigger>
                          ))}
                      </TabsList>
                    </Tabs>
                  </>
                )}
              </div>

              <EpisodeInteractionButtons like_count={episodeData?.like_count} dislike_count={episodeData?.dislike_count} slug={slug} season={season} episode={episode} />
            </div>

            <div className="flex justify-between mb-8">
              {prevEpisode ? (
                <Button variant="outline" asChild>
                  <Link href={`/anime/${slug}/${season}/${prevEpisode.episode}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous Episode
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Episode
                </Button>
              )}

              {nextEpisode ? (
                <Button className="bg-red-600 hover:bg-red-700" asChild>
                  <Link href={`/anime/${slug}/${season}/${nextEpisode.episode}`}>
                    Next Episode <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button disabled>
                  Next Episode <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Up Next</h2>
            <div className="space-y-4">
              {currentSeason?.anime_episodes.slice(0, 10).map((ep) => (
                <Link
                  key={ep.id}
                  href={`/anime/${slug}/${season}/${ep.episode}`}
                  className={`flex items-start gap-3 p-2 rounded-lg ${ep.episode === episode ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        ep.image
                          ? `${API_BASE_IMG_URL}/img/thumbs/${ep.image}`
                          : `${API_BASE_IMG_URL}/img/posters/small-${animeData.backdrop}.webp`
                      }
                      alt={`Episode ${ep.episode}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {ep.episode === episode && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-xs font-medium text-white">Now Playing</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-2">Episode {ep.episode}</p>
                    <p className="text-xs text-muted-foreground">{ep.view_count.toLocaleString()} views</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold mb-4">Seasons</h2>
              <div className="space-y-2">
                {animeData.anime_seasons.map((s) => (
                  <Link
                    key={s.id}
                    href={`/anime/${slug}/${s.season}/1`}
                    className={`block p-3 rounded-lg ${s.season === season ? "bg-muted" : "hover:bg-muted/50"}`}
                  >
                    Season {s.season} ({s.anime_episodes.length} episodes)
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

