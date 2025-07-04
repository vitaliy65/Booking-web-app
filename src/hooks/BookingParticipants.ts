import { BookingParticipant } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchBookingParticipants = async (bookingId: number) => {
  const res = await axios.get(`/api/booking/${bookingId}/participants`, {
    withCredentials: true,
  });
  return res.data;
};

const joinBooking = async (bookingId: number) => {
  const res = await axios.post(
    `/api/booking/${bookingId}/participants`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

export function useBookingParticipants(bookingId: number) {
  const queryClient = useQueryClient();

  const {
    data: bookingParticipants,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookingParticipants", bookingId],
    queryFn: () => fetchBookingParticipants(bookingId),
    enabled: !!bookingId,
    retry: 1,
  });

  const join = useMutation({
    mutationFn: joinBooking,
    onSuccess: (_data, bookingId) => {
      queryClient.invalidateQueries({
        queryKey: ["bookingParticipants", bookingId],
      });
    },
  });

  return {
    bookingParticipants: bookingParticipants as BookingParticipant[],

    isParticipantsLoading: isLoading,
    isParticipantsError: isError,
    ParticipantsError: error,
    ParticipantsRefetch: refetch,

    joinBooking: join.mutateAsync,
    joinStatus: join.status,
    joinError: join.error,
  };
}
