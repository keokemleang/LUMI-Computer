import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const googleEnabled =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password ?? "";
          if (!email || !password) return null;
          const user = await db.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;
          const ok = verifyPassword(password, user.password);
          if (!ok) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          } as any;
        } catch (e) {
          console.error("[auth] authorize error:", e);
          return null;
        }
      },
    }),
    ...(googleEnabled
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async signIn({ user }) {
      // For Google sign-in, ensure the user exists in the DB.
      if (user?.email) {
        const existing = await db.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          await db.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: "customer",
            },
          });
        }
      }
      return true;
    },
  },
};
