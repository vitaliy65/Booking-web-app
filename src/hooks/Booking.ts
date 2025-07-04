import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Fetch bookings for a room
const fetchBookings = async (roomId: number) => {
  try {
    const res = await axios.get(`/api/booking?roomId=${roomId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Помилка отримання бронювань"
    );
  }
};

// Create a booking
const createBooking = async (data: {
  meetingRoomId: number;
  startTime: string;
  endTime: string;
  description?: string;
}) => {
  try {
    console.log(data.meetingRoomId);
    console.log(data.startTime);
    console.log(data.endTime);
    console.log(data.description);
    const res = await axios.post("/api/booking", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Помилка створення бронювання"
    );
  }
};

// Update a booking
const updateBooking = async (data: {
  id: number;
  startTime: string;
  endTime: string;
  description?: string;
}) => {
  try {
    const res = await axios.put("/api/booking", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Помилка оновлення бронювання"
    );
  }
};

// Delete a booking
const deleteBooking = async (id: number) => {
  try {
    const res = await axios.delete("/api/booking", {
      data: { id },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Помилка видалення бронювання"
    );
  }
};

export function useBooking(roomId: number) {
  const queryClient = useQueryClient();

  // Fetch bookings for a room
  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings", roomId],
    queryFn: () => fetchBookings(roomId),
    enabled: !!roomId,
    retry: 1,
  });

  // Create booking
  const create = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", roomId] });
    },
  });

  // Update booking
  const update = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", roomId] });
    },
  });

  // Delete booking
  const remove = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", roomId] });
    },
  });

  return {
    bookings,
    isLoading,
    isError,
    error,
    refetch,
    createBooking: create.mutateAsync,
    createStatus: create.status,
    createError: create.error,
    updateBooking: update.mutateAsync,
    updateStatus: update.status,
    updateError: update.error,
    deleteBooking: remove.mutateAsync,
    deleteStatus: remove.status,
    deleteError: remove.error,
  };
}
