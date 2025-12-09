import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { eurostileFont } from "./fonts";
import { PreloadLCPImage } from "./components/PreloadLCPImage";

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
  "Your digital identity, finally protected. One app for secure social media, passwordless login, and private age verification. Zero tracking. Complete control.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getportal.cc";

export const metadata: Metadata = {
  title: "Portal | Your Identity Protected",
  description: metaDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Portal | Your Identity Protected",
    description: metaDescription,
    images: [
      {
        url: "https://preview.twenty-two.xyz/opengraph.webp",
        width: 1200,
        height: 630,
        alt: "Portal | Your Identity Protected",
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
      <head>
        <link
          rel="preload"
          href="/cross-gray.webp"
          as="image"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistMono.variable} ${openSans.variable} ${eurostileFont.variable} antialiased`}
      >
        <PreloadLCPImage />
        <Header />
        {children}
      </body>
    </html>
  );
}
