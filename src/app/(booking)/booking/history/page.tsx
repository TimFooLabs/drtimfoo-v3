"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with Convex hooks
const BookingList = dynamic(
  () => import("@/components/features/booking/booking-list").then(mod => ({ default: mod.BookingList })),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
);

export default function BookingHistoryPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      }>
        <BookingList />
      </Suspense>
    </div>
  );
}