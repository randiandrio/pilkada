import NextAuth from "next-auth";

declare module "next-auth" {
  interface AdminLogin {
    id: Number;
    appId: Number;
    nama: String;
    role: String;
    appName: String;
  }

  interface resData {
    error: boolean;
    message: String;
  }
}
