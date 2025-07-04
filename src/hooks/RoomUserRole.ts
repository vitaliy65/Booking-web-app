import { RoomUserRole } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Получить список ролей пользователей для комнаты
const fetchRoles = async (roomId: number) => {
  const res = await axios.get(`/api/room-user-role?roomId=${roomId}`, {
    withCredentials: true,
  });
  return res.data;
};

// Добавить пользователя с ролью
const addUserRole = async (data: {
  roomId: number;
  email: string;
  role: "ADMIN" | "USER";
}) => {
  const res = await axios.post("/api/room-user-role", data, {
    withCredentials: true,
  });
  return res.data;
};

// Изменить роль пользователя
const updateUserRole = async (data: {
  roomId: number;
  userId: number;
  role: "ADMIN" | "USER";
}) => {
  const res = await axios.put("/api/room-user-role", data, {
    withCredentials: true,
  });
  return res.data;
};

// Удалить пользователя из комнаты
const deleteUserRole = async (data: { roomId: number; userId: number }) => {
  const res = await axios.delete("/api/room-user-role", {
    data,
    withCredentials: true,
  });
  return res.data;
};

export function useRoomUserRole(roomId: number) {
  const queryClient = useQueryClient();

  const { data: roles, isPending } = useQuery({
    queryKey: ["roomUserRoles", roomId],
    queryFn: () => fetchRoles(roomId),
  });

  const addRole = useMutation({
    mutationFn: addUserRole,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["roomUserRoles", roomId] }),
  });

  const updateRole = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["roomUserRoles", roomId] }),
  });

  const removeRole = useMutation({
    mutationFn: deleteUserRole,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["roomUserRoles", roomId] }),
  });

  return {
    roles: roles as RoomUserRole[],
    isUserRolePending: isPending,

    addRole: addRole.mutateAsync,
    updateRole: updateRole.mutateAsync,
    removeRole: removeRole.mutateAsync,

    addRoleStatus: addRole.status,
    updateRoleStatus: updateRole.status,
    deleteRoleStatus: removeRole.status,

    addRoleError: addRole.error,
    updateRoleError: updateRole.error,
    deleteRoleError: removeRole.error,
  };
}
