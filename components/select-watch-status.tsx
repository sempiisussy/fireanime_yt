"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { deleteUserAnimeWatchStatus, getUserAnimeWatchStatus, putUserAnimeWatchStatus, WatchStatus } from "@/lib/api"
import { Button } from "./ui/button"
import { useAuth } from "@/lib/auth"

const statuses = ["watching", "plan_to_watch", "rewatching", "completed", "paused", "dropped"]

export function SelectWatchStatus({ animeId }: { animeId: number }) {
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<WatchStatus | null>(null)
    const { user } = useAuth()

    function handleSelection(data: string) {
        if (statuses.includes(data)) {
            setSelected(data as WatchStatus)

            setLoading(true)
            putUserAnimeWatchStatus(animeId, data as WatchStatus)
                .catch(err => {
                    console.log(err)
                })
                .finally(loadStatus)
        }

        if (data == "delete") {
            setSelected(null)

            setLoading(true)
            deleteUserAnimeWatchStatus(animeId)
                .catch(err => {
                    console.log(err)
                })
                .finally(loadStatus)
        }
    }

    function loadStatus() {
        if(!user)return
        setLoading(true)
        getUserAnimeWatchStatus(animeId)
            .then(data => {
                setSelected(data.data.status as WatchStatus)
            })
            .catch(err => {
                setSelected(null)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        loadStatus()
    }, [])

    return (
        <Select onValueChange={handleSelection} value={selected ?? ""} disabled={loading || !user}>
            <SelectTrigger>
                {loading
                    ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                    : <SelectValue placeholder="Add to Watchlist" />
                }
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="plan_to_watch">Plan to watch</SelectItem>
                <SelectItem value="rewatching">Rewatching</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
                {selected && <SelectItem value="delete" className=" text-red-600">Delete</SelectItem>}
            </SelectContent>
        </Select>
    )
}