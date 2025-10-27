"use client";

import { BookingConfirmation } from "@/components/features/booking/booking-confirmation";

interface BookingConfirmationPageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default function BookingConfirmationPage({
  params,
}: BookingConfirmationPageProps) {
  return (
    <div className="container py-8">
      <BookingConfirmation bookingId={params.id} />
    </div>
  );
}