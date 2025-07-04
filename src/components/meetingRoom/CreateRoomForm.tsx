import { useMeetingRoom } from "@/hooks/MeetingRoom";
import React, { useState } from "react";

export default function CreateRoomForm() {
  const { createRoom, createStatus, createError } = useMeetingRoom();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    await createRoom({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="create-room-form">
      <h2 className="create-room-form-title">
        Створити нову переговорну кімнату
      </h2>
      <div className="form-input-container">
        <input
          className="create-room-form-input-field"
          placeholder="Назва кімнати"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="create-room-form-input-field min-h-[42px]"
          placeholder="Опис кімнати"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center gap-4 mt-2">
        <button
          type="submit"
          className="create-room-form-button"
          disabled={createStatus === "pending"}
        >
          {createStatus === "pending" ? "Створення..." : "Створити кімнату"}
        </button>
        {createError && (
          <span className="create-form-error-message">
            {createError.message}
          </span>
        )}
      </div>
    </form>
  );
}
