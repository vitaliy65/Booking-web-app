import { NextRequest, NextResponse } from "next/server";
import { MeetingRoom, PrismaClient } from "@prisma/client";
import { requireAuth } from "@/utils/auth";

const prisma = new PrismaClient();

// Создать переговорную комнату
export async function POST(req: NextRequest) {
  try {
    // Проверка авторизации
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const room: MeetingRoom = await prisma.meetingRoom.create({
      data: { name, description },
    });

    // Создать роль ADMIN для пользователя
    await prisma.roomUserRole.create({
      data: {
        userId: payload.userId,
        meetingRoomId: room.id,
        role: "ADMIN",
      },
    });

    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Редактировать переговорную комнату
export async function PUT(req: NextRequest) {
  try {
    // Проверка авторизации
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;

    const { id, name, description } = await req.json();

    if (!id || !name || !description) {
      return NextResponse.json(
        { error: "ID, name and description are required" },
        { status: 400 }
      );
    }

    const room = await prisma.meetingRoom.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Удалить переговорную комнату
// Удалить переговорную комнату
export async function DELETE(req: NextRequest) {
  try {
    // Проверка авторизации
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Сначала удаляем связанные роли и бронирования
    await prisma.roomUserRole.deleteMany({ where: { meetingRoomId: id } });
    await prisma.booking.deleteMany({ where: { meetingRoomId: id } });

    // Затем удаляем саму комнату
    await prisma.meetingRoom.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Получить все переговорные комнаты пользователя
export async function GET(req: NextRequest) {
  try {
    // Проверка авторизации
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    // Получить все комнаты, где пользователь имеет роль (RoomUserRole)
    const rooms = await prisma.meetingRoom.findMany({
      where: {
        roomRoles: {
          some: {
            userId: payload.userId,
          },
        },
      },
      include: {
        roomRoles: true,
        bookings: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rooms);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
