import CreateRoomForm from "./CreateRoomForm";
import React from "react";

interface MeetingRoomGridProps {
  children: React.ReactNode;
}

export function MeetingRoomGrid({ children }: MeetingRoomGridProps) {
  // Определяем количество элементов
  const count = React.Children.count(children);
  // Вычисляем количество колонок: от 1 до 4
  const cols = Math.max(1, Math.min(count, 4));
  // Формируем класс для grid
  const gridClass = `grid grid-cols-1 w-96 ${
    cols >= 2 ? ` sm:grid-cols-2 min-w-full` : ""
  }${cols >= 3 ? ` md:grid-cols-3` : ""}${
    cols === 4 ? ` lg:grid-cols-4` : ""
  } gap-6`;

  return (
    <section className="meeting-room-section">
      <CreateRoomForm />
      <div className={`${gridClass} `}>{children}</div>
    </section>
  );
}
