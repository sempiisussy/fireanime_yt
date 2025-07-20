import { Skeleton } from "@/components/ui/skeleton"

interface AnimeGridSkeletonProps {
  className?: string
}

const AnimeGridSkeleton = ({ className = "" }: AnimeGridSkeletonProps) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${className}`}>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="block">
          <div className="space-y-2">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnimeGridSkeleton