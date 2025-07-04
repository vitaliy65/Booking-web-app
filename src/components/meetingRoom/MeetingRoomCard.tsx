import React, { useState } from "react";
import { MeetingRoom } from "@prisma/client";
import { Check, Pencil, Trash, X } from "lucide-react";
import { useMeetingRoom } from "@/hooks/MeetingRoom";
import { useRouter } from "next/navigation";

interface MeetingRoomCardProps {
  room: MeetingRoom;
}

export function MeetingRoomCard({ room }: MeetingRoomCardProps) {
  const { updateRoom, deleteRoom } = useMeetingRoom();
  const [newTitle, setNewTitle] = useState(room.name);
  const [newDescription, setNewDescription] = useState(room.description);
  const [isEditMode, setEditMode] = useState(false);
  const router = useRouter();

  const submitEdited = () => {
    updateRoom({ id: room.id, name: newTitle, description: newDescription });
  };

  const openBooking = () => {
    router.push(`meeting-rooms/${room.id}`);
  };

  return (
    <div className="room-card" onClick={openBooking}>
      <div className="flex flex-row justify-between">
        {isEditMode ? (
          <input
            className="room-edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h2 className="room-title">{room.name}</h2>
        )}
        {isEditMode ? (
          <div className="room-actions">
            <button
              className="room-action-edit"
              onClick={async (e) => {
                e.stopPropagation();
                setEditMode(false);
                await submitEdited();
              }}
            >
              <Check />
            </button>
            <button
              className="room-action-delete"
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(false);
              }}
            >
              <X />
            </button>
          </div>
        ) : (
          <div className="room-actions">
            <button
              className="room-action-edit"
              onClick={async (e) => {
                e.stopPropagation();
                await setEditMode(true);
              }}
            >
              <Pencil />
            </button>
            <button
              className="room-action-delete"
              onClick={async (e) => {
                e.stopPropagation();
                await deleteRoom(room.id);
              }}
            >
              <Trash />
            </button>
          </div>
        )}
      </div>
      <div>
        {isEditMode ? (
          <input
            className="room-edit-input"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="room-description">{room.description}</p>
        )}
      </div>
      <div className="room-date-info">
        <div>Created: {new Date(room.createdAt).toLocaleString()}</div>
        <div>Updated: {new Date(room.updatedAt).toLocaleString()}</div>
        <div>ID: {room.id}</div>
      </div>
    </div>
  );
}
