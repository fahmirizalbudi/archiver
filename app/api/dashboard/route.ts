import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/dashboard - Dashboard counts
export async function GET() {
  try {
    const totalDocuments = await prisma.document.count();
    const archivedDocuments = await prisma.document.count({
      where: { status: "ARCHIVED" },
    });
    const recentDocuments = await prisma.document.findMany({
      take: 5,
      orderBy: { uploadedAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json({
      totalDocuments,
      archivedDocuments,
      recentDocuments,
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
