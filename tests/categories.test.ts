import { GET, POST } from "@/app/api/categories/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
  },
}));

describe("Categories API", () => {
  it("should fetch all categories", async () => {
    const mockCategories = [{ id: 1, name: "Test Category" }];
    (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockCategories);
    expect(prisma.category.findMany).toHaveBeenCalled();
  });

  it("should create a new category", async () => {
    const newCategory = { id: 2, name: "New Category" };
    (prisma.category.create as jest.Mock).mockResolvedValue(newCategory);
    (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

    const request = new Request("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify({ name: "New Category" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(newCategory);
    expect(prisma.category.create).toHaveBeenCalledWith({
      data: { name: "New Category" },
    });
  });

  it("should return 400 if name is missing", async () => {
    const request = new Request("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Name is required");
  });
});
