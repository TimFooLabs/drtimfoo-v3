"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Dynamically import to avoid SSR issues with Convex hooks
const BookingConfirmation = dynamic(
  () => import("@/components/features/booking/booking-confirmation").then(mod => ({ default: mod.BookingConfirmation })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }
);

export default function BookingConfirmationPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      }>
        <BookingConfirmation />
      </Suspense>
    </div>
  );
}