"use client";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Template from "./component/Template";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const disbleTemplate: string[] = ["/login", "/food"];

  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider>
          {disbleTemplate.some((x) => pathname.startsWith(x)) ? (
            children
          ) : (
            <Template>{children}</Template>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
