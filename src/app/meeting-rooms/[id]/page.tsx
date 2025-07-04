import { BookingList } from "@/components/booking/BookingList";
import React from "react";

export default async function Booking({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return <BookingList roomId={id} />;
}
