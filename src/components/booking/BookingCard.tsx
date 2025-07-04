import React from "react";
import { Booking } from "@/types/types";

interface BookingCardProps {
  booking: Booking;
  onEdit: () => void;
  onDelete: () => void;
  isOwn: boolean;
}

export function BookingCard({
  booking,
  onEdit,
  onDelete,
  isOwn,
}: BookingCardProps) {
  return (
    <div className="booking-card">
      <div>
        <strong>Час:</strong> {new Date(booking.startTime).toLocaleString()} -{" "}
        {new Date(booking.endTime).toLocaleString()}
      </div>
      {booking.description && (
        <div>
          <strong>Опис:</strong> {booking.description}
        </div>
      )}
      <div>
        <strong>Користувач ID:</strong> {booking.userId}
      </div>
      {isOwn && (
        <div className="booking-actions">
          <button onClick={onEdit}>Редагувати</button>
          <button onClick={onDelete}>Скасувати</button>
        </div>
      )}
    </div>
  );
}
