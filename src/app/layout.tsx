import type { Metadata } from "next";
import Link from 'next/link'
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Video to cheatsheet",
  description: "Convert YouTube videos to cheatsheets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-primary text-primary-foreground p-4">
          <Link href="/" className="text-2xl font-bold hover:underline">
            Video to Cheatsheet
          </Link>
        </header>
        <main>
        {children}
        <Toaster />
        </main>
      </body>
    </html>
  );
}
