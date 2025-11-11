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

const metaDescription =
  "The next revolution is now. Skip the fees with P+RTAL and get the highest security ever.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getportal.cc";

export const metadata: Metadata = {
  title: "Portal | Trust Nothing",
  description: metaDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Portal | Trust Nothing",
    description: metaDescription,
    images: [
      {
        url: "https://preview.twenty-two.xyz/opengraph.webp",
        width: 1200,
        height: 630,
        alt: "Portal | Trust Nothing",
      },
    ],
  },
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
