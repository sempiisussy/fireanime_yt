"use client"
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { HLSSrc, isHLSProvider, MediaErrorDetail, MediaErrorEvent, MediaPlayer, MediaProvider, MediaProviderAdapter, MediaProviderChangeEvent, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { API_BASE_IMG_URL } from '@/lib/api';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
export function Player({ videoSource, title, slug, season, episode }: { videoSource: string, title: string, slug: string, season: string, episode: string }) {
    const { user } = useAuth()

    if (videoSource.startsWith("https://fireani.me")) {
        const urlSplits = videoSource.split("id=")
        if (urlSplits.length != 2) {
            return (
                <div className="w-full h-full absolute left-0 top-0 flex items-center justify-center">
                    <p>Invalid url provided</p>
                </div>
            )
        }

        const videId = urlSplits[1]

        const poster = `https://i.voe.sx/cache/${videId}_storyboard_L2.jpg`

        const playerSource: HLSSrc = {
            src: `${API_BASE_IMG_URL}/proxy/nocache/${videId}/`,
            type: 'application/vnd.apple.mpegurl',
        }

        const thumbnails = `${API_BASE_IMG_URL}/proxy/storyboard/${videId}/thumbnails.vtt`

        const $player = useRef<any>(null)

        async function updatePlayerPosition() {
            if (!user) {
                console.log("not authenticated")
                return
            }

            try {
                const rawTime = localStorage.getItem(`${videId}-currentTime`)
                if (rawTime && parseInt(rawTime) > 0 && $player.current && parseInt(rawTime) < $player.current.currentTime) {
                    console.log("updated player position to local storage")
                    localStorage.setItem(`${videId}-currentTime`, `${$player.current.currentTime}`)
                }
            } catch (err) {
                console.log("failed to save player position to local storage", err)
            }

            try {
                const positionSeconds = Math.round($player.current?.currentTime ?? 0)
                const positionMax = Math.round($player.current?.duration ?? 0)
                const positionPercent = Math.round(100 / positionMax * positionSeconds)
                await fetch(`${API_BASE_IMG_URL}/api/anime/episode/lastseen`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        slug: slug,
                        season: season,
                        episode: episode,

                        positionPercent: positionPercent,
                        positionSeconds: positionSeconds,
                        positionMax: positionMax,
                    }),
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        "Content-Type": "application/json",
                    }
                })
                console.log("updated player position")
            }
            catch (error: any) {
                console.log("failed to update player position", error)
                return
            }
        }


        function onProviderChange(detail: MediaProviderAdapter | null, e: MediaProviderChangeEvent) {
            if (isHLSProvider(e.target.provider)) {
                console.log("HLS Provider", e.target.provider)
                e.target.provider.config.fragLoadPolicy = {
                    default: {
                        maxTimeToFirstByteMs: 9_000,
                        maxLoadTimeMs: 100_000,
                        timeoutRetry: {
                            maxNumRetry: 5,
                            retryDelayMs: 3000,
                            maxRetryDelayMs: 15000,
                        },
                        errorRetry: {
                            maxNumRetry: 5,
                            retryDelayMs: 3000,
                            maxRetryDelayMs: 15000,
                            backoff: 'exponential',
                        },
                    },
                }

                e.target.provider.config.xhrSetup = xhr => {
                    // xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            } else {
                console.log("Not HLS Provider", e.target.provider)
            }
        }

        function onMediaPlayerError(detail: MediaErrorDetail, e: MediaErrorEvent) {
            try {
                e.target.pause()
                e.target.exitFullscreen()
            } catch (error) {
                console.log("fullscreen exit error", detail.error)
            }
        }

        function initPlayerPosition() {
            const rawTime = localStorage.getItem(`${videId}-currentTime`)
            if (rawTime && parseInt(rawTime) > 0 && $player.current) {
                console.log("init player position", rawTime)
                $player.current.currentTime = parseInt(rawTime)
            }
        }



        useEffect(() => {
            initPlayerPosition()
            const intv = setInterval(() => {
                updatePlayerPosition()
            }, 10 * 1000)
            return () => {
                clearInterval(intv)
            }
        }, [])

        return (
            <div className="w-full h-full absolute left-0 top-0">
                <MediaPlayer title={title} load="idle" src={playerSource} playsInline autoPlay ref={$player} onProviderChange={onProviderChange} onError={onMediaPlayerError} storage="vidstacksettings">
                    <MediaProvider>
                        <Poster
                            className="vds-poster"
                            src={poster}
                            alt={`Image of ${title}`}
                        />
                    </MediaProvider>
                    <DefaultVideoLayout thumbnails={thumbnails} seekStep={10} hideQualityBitrate={true} icons={defaultLayoutIcons} />
                </MediaPlayer>
            </div>
        )
    }

    return (
        <iframe
            src={videoSource}
            className="w-full h-full absolute left-0 top-0"
            allowFullScreen
            title={title}
        ></iframe>
    )
}