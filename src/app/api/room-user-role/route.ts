import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/utils/auth";

const prisma = new PrismaClient();

// GET: Получить список пользователей и их ролей для комнаты
export async function GET(req: NextRequest) {
  try {
    const roomId = req.nextUrl.searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    const roles = await prisma.roomUserRole.findMany({
      where: { meetingRoomId: Number(roomId) },
      include: { user: true },
    });

    return NextResponse.json(roles);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: Добавить пользователя с ролью по email
export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    const { roomId, email, role } = await req.json();

    if (!roomId || !email || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Проверка, что текущий пользователь - админ комнаты
    const admin = await prisma.roomUserRole.findFirst({
      where: {
        meetingRoomId: Number(roomId),
        userId: payload.userId,
        role: "ADMIN",
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Найти пользователя по email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Проверка: нельзя пригласить самого себя
    if (user.id === payload.userId) {
      return NextResponse.json(
        { error: "Нельзя пригласить самого себя" },
        { status: 400 }
      );
    }

    // Проверка: если у пользователя уже есть роль ADMIN, не понижать её до USER
    const existingRole = await prisma.roomUserRole.findUnique({
      where: {
        userId_meetingRoomId: {
          userId: user.id,
          meetingRoomId: Number(roomId),
        },
      },
    });
    if (existingRole && existingRole.role === "ADMIN" && role === "USER") {
      // Не понижаем роль ADMIN до USER
      return NextResponse.json(existingRole);
    }

    // Добавить или обновить роль только для приглашённого пользователя
    const newRole = await prisma.roomUserRole.upsert({
      where: {
        userId_meetingRoomId: {
          userId: user.id,
          meetingRoomId: Number(roomId),
        },
      },
      update: { role },
      create: {
        userId: user.id,
        meetingRoomId: Number(roomId),
        role,
      },
    });

    return NextResponse.json(newRole);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Изменить роль пользователя в комнате
export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    const { roomId, userId, role } = await req.json();

    if (!roomId || !userId || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Проверка, что текущий пользователь - админ комнаты
    const admin = await prisma.roomUserRole.findFirst({
      where: {
        meetingRoomId: Number(roomId),
        userId: payload.userId,
        role: "ADMIN",
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.roomUserRole.update({
      where: {
        userId_meetingRoomId: {
          userId: Number(userId),
          meetingRoomId: Number(roomId),
        },
      },
      data: { role },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Удалить пользователя из комнаты
export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if ("response" in auth) return auth.response;
    const { payload } = auth;

    const { roomId, userId } = await req.json();

    if (!roomId || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Проверка, что текущий пользователь - админ комнаты
    const admin = await prisma.roomUserRole.findFirst({
      where: {
        meetingRoomId: Number(roomId),
        userId: payload.userId,
        role: "ADMIN",
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.roomUserRole.delete({
      where: {
        userId_meetingRoomId: {
          userId: Number(userId),
          meetingRoomId: Number(roomId),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
