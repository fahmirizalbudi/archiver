import { GET } from "@/app/api/activity-log/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    activityLog: {
      findMany: jest.fn(),
    },
  },
}));

describe("Activity Log API", () => {
  it("should fetch activity logs", async () => {
    const mockLogs = [
      { id: 1, action: "Test Action", timestamp: new Date(), document: null },
    ];
    (prisma.activityLog.findMany as jest.Mock).mockResolvedValue(mockLogs);

    const request = new Request("http://localhost/api/activity-log?limit=10");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].action).toBe("Test Action");
    expect(prisma.activityLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
      })
    );
  });

  it("should handle errors", async () => {
    (prisma.activityLog.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const request = new Request("http://localhost/api/activity-log");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });
});
