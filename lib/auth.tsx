"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { postUserLogin } from "./api"
import { useRouter } from "next/navigation"

type User = {
  isAdmin: boolean
  token: string
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("fireAnimeToken")
    const isAdmin = localStorage.getItem("fireAnimeIsAdmin") === "true"

    if (token) {
      setUser({
        token,
        isAdmin,
      })
    }

    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await postUserLogin(username, password)

      if (response.status === 200 && response.data) {
        const userData = {
          token: response.data.token,
          isAdmin: response.data.is_admin,
        }

        // Save to localStorage
        localStorage.setItem("fireAnimeToken", userData.token)
        localStorage.setItem("fireAnimeIsAdmin", String(userData.isAdmin))

        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("fireAnimeToken")
    localStorage.removeItem("fireAnimeIsAdmin")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper to get auth headers for API calls
export function getAuthHeaders() {
  const token = localStorage.getItem("fireAnimeToken")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

