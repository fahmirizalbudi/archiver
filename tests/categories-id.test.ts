import { GET, PUT, DELETE } from "@/app/api/categories/[id]/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    document: {
      count: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
  },
}));

describe("Category ID API", () => {
  it("should fetch a category by ID", async () => {
    const mockCategory = { id: 1, name: "Test Category", _count: { documents: 5 } };
    (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

    const request = new Request("http://localhost/api/categories/1");
    const response = await GET(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe(1);
    expect(prisma.category.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
      })
    );
  });

  it("should update a category", async () => {
    const updatedCategory = { id: 1, name: "Updated Name" };
    (prisma.category.update as jest.Mock).mockResolvedValue(updatedCategory);
    (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

    const request = new Request("http://localhost/api/categories/1", {
      method: "PUT",
      body: JSON.stringify({ name: "Updated Name" }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Updated Name");
    expect(prisma.category.update).toHaveBeenCalled();
  });

  it("should delete a category if it has no documents", async () => {
    (prisma.document.count as jest.Mock).mockResolvedValue(0);
    (prisma.category.delete as jest.Mock).mockResolvedValue({});
    (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

    const request = new Request("http://localhost/api/categories/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Category deleted successfully");
    expect(prisma.category.delete).toHaveBeenCalled();
  });

  it("should return 400 when deleting category with documents", async () => {
    (prisma.document.count as jest.Mock).mockResolvedValue(5);

    const request = new Request("http://localhost/api/categories/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Cannot delete category with associated documents");
  });
});
