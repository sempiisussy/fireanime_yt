import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Code, Globe, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "About Ani.cx - A Community Project",
  description: "Learn about Ani.cx, a community-driven anime streaming platform created by fans, for fans.",
}

export default function AboutPage() {
  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">About Ani.cx</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A community-driven anime streaming platform created by fans, for fans.
            </p>
          </div>

          <Card className="mb-12 border-red-600/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription>What drives us forward</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg mb-6">
                Ani.cx was born from a simple idea: to create a platform where anime fans can discover, watch, and
                discuss their favorite series without barriers or commercial interests.
              </p>
              <div className="flex justify-center">
                <Badge className="text-base py-1 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-600 border-red-600/20">
                  By the community, for the community
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-600" /> Non-Profit Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ani.cx is a completely non-profit initiative. We don't run ads, sell user data, or charge
                  subscription fees. Our platform is sustained entirely by community contributions and volunteer
                  efforts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-red-600" /> Community-Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Every aspect of Ani.cx is shaped by our community. From content curation to feature development, we
                  rely on passionate anime fans who volunteer their time and expertise to make this platform better for
                  everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5 text-red-600" /> Open Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We believe in transparency and collaboration. That's why Ani.cx is completely open source, allowing
                  anyone to contribute to its development, suggest improvements, or adapt it for their own communities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-red-600" /> Accessible to All
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We're committed to making anime accessible to everyone, regardless of location or financial means. Our
                  platform is designed to be inclusive, with features that support multiple languages and accessibility
                  needs.
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-12" />

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">How You Can Contribute</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Join Our Development Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Are you a developer, designer, or content creator? We're always looking for talented individuals to
                    help improve Ani.cx.
                  </p>
                  <div className="flex gap-4">
                    <Link href={"mailto:admin@fireani.me"}>
                      <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                        <MessageSquare className="h-4 w-4" /> Contact Us
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support the Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Even if you're not a developer, there are many ways to contribute: report bugs, suggest features,
                    help with translations, or simply spread the word!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-red-600/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="mb-6">
              Ani.cx is more than just a platform—it's a community of passionate anime fans. Whether you're a casual
              viewer or a dedicated otaku, there's a place for you here.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
              <Link href="/">Get Involved Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}