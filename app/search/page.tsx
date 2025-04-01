import { Suspense } from "react"
import { SearchResults } from "@/components/search-results"
import { SearchForm } from "@/components/search-form"

export const metadata = {
  title: "Search Anime - FireAnime",
  description: "Search for your favorite anime series and episodes.",
}

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ""

  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Search Anime</h1>

        <SearchForm initialQuery={query} />

        {query && (
          <Suspense
            fallback={
              <div className="w-full py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            }
          >
            <SearchResults query={query} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

