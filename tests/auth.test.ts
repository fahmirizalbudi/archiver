import { authorize, authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    admin: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

describe("Auth Logic", () => {
  it("should authorize with valid credentials", async () => {
    const mockAdmin = {
      id: 1,
      username: "admin",
      passwordHash: "hashed_password",
    };

    (prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const user = await authorize({
      username: "admin",
      password: "password123",
    });

    expect(user).toEqual({
      id: "1",
      name: "admin",
      username: "admin",
    });
    expect(prisma.admin.findUnique).toHaveBeenCalledWith({
      where: { username: "admin" },
    });
  });

  it("should return null with invalid password", async () => {
    const mockAdmin = {
      id: 1,
      username: "admin",
      passwordHash: "hashed_password",
    };

    (prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const user = await authorize({
      username: "admin",
      password: "wrong_password",
    });

    expect(user).toBeNull();
  });

  it("should return null if admin not found", async () => {
    (prisma.admin.findUnique as jest.Mock).mockResolvedValue(null);

    const user = await authorize({
      username: "nonexistent",
      password: "password123",
    });

    expect(user).toBeNull();
  });

  it("should return null if credentials missing", async () => {
    const user = await authorize({});
    expect(user).toBeNull();
  });
});
