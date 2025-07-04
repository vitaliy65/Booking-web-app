"use client";

import { MeetingRoomGrid } from "@/components/meetingRoom/MeetingRoomGrid";
import RoomsNotFound from "@/components/meetingRoom/RoomsNotFound";
import { MeetingRoomCard } from "@/components/meetingRoom/MeetingRoomCard";
import { useMeetingRoom } from "@/hooks/MeetingRoom";
import { MeetingRoom } from "@prisma/client";
import React from "react";

export default function MeetingRooms() {
  const { rooms } = useMeetingRoom();

  return (
    <MeetingRoomGrid>
      {rooms && rooms.length === 0 ? (
        <RoomsNotFound />
      ) : (
        (rooms as MeetingRoom[])?.map((room) => (
          <MeetingRoomCard key={room.id} room={room} />
        ))
      )}
    </MeetingRoomGrid>
  );
}
