"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MessageCircleIcon, UsersIcon, CheckCircleIcon } from "lucide-react";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <Badge className="w-fit bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                State Of Flow Chiropractic
              </Badge>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                Hello,
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Your journey starts here. Whether you are excited, unsure, concerned, or even confused…
                Don't worry, I am here to help.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/booking">
                <Button size="lg" className="text-lg px-10 py-6">
                  Book Now
                  <CalendarIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-lg px-10 py-6">
                  Chat with Us
                  <MessageCircleIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span key={`rating-${rating}`} className="text-yellow-400 text-2xl">★</span>
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  5.0 (17 Facebook Reviews)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UsersIcon className="h-4 w-4" />
                <span>Thousands of proactive Singaporeans</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Join Thousands of Proactive Singaporeans Today
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Many Singaporeans are now increasingly aware of natural therapies. Choosing a health practitioner can be tough.
              Who can you trust? Are they familiar with your condition? Is it suitable for you? That is why word of mouth is important these days.
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Ideally, you are here from a referral or you have heard of me from someone/somewhere.
              I would like to get to know you. What are your goals today? Come, let's have a chat.
            </p>
            <div className="pt-4">
              <Link href="https://m.me/drtimfoo" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <MessageCircleIcon className="mr-2 h-5 w-5" />
                  Chat on Facebook Messenger
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Services - Conditions Treated
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive chiropractic care for a wide range of conditions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Spinal Conditions */}
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Spinal Conditions</CardTitle>
                <CardDescription>
                  Comprehensive treatment for spine and nervous system issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Acute & Chronic Low Back Pain</li>
                  <li>• Sciatica</li>
                  <li>• Persistent Neck/Shoulder Aches</li>
                  <li>• Headaches & Migraines</li>
                </ul>
              </CardContent>
            </Card>

            {/* Extremity Conditions */}
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Extremity Conditions</CardTitle>
                <CardDescription>
                  Treatment for joint and muscle issues throughout the body
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Frozen Shoulder</li>
                  <li>• Tennis/Golfers Elbow</li>
                  <li>• Carpal Tunnel</li>
                  <li>• Plantar Fasciitis</li>
                </ul>
              </CardContent>
            </Card>

            {/* Other Conditions */}
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Other Conditions</CardTitle>
                <CardDescription>
                  Holistic approach to various health concerns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Persistent Reflux & Bloating</li>
                  <li>• Constipation & Diarrhoea</li>
                  <li>• Balance Disorders (BPPV)</li>
                  <li>• Hip/Groin & Knee Pain</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What Our Patients Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real stories from real patients who found relief at State Of Flow
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Jimmy Tan",
                date: "July 15, 2022",
                content: "Dr Tim has been helping me with my \"issue\" and I always felt so good after visiting him and got me adjusted.",
                rating: 5
              },
              {
                name: "Marvin Ng",
                date: "August 19, 2019",
                content: "I felt so relief and comfortable after the treatment. Thank you Dr Timothy for fixing my neck and my back. Well recommended chiropractor in town.",
                rating: 5
              },
              {
                name: "YouShen Lim",
                date: "July 15, 2019",
                content: "Great attention to details, highly professional and meticulous service - Highly recommended! Immediate results for tendinitis issues.",
                rating: 5
              }
            ].map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={`${testimonial.name}-star-${i}`} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.date}</p>
                    </div>
                    <Badge variant="outline">Facebook Review</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="https://www.facebook.com/drtimfoo/reviews" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Read More Reviews on Facebook
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            People don't care how much you know until they know how much you care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                Book Appointment Now
                <CalendarIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
                <MessageCircleIcon className="mr-2 h-5 w-5" />
                Have a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}