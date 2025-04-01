import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Terms of Service - FireAnime",
  description: "Terms and conditions for using the FireAnime streaming platform.",
}

export default function TermsPage() {
  return (
    <div className="w-full lg:pl-60">
      <div className="container py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: March 30, 2025</p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Welcome to FireAnime</CardTitle>
              <CardDescription>Please read these Terms of Service carefully before using our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                By accessing or using the FireAnime service, website, and software applications (collectively, the
                "FireAnime Service" or "our Service"), you are entering into a binding contract with FireAnime. Your
                agreement with us includes these Terms of Service and our Privacy Policy. If you do not agree to these
                Terms, you must not access or use the FireAnime Service.
              </p>
              <p>
                We may make changes to these Terms from time to time. If we make changes, we will notify you by revising
                the date at the top of these Terms and, in some cases, we may provide you with additional notice. We
                encourage you to review these Terms whenever you access the FireAnime Service to stay informed about our
                practices.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">1. Using FireAnime</h2>
              <div className="space-y-4">
                <p>
                  The FireAnime Service provides a platform for users to discover and watch anime content. You may use
                  the FireAnime Service only if you can form a binding contract with FireAnime, and only in compliance
                  with these Terms and all applicable laws.
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-2">1.1 FireAnime Accounts</h3>
                <p>
                  To access certain features of the FireAnime Service, you must register for an account. When you create
                  an account, you must provide accurate and complete information. You are solely responsible for the
                  activity that occurs on your account, and you must keep your account password secure.
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-2">1.2 Age Requirements</h3>
                <p>
                  You must be at least 13 years of age to use the FireAnime Service. If you are under 18 years of age,
                  you must have your parent or legal guardian's permission to use the Service and to accept these Terms.
                </p>
              </div>
            </section>

            <Separator />

            {/* Additional sections omitted for brevity */}

            <section>
              <h2 className="text-xl font-bold mb-4">8. Contact Information</h2>
              <div className="space-y-4">
                <p>
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="mailto:admin@fireani.me" className="text-red-600 hover:underline">
                    admin@fireani.me
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

