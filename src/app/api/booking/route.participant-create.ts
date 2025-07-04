import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/utils/auth";

const prisma = new PrismaClient();

// Автоматически присоединять создателя к бронированию
export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;
    const { meetingRoomId, startTime, endTime, description } = await req.json();
    const roomId = Number(meetingRoomId);
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (!roomId || !start || !end) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Проверка на конфликт времени
    const conflict = await prisma.booking.findFirst({
      where: {
        meetingRoomId: roomId,
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } },
        ],
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Time conflict with another booking" },
        { status: 409 }
      );
    }
    // Создать бронирование
    const booking = await prisma.booking.create({
      data: {
        userId: payload.userId,
        meetingRoomId: roomId,
        startTime: start,
        endTime: end,
        description,
      },
    });
    // Добавить создателя в участники
    await prisma.bookingParticipant.create({
      data: { bookingId: booking.id, userId: payload.userId },
    });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
