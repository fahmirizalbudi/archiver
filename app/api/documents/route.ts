import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DocumentStatus } from "@prisma/client";

// GET /api/documents - List documents with search and filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status") as DocumentStatus | null;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    };

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.uploadedAt = {};
      if (startDate) {
        where.uploadedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.uploadedAt.lte = new Date(endDate);
      }
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create a new document (Metadata only for now, or simple upload)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, categoryId, filePath, fileType, fileSize } = body;

    if (!title || !categoryId || !filePath || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        description,
        categoryId: parseInt(categoryId),
        filePath,
        fileType,
        fileSize: parseInt(fileSize),
        status: "ACTIVE",
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Uploaded document: ${title}`,
        documentId: document.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
