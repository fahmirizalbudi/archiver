import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export const authorize = async (credentials: Record<"username" | "password", string> | undefined) => {
  if (!credentials?.username || !credentials?.password) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { username: credentials.username },
  });

  if (!admin) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    admin.passwordHash
  );

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: admin.id.toString(),
    name: admin.username,
    username: admin.username,
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
};
