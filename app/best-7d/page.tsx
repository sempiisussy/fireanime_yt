import { getBestLast7d } from "@/lib/api"
import AnimeGrid from "@/components/anime-grid"
import AnimePagination from "@/components/pagination-universal"

export async function generateMetadata() {
  return {
    title: `Best Animes of the Last 7 Days - Ani.cx`,
    description: `Browse the best animes of the last 7 days.`,
  }
}

export default async function Best7dPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  // Get the current page from the URL query or default to 1
  const currentPage = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  let animes = []
  let totalPages = 1

  try {
    // Pass the current page to your API function
    const response = await getBestLast7d(currentPage)
    animes = response.data

    // Assuming your API returns total pages information
    totalPages = response.pages || 1
  } catch (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Failed to load animes</p>
      </div>
    )
  }

  if (animes.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">No animes available</p>
      </div>
    )
  }

  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Best Animes of the Last 7 Days</h1>

        <div className="mb-8">
          <AnimeGrid animes={animes} />
        </div>

        {/* Add the pagination component */}
        <AnimePagination currentPage={currentPage} totalPages={totalPages} pathPrefix="/best-7d" />
      </div>
    </div>
  )
}
