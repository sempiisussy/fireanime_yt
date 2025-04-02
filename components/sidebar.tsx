"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  Compass,
  Search,
  TrendingUp,
  Clock,
  ThumbsUp,
  History,
  Flame,
  Menu,
  Heart,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const isActive = (path: string) => {
    if (path === "/") return pathname === path
    return pathname.startsWith(path)
  }

  const NavItems = () => (
    <>
      <div className="px-2 py-2">
        <div className="space-y-1">
          <Link href="/" passHref>
            <Button variant={isActive("/") ? "secondary" : "ghost"} className="w-full justify-start gap-3" size="sm">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </Link>
          <Link href="/trending" passHref>
            <Button
              variant={isActive("/trending") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </Button>
          </Link>
          <Link href="/new-releases" passHref>
            <Button
              variant={isActive("/new-releases") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <Flame className="h-4 w-4" />
              <span>New Releases</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Discover</div>
        <div className="space-y-1">
          <Link href="/search" passHref>
            <Button
              variant={isActive("/search") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </Link>
          <Link href="/genres" passHref>
            <Button
              variant={isActive("/genres") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <Compass className="h-4 w-4" />
              <span>Genres</span>
            </Button>
          </Link>
          <Link href="/calendar" passHref>
            <Button
              variant={isActive("/calendar") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </Button>
          </Link>
        </div>
      </div>

      {user && (
        <div className="px-3 py-2">
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            My Library
          </div>
          <div className="space-y-1">
            <Link href="/history" passHref>
              <Button
                variant={isActive("/history") ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                size="sm"
              >
                <History className="h-4 w-4" />
                <span>Watch History</span>
              </Button>
            </Link>
            <Link href="/liked" passHref>
              <Button
                variant={isActive("/liked") ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                size="sm"
              >
                <Heart className="h-4 w-4" />
                <span>Liked Episodes</span>
              </Button>
            </Link>
            <Link href="/watchlist" passHref>
              <Button
                variant={isActive("/watchlist") ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                size="sm"
              >
                <List className="h-4 w-4" />
                <span>My Watchlist</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="px-3 py-2">
        <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</div>
        <div className="space-y-1">
          <Link href="/about" passHref>
            <Button
              variant={isActive("/about") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>About Us</span>
            </Button>
          </Link>
          <Link href="/terms" passHref>
            <Button
              variant={isActive("/terms") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <Clock className="h-4 w-4" />
              <span>Terms</span>
            </Button>
          </Link>
          <Link href="/privacy" passHref>
            <Button
              variant={isActive("/privacy") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              size="sm"
            >
              <Clock className="h-4 w-4" />
              <span>Privacy</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="fixed left-4 top-[14px] z-50 lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white">
                <Flame className="h-4 w-4" />
              </div>
              <span>Ani.cx</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-64px)]">
            <NavItems />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden lg:block w-60 shrink-0 border-r h-[calc(100vh-64px)] fixed top-16 left-0 overflow-y-auto">
      <ScrollArea className="h-full py-2">
        <NavItems />
      </ScrollArea>
    </div>
  )
}

