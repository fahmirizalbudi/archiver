import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/activity-log - List activity logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const logs = await prisma.activityLog.findMany({
      take: limit,
      orderBy: { timestamp: "desc" },
      include: {
        document: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
