import { useRoomUserRole } from "@/hooks/RoomUserRole";
import { MeetingRoom } from "@prisma/client";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";

export default function InviteForm({ room }: { room: MeetingRoom }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "USER">("USER");
  const [inviteError, setInviteError] = useState("");
  const { addRole, isUserRolePending } = useRoomUserRole(room.id);

  return (
    <>
      <button
        className="room-action-invite bg-green-500 hover:bg-green-600 text-white rounded p-1 w-8 h-8"
        onClick={(e) => {
          e.stopPropagation();
          setInviteOpen((v) => !v);
        }}
        title="Пригласить пользователя"
      >
        <UserPlus />
      </button>
      {inviteOpen && (
        <div className="fixed inset-0 z-50 w-screen h-screen bg-black/50 flex items-center justify-center">
          <form
            className="relative flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded p-3 my-2 min-w-2xs"
            onClick={(e) => e.stopPropagation()}
            onSubmit={async (e) => {
              e.preventDefault();
              setInviteError("");
              try {
                await addRole({
                  roomId: room.id,
                  email: inviteEmail,
                  role: inviteRole,
                });
                setInviteOpen(false);
                setInviteEmail("");
                setInviteRole("USER");
              } catch (err) {
                setInviteError(
                  err?.response?.data?.error || "Помилка запрошення"
                );
              }
            }}
          >
            <label className="font-semibold">Email користувача</label>
            <input
              type="email"
              className="border rounded px-2 py-1"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <label className="font-semibold">Роль</label>
            <select
              className="border rounded px-2 py-1"
              value={inviteRole}
              onChange={(e) =>
                setInviteRole(e.target.value as "ADMIN" | "USER")
              }
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            {inviteError && (
              <div className="text-red-500 text-sm">{inviteError}</div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="px-4 py-1 w-full bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={isUserRolePending}
              >
                Запросить
              </button>
              <button
                type="button"
                className="px-4 py-1 w-full bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                onClick={() => setInviteOpen(false)}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
