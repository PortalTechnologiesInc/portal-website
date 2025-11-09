"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full h-dvh bg-black text-white flex items-center justify-center">
      <div className="mx-auto max-w-screen-2xl sm:pl-12 w-full">
        <div className="flex flex-col md:flex-row gap-16 md:gap-20">
          {/* Discover the future section */}
          <div className="flex flex-col gap-8 md:gap-10 pl-8">
            <h3 className="text-2xl md:text-2xl font-medium">Discover the future</h3>
            <div className="flex flex-col gap-6 md:gap-8 ml-4">
              <a
                href="#paradox"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                The Paradox
              </a>
              <a
                href="#advantages"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                [not] Advantages
              </a>
              <a
                href="#cycle"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Break the cycle
              </a>
              <a
                href="#real-advantages"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Real Advantages
              </a>
            </div>
          </div>

          {/* Take action section */}
          <div className="flex flex-col gap-8 md:gap-10 pl-8">
            <h3 className="text-2xl md:text-2xl font-medium">Take action</h3>
            <div className="flex flex-col gap-6 md:gap-8 ml-4">
              <a
                href="#download-daily"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Download for Daily life usage
              </a>
              <a
                href="#download-business"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Download for your Business
              </a>
            </div>
          </div>

          {/* Know P+RTAL Technologies section */}
          <div className="flex flex-col gap-8 md:gap-10 pl-8">
            <h3 className="text-2xl md:text-2xl font-medium">Know P+RTAL Technologies</h3>
            <div className="flex flex-col gap-6 md:gap-8 ml-4">
              <a
                href="#founders"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                A word of the founders
              </a>
            </div>
          </div>

          {/* Follow Us section */}
          <div className="flex flex-col gap-8 md:gap-10 pl-8">
            <h3 className="text-2xl md:text-2xl font-medium">Follow Us</h3>
            <div className="flex flex-col gap-6 md:gap-8 ml-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Instagram
              </a>
              <a
                href="#nostr"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Nostr
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                X/Twitter
              </a>
            </div>
          </div>
        </div>
        
        {/* Logo at the end */}
        <div className="mt-16 md:mt-32 flex justify-center items-center w-full">
          <Link href="/" aria-label="Portal Home" className="flex justify-center w-full max-w-4xl">
            <Image
              src="/logo.svg"
              alt="Portal Logo"
              width={150}
              height={200}
              className="invert w-full h-auto"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}

