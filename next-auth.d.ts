import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: Number;
    appId: Number;
    nama: String;
    role: String;
    provId: Number;
    kotaId: Number;
    appName: String;
  }

  interface Session {
    user: {
      id: Number;
      appId: Number;
      nama: String;
      role: String;
      provId: Number;
      kotaId: Number;
      appName: String;
    };
  }

  interface JWT {
    id: Number;
    appId: Number;
    nama: String;
    role: String;
    provId: Number;
    kotaId: Number;
    appName: String;
  }

  interface resData {
    error: boolean;
    message: String;
  }
}
