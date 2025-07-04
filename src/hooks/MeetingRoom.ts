import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Получить все переговорные комнаты
const fetchRooms = async () => {
  try {
    const res = await axios.get("/api/meeting-room", { withCredentials: true });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Помилка отримання кімнат"
    );
  }
};

// Создать переговорную комнату
const createRoom = async (data: { name: string; description: string }) => {
  try {
    const res = await axios.post("/api/meeting-room", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Помилка створення кімнати"
    );
  }
};

// Удалить переговорную комнату
const deleteRoom = async (id: number) => {
  try {
    const res = await axios.delete("/api/meeting-room", {
      data: { id },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Помилка видалення кімнати"
    );
  }
};

// Обновить переговорную комнату
const updateRoom = async (data: {
  id: number;
  name: string;
  description: string;
}) => {
  try {
    const res = await axios.put("/api/meeting-room", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Помилка оновлення кімнати"
    );
  }
};

export function useMeetingRoom() {
  const queryClient = useQueryClient();

  // Получить все комнаты
  const {
    data: rooms,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({ queryKey: ["meetingRooms"], queryFn: fetchRooms, retry: 1 });

  // Создать комнату
  const create = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetingRooms"] });
    },
  });

  // Удалить комнату
  const remove = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetingRooms"] });
    },
  });

  // Обновить комнату
  const update = useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetingRooms"] });
    },
  });

  return {
    rooms,
    isLoading,
    isError,
    error,
    refetch,
    createRoom: create.mutateAsync,
    createStatus: create.status,
    createError: create.error,
    deleteRoom: remove.mutateAsync,
    deleteStatus: remove.status,
    deleteError: remove.error,
    updateRoom: update.mutateAsync,
    updateStatus: update.status,
    updateError: update.error,
  };
}
