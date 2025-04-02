"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bell, User, Flame, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 lg:w-60">
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                <Flame className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Ani.cx</span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto relative">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search anime..."
              className="w-full pl-4 pr-10 py-2 rounded-full border-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/history">Watch History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/liked">Liked Episodes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/watchlist">My Watchlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar

