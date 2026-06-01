import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SocketProvider } from "@/components/providers/socket-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VedaAI — AI Assessment Creator",
  description: "Create and manage AI-generated assessments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.variable} ${inter.className} min-h-full flex flex-col`}>
        <SocketProvider>{children}</SocketProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
