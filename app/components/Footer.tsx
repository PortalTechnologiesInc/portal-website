"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full h-full bg-black text-white flex flex-col items-center overflow-y-auto">
      {/* Main content - centered */}
      <div className="mx-auto max-w-screen-2xl w-full sm:pl-12 flex flex-col flex-1 justify-center md:py-12 z-10 pt-[3rem] md:pt-12 xxs:pt-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-20 flex-shrink-0 xxs:gap-6">
          {/* Discover the future section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Discover the future</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="#paradox"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                The Paradox
              </a>
              <a
                href="#advantages"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                [not] Advantages
              </a>
              <a
                href="#cycle"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Break the cycle
              </a>
              <a
                href="#real-advantages"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Real Advantages
              </a>
            </div>
          </div>

          {/* Take action section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Take action</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="#download-daily"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Download for Daily life usage
              </a>
              <a
                href="#download-business"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Download for your Business
              </a>
            </div>
          </div>

          {/* Know P+RTAL Technologies section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Know P+RTAL Technologies</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="#founders"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                A word of the founders
              </a>
            </div>
          </div>

          {/* Follow Us section */}
          <div className="flex flex-col gap-4 md:gap-8 lg:gap-10 pl-4 md:pl-8 xxs:gap-3">
            <h3 className="text-xl md:text-2xl font-medium xxs:text-lg">Follow Us</h3>
            <div className="flex flex-col gap-3 md:gap-6 lg:gap-8 ml-2 md:ml-4 xxs:gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Instagram
              </a>
              <a
                href="#nostr"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                Nostr
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity xxs:text-sm"
              >
                X/Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logo block - fills remaining space, centers logo */}
      <div className="flex-1 flex justify-center items-center w-full min-h-0">
        <Link href="/" aria-label="Portal Home" className="flex justify-center items-center w-full max-w-4xl px-4">
          <Image
            src="/logo.svg"
            alt="Portal Logo"
            width={150}
            height={200}
            className="invert w-auto max-h-[40vh] object-contain"
          />
        </Link>
      </div>
    </footer>
  );
}

