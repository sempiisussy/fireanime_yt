"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Flame, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"
import Turnstile, { useTurnstile } from "react-turnstile";
import { postUserRegister } from "@/lib/api"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState<string | null>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [signedUp, setSignedUp] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const turnstile = useTurnstile();

  if (user) {
    return router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!token) {
      setError("Please solve the captcha first")
      return
    }

    try {
      await postUserRegister(username, password, token)
      setSignedUp(true)
    } catch (err) {
      setError(err ? `${err}` : "An error occurred during Registration. Please try again.")
    } finally {
      setIsLoading(false)
      turnstile.reset();
    }
  }

  if (signedUp) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                <Flame className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Register to Ani.cx</CardTitle>
            <CardDescription className="text-center">
              Registration completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You have successfully registered with Ani.cx.
            </p>
            <p>
              Please note that your password cannot be reset as we do not store your e-mail address.
            </p>
            <p className="mt-4">
            <Link href="/login" className="text-red-600 hover:underline">
              Go to Sign in
            </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
              <Flame className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Register to Ani.cx</CardTitle>
          <CardDescription className="text-center">
            Enter your username and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                autoComplete="username webauthn"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="new-password webauthn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Turnstile
                sitekey="0x4AAAAAAA5hSD3aCcYae9XV"
                onVerify={setToken}
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

