import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/utils/auth";

const prisma = new PrismaClient();

// Присоединиться к бронированию
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    const { id } = await params;
    const bookingId = Number(id);

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Проверка: уже присоединился?
    const exists = await prisma.bookingParticipant.findUnique({
      where: { bookingId_userId: { bookingId, userId: payload.userId } },
    });

    if (exists) {
      return NextResponse.json({ error: "Already joined" }, { status: 400 });
    }

    const participant = await prisma.bookingParticipant.create({
      data: { bookingId, userId: payload.userId },
    });

    return NextResponse.json(participant);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Получить участников бронирования
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const bookingId = Number(id);

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const participants = await prisma.bookingParticipant.findMany({
      where: { bookingId },
      include: { user: true },
    });

    return NextResponse.json(participants);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
