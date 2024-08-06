import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        hp: {
          label: "No Handphone",
          type: "text",
          placeholder: "No Handphone",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "pa$$word",
        },
      },
      async authorize(credentials) {
        const x = await prisma.admin.findUnique({
          where: {
            hp: credentials!.hp,
          },
          include: {
            appData: true,
          },
        });

        if (!x) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials!.password, x.password);

        if (!isValid) return null;

        return {
          id: x.id,
          appId: x.appId,
          nama: x.nama,
          role: x.role,
          appName: x.appData.nama,
        } as any;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session = token as any;
      return session;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // detik
    updateAge: 60 * 60, // detik
  },
};
