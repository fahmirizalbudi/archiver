import { GET, POST } from "@/app/api/documents/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    document: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
  },
}));

describe("Documents API", () => {
  it("should fetch documents with filters", async () => {
    const mockDocuments = [
      { id: 1, title: "Doc 1", description: "Desc 1", category: { name: "Cat 1" } },
    ];
    (prisma.document.findMany as jest.Mock).mockResolvedValue(mockDocuments);

    const request = new Request("http://localhost/api/documents?search=Doc");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockDocuments);
    expect(prisma.document.findMany).toHaveBeenCalled();
  });

  it("should create a new document", async () => {
    const newDoc = { id: 1, title: "New Doc", status: "ACTIVE" };
    (prisma.document.create as jest.Mock).mockResolvedValue(newDoc);
    (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

    const request = new Request("http://localhost/api/documents", {
      method: "POST",
      body: JSON.stringify({
        title: "New Doc",
        description: "Test",
        categoryId: 1,
        filePath: "/path/to/file",
        fileType: "pdf",
        fileSize: 1024,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(newDoc);
    expect(prisma.document.create).toHaveBeenCalled();
  });
});
