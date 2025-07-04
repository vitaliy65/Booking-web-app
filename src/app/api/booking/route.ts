import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/utils/auth";

const prisma = new PrismaClient();

// Get all bookings for a room (optionally by roomId query param)
export async function GET(req: NextRequest) {
  try {
    const roomId = req.nextUrl.searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { meetingRoomId: Number(roomId) },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Create a booking
export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    // Получаем все поля за один вызов
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
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Time conflict with another booking" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId: payload.userId,
        meetingRoomId: roomId,
        startTime: start,
        endTime: end,
        description,
      },
    });

    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Update a booking
export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    const { id, startTime, endTime, description } = await req.json();
    if (!id || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Find the booking and check ownership
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 403 }
      );
    }

    // Check for time conflicts (exclude current booking)
    const conflict = await prisma.booking.findFirst({
      where: {
        meetingRoomId: booking.meetingRoomId,
        id: { not: id },
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Time conflict with another booking" },
        { status: 409 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { startTime: start, endTime: end, description },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete a booking
export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking || booking.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 403 }
      );
    }

    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
