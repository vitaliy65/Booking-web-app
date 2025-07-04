"use client";

import React, { useState } from "react";
import { Booking } from "@/types/types";

interface BookingFormProps {
  initial?: Partial<Booking>;
  onSubmit: (data: {
    startTime: string;
    endTime: string;
    description?: string;
  }) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function BookingForm({
  initial = {},
  onSubmit,
  onCancel,
  loading,
}: BookingFormProps) {
  const [startTime, setStartTime] = useState(initial.startTime || "");
  const [endTime, setEndTime] = useState(initial.endTime || "");
  const [description, setDescription] = useState(initial.description || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!startTime || !endTime) {
      setError("Початковий і кінцевий час обов'язкові");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError("Кінцевий час має бути пізніше початкового");
      return;
    }
    try {
      await onSubmit({ startTime, endTime, description });
    } catch (err) {
      setError(err.message || "Помилка збереження бронювання");
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div>
        <label>Початок:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Кінець:</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Опис:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          Зберегти
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}
