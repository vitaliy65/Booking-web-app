"use client";

import React, { useEffect, useState } from "react";
import { Booking } from "@/types/types";
import { useBooking } from "@/hooks/Booking";
import { useUser } from "@/hooks/User";
import { BookingCard } from "./BookingCard";
import { BookingForm } from "./BookingForm";
import { useRouter } from "next/navigation";
import { useRoomUserRole } from "@/hooks/RoomUserRole";

interface BookingListProps {
  roomId: number;
}

export function BookingList({ roomId }: BookingListProps) {
  const { bookings, isLoading, createBooking, updateBooking, deleteBooking } =
    useBooking(roomId);
  const { user } = useUser();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const { roles, isUserRolePending } = useRoomUserRole(roomId);
  const [canEdit, setCanEdit] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!roles) return;

    roles.map((role) => {
      if (role.meetingRoomId == roomId) {
        if (role.role === "USER" && role.userId === user.id) {
          setCanEdit(false);
        }
      }
    });
  }, [roomId, roles, user]);

  if (isLoading || isUserRolePending)
    return <div>Завантаження бронювань...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg mt-4 flex flex-col gap-4">
      <button
        onClick={() => router.push("/meeting-rooms")}
        className="self-start mb-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
      >
        <span className="text-xl">←</span> Назад до кімнат
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h3 className="text-2xl font-bold text-gray-800">Бронювання</h3>
        {canEdit && (
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Додати бронювання
          </button>
        )}
      </div>
      {creating && (
        <BookingForm
          onSubmit={async (data) => {
            await createBooking({ ...data, meetingRoomId: roomId });
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      )}
      {bookings && bookings.length === 0 && (
        <div className="text-center text-gray-500 py-8">Немає бронювань</div>
      )}
      <div className="flex flex-col gap-4">
        {bookings &&
          bookings.map((booking: Booking) =>
            editingId === booking.id ? (
              <BookingForm
                key={booking.id}
                initial={booking}
                onSubmit={async (data) => {
                  await updateBooking({ ...data, id: booking.id });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <BookingCard
                key={booking.id}
                booking={booking}
                isOwn={canEdit}
                onEdit={() => setEditingId(booking.id)}
                onDelete={async () => await deleteBooking(booking.id)}
              />
            )
          )}
      </div>
    </div>
  );
}
