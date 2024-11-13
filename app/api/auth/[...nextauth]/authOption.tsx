import { NextAuthOptions, User } from "next-auth";
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
            appData: {
              include: {
                setting: true,
              },
            },
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
          provId: x.appData.setting?.provId ?? 0,
          kotaId: x.appData.setting?.kotaId ?? 0,
          appName: x.appData.nama,
        } as User;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.appId = user.appId;
        token.nama = user.nama;
        token.role = user.role;
        token.provId = user.provId;
        token.kotaId = user.kotaId;
        token.appName = user.appName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: Number(token.id),
        appId: Number(token.appId),
        nama: String(token.nama),
        role: String(token.role),
        provId: Number(token.provId),
        kotaId: Number(token.kotaId),
        appName: String(token.appName),
      };
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
