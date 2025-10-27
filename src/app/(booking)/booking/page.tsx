"use client";

import { CalendarDays, Clock, Shield, Users } from "lucide-react";
import { BookingForm } from "@/components/features/booking/booking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Book Your Appointment
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Schedule your chiropractic appointment with Dr Tim Foo. Select your preferred date and
              time, and we'll confirm your booking instantly.
            </p>

            {/* Returning Users */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an appointment?{" "}
                <Link href="/booking/history">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    View your booking history
                  </Button>
                </Link>
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Book Your Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingForm />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Practice Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Practice Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Dr Tim Foo | State Of Flow</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Chiropractic & Wellness Practice
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">What to Expect</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Initial consultation (60 minutes)</li>
                      <li>• Comprehensive assessment</li>
                      <li>• Personalized treatment plan</li>
                      <li>• Follow-up care coordination</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Booking Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Best Times to Book</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Morning appointments (9-11 AM) typically have more availability
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Preparation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Arrive 5 minutes early for your first appointment
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Cancellation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please provide 24-hour notice for appointment changes
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Your Information is Secure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Privacy Protected</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your personal information is protected and never shared
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Secure Booking</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Encrypted connection and HIPAA-compliant
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
