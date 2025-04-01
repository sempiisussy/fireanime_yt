"use client"
import { Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { deleteUserAnimeLikedStatus, getUserAnimeLikedStatus, putUserAnimeLikedStatus } from "@/lib/api";
import { useAuth } from "@/lib/auth";



export function EpisodeInteractionButtons({ like_count, dislike_count, slug, season, episode }: { like_count?: number, dislike_count?: number, slug: string, episode: string, season: string }) {

    const [loading, setLoading] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [isDislike, setIsDislike] = useState(false)
    const { user } = useAuth()

    function loadLike() {
        if(!user) return
        setLoading(true)
        getUserAnimeLikedStatus(slug, season, episode)
            .then(data => {
                setIsLike(data.data.is_liked)
                setIsDislike(!data.data.is_liked)
            })
            .catch(err => {
                setIsLike(false)
                setIsDislike(false)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function updateLike() {
        if(!user) return
        setLoading(true)
        if (isLike) {
            // delete
            setIsLike(false)
            deleteUserAnimeLikedStatus(slug, season, episode).finally(loadLike)
            return
        }
        setIsLike(true)
        setIsDislike(false)
        putUserAnimeLikedStatus(slug, season, episode, true).finally(loadLike)
    }

    function updateDislike() {
        if(!user) return
        setLoading(true)
        if (isDislike) {
            // delete
            setIsDislike(false)
            deleteUserAnimeLikedStatus(slug, season, episode).finally(loadLike)
            return
        }
        setIsLike(false)
        setIsDislike(true)
        putUserAnimeLikedStatus(slug, season, episode, false).finally(loadLike)
    }

    useEffect(() => {
        loadLike()
    }, [])

    return (
        <div className="flex items-center gap-2 ml-auto">
            <Button variant={isLike ? "default" : "outline"} size="sm" className="flex items-center gap-1" disabled={loading ||!user} onClick={updateLike}>
                <ThumbsUp className="h-4 w-4" />
                <span>{(like_count || 0) + (isLike ? 1 : 0)}</span>
            </Button>
            <Button variant={isDislike ? "default" : "outline"} size="sm" className="flex items-center gap-1" disabled={loading ||!user} onClick={updateDislike}>
                <ThumbsDown className="h-4 w-4" />
                <span>{(dislike_count || 0) + (isDislike ? 1 : 0)}</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                <Share2 className="h-4 w-4" />
                Share
            </Button>
        </div>
    )
}