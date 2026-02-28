import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid Category ID" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    const { name } = await request.json();

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid Category ID" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });

    await prisma.activityLog.create({
      data: {
        action: `Updated category ID ${categoryId} to: ${name}`,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid Category ID" }, { status: 400 });
    }

    // Check if there are documents in this category
    const docCount = await prisma.document.count({
      where: { categoryId },
    });

    if (docCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with associated documents" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    await prisma.activityLog.create({
      data: {
        action: `Deleted category ID ${categoryId}`,
      },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
