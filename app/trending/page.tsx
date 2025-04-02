import { getBest } from "@/lib/api"
import AnimeGrid from "@/components/anime-grid"
import AnimePagination from "@/components/pagination-universal"

export async function generateMetadata() {
  return {
    title: `Trending Animes on Ani.cx - Ani.cx`,
    description: `Browse Trending Animes that are currently loved all over the world.`,
  }
}

export default async function TrendingPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  // Get the current page from the URL query or default to 1
  const currentPage = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  let animes = []
  let totalPages = 1

  try {
    // Pass the current page to your API function
    const response = await getBest(currentPage)
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
        <h1 className="text-2xl font-bold mb-6">Trending Animes</h1>

        <div className="mb-8">
          <AnimeGrid animes={animes} />
        </div>

        {/* Add the pagination component */}
        <AnimePagination currentPage={currentPage} totalPages={totalPages} pathPrefix="/trending" />
      </div>
    </div>
  )
}

