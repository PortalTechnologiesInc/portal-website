import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { eurostileFont } from "./fonts";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Portal | Trust Nothing",
  description: "Portal | Trust Nothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${openSans.variable} ${eurostileFont.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
