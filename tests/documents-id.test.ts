import { GET, PUT, DELETE } from "@/app/api/documents/[id]/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    document: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    activityLog: {
      updateMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Document ID API", () => {
  it("should fetch a document by ID", async () => {
    const mockDoc = { id: 1, title: "Doc 1", category: { name: "Test" } };
    (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDoc);

    const request = new Request("http://localhost/api/documents/1");
    const response = await GET(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe(1);
    expect(prisma.document.findUnique).toHaveBeenCalled();
  });

  it("should update a document", async () => {
    const updatedDoc = { id: 1, title: "Updated Title" };
    (prisma.document.update as jest.Mock).mockResolvedValue(updatedDoc);
    (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

    const request = new Request("http://localhost/api/documents/1", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated Title" }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe("Updated Title");
    expect(prisma.document.update).toHaveBeenCalled();
  });

  it("should delete a document", async () => {
    (prisma.activityLog.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.document.delete as jest.Mock).mockResolvedValue({});
    (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

    const request = new Request("http://localhost/api/documents/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Document deleted successfully");
    expect(prisma.activityLog.updateMany).toHaveBeenCalled();
    expect(prisma.document.delete).toHaveBeenCalled();
  });

  it("should return 404 if document not found for deletion", async () => {
    const error: any = new Error("Not found");
    error.code = "P2025";
    (prisma.activityLog.updateMany as jest.Mock).mockResolvedValue({ count: 0 });
    (prisma.document.delete as jest.Mock).mockRejectedValue(error);

    const request = new Request("http://localhost/api/documents/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Document not found");
  });
});
