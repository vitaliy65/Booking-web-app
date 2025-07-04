export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  bookings: Booking[];
  roomRoles: RoomUserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetingRoom {
  id: number;
  name: string;
  description: string;
  bookings: Booking[];
  roomRoles: RoomUserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  meetingRoomId: number;
  startTime: string;
  endTime: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomUserRole {
  id: number;
  userId: number;
  meetingRoomId: number;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
