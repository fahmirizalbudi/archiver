import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/documents/[id] - Get a single document
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);

    if (isNaN(documentId)) {
      return NextResponse.json({ error: "Invalid Document ID" }, { status: 400 });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        category: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update a document (metadata, status)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);
    const body = await request.json();

    if (isNaN(documentId)) {
      return NextResponse.json({ error: "Invalid Document ID" }, { status: 400 });
    }

    const { title, description, categoryId, status } = body;

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        title,
        description,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        status,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Updated document ID ${documentId}: ${title}`,
        documentId: document.id,
      },
    });

    return NextResponse.json(document);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Hard delete a document
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);

    if (isNaN(documentId)) {
      return NextResponse.json({ error: "Invalid Document ID" }, { status: 400 });
    }

    // Delete related logs first or use cascade (Schema has it? No, explicit delete logs or handle)
    // Actually, prisma will fail if there are logs referencing it.
    // I should probably delete logs or set documentId to null if I want to keep logs.
    await prisma.activityLog.updateMany({
      where: { documentId },
      data: { documentId: null },
    });

    await prisma.document.delete({
      where: { id: documentId },
    });

    await prisma.activityLog.create({
      data: {
        action: `Deleted document ID ${documentId}`,
      },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
