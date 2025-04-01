import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-4 text-xs">
      <div className="container flex flex-col items-center justify-center gap-2">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/genres" className="text-muted-foreground hover:text-foreground">
            Genres
          </Link>
          <Link href="/calendar" className="text-muted-foreground hover:text-foreground">
            Calendar
          </Link>
        </div>
        <p className="text-center text-muted-foreground">
          © {new Date().getFullYear()} FireAnime. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer

