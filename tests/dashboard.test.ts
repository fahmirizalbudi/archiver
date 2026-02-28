import { GET } from "@/app/api/dashboard/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    document: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("Dashboard API", () => {
  it("should fetch dashboard statistics", async () => {
    (prisma.document.count as jest.Mock)
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(2);  // archived
    
    (prisma.document.findMany as jest.Mock).mockResolvedValue([
      { id: 1, title: "Recent Doc", category: { name: "Test" } }
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.totalDocuments).toBe(10);
    expect(data.archivedDocuments).toBe(2);
    expect(data.recentDocuments).toHaveLength(1);
    expect(prisma.document.count).toHaveBeenCalledTimes(2);
    expect(prisma.document.findMany).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    (prisma.document.count as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });
});
