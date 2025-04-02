import Link from "next/link"
import Image from "next/image"
import { API_BASE_IMG_URL, getCalendar } from "@/lib/api"
import { Calendar, Clock } from "lucide-react"

export const metadata = {
  title: "Anime Calendar - Ani.cx",
  description: "View the latest anime release schedule and upcoming episodes.",
}

export default async function CalendarPage() {
  let calendarItems = []

  try {
    const response = await getCalendar()
    calendarItems = response.data
  } catch (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Failed to load calendar data</p>
      </div>
    )
  }

  if (calendarItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">No calendar data available</p>
      </div>
    )
  }

  // Group calendar items by date
  const groupedByDate = calendarItems.reduce(
    (acc, item) => {
      const date = item.date_string
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    },
    {} as Record<string, typeof calendarItems>,
  )

  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Anime Release Calendar</h1>

        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-bold">{date}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-20 h-12 rounded overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={
                        item.anime.poster
                          ? `${API_BASE_IMG_URL}/img/posters/small-${item.anime.poster}.webp`
                          : "/placeholder.svg"
                      }
                      alt={item.anime.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Link href={`/anime/${item.anime.slug}`} className="font-medium text-sm hover:text-red-600">
                      {item.anime.title}
                    </Link>

                    <p className="text-xs text-muted-foreground mt-1">
                      Season {item.season}, Episode {item.episode}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{item.time_details}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted">
                        {(() => {
                          switch (item.lang) {
                            case "ger-sub":
                              return "GER-SUB"
                            case "ger-dub":
                              return "GER-DUB"
                            case "eng-sub":
                              return "ENG-SUB"
                            default:
                              return ""
                          }
                        })()}
                      </span>

                      {item.episode_is_available && (
                        <Link
                          href={`/anime/${item.anime.slug}/${item.season}/${item.episode}`}
                          className="text-xs text-red-600 hover:underline ml-auto"
                        >
                          Watch Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

