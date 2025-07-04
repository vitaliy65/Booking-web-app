import React, { useEffect, useState } from "react";
import { Booking } from "@/types/types";
import { useBookingParticipants } from "@/hooks/BookingParticipants";
import Loading from "../Loading";
import { useUser } from "@/hooks/User";

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
  const { bookingParticipants, isParticipantsLoading, joinBooking } =
    useBookingParticipants(booking.id);
  const { user } = useUser();
  const [isJoined, setjoined] = useState(false);

  useEffect(() => {
    if (bookingParticipants && user) {
      const joined = bookingParticipants.some((bp) => bp.userId == user.id);
      setjoined(joined);
    }
  }, [bookingParticipants, user]);

  const handleJoin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await joinBooking(booking.id);
  };

  if (isParticipantsLoading) return <Loading />;

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
      <div className="flex flex-row">
        <p className="font-bold">ID учасників: &nbsp;</p>
        <ul className="flex flex-row">
          {bookingParticipants &&
            bookingParticipants.map((bp) => (
              <li key={bp.id}>{bp.userId},&nbsp;</li>
            ))}
        </ul>
      </div>
      {isOwn && (
        <div className="booking-actions">
          <button onClick={onEdit}>Редагувати</button>
          <button onClick={onDelete}>Скасувати</button>
        </div>
      )}
      {!isJoined && (
        <div className="flex justify-center items-center">
          <button
            className="bg-blue-500 rounded-md w-24 h-8 text-white"
            onClick={(e) => handleJoin(e)}
          >
            join
          </button>
        </div>
      )}
    </div>
  );
}
