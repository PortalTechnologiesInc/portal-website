"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [onLightBackground, setOnLightBackground] = useState(false);

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    // IntersectionObserver-based color switch for performance
    const scrollContainer = (document.querySelector(
      "div.h-dvh.overflow-y-scroll"
    ) || null) as HTMLElement | null;

    const sections = Array.from(
      document.querySelectorAll("section")
    ) as HTMLElement[];
    const firstSection = sections[0];
    const secondSection = sections[1];

    if (!firstSection || !secondSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const headerHeight = 56; // h-14
        const lead = 56; // start at header height for instant switch

        const rootTop = entries[0]?.rootBounds ? entries[0].rootBounds.top : 0;
        const triggerY = rootTop + headerHeight;

        let firstActive = false;
        let secondActive = false;

        for (const entry of entries) {
          const top = entry.boundingClientRect.top;
          const bottom = entry.boundingClientRect.bottom;

          if (entry.target === firstSection) {
            const y = triggerY - lead;
            firstActive = top <= y && bottom > y;
          } else if (entry.target === secondSection) {
            const y = triggerY + lead;
            secondActive = top <= y && bottom > y;
          }
        }

        if (secondActive) setOnLightBackground(true);
        else if (firstActive) setOnLightBackground(false);
      },
      {
        root: scrollContainer || null,
        threshold: [0, 1],
      }
    );

    observer.observe(firstSection);
    observer.observe(secondSection);

    // Add a tiny rAF-throttled scroll handler to remove any perceived IO delay
    const handleScroll = () => {
      const headerHeight = 56;
      const lead = 56;
      const containerRect = (
        scrollContainer || document.documentElement
      ).getBoundingClientRect();
      const triggerY = containerRect.top + headerHeight;

      const firstRect = firstSection.getBoundingClientRect();
      const secondRect = secondSection.getBoundingClientRect();

      const firstActive =
        firstRect.top <= triggerY - lead && firstRect.bottom > triggerY - lead;
      const secondActive =
        secondRect.top <= triggerY + lead &&
        secondRect.bottom > triggerY + lead;

      if (secondActive) setOnLightBackground(true);
      else if (firstActive) setOnLightBackground(false);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    (scrollContainer || window).addEventListener("scroll", onScroll, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("resize", onScroll, {
      passive: true,
    } as AddEventListenerOptions);
    handleScroll();

    return () => {
      observer.disconnect();
      (scrollContainer || window).removeEventListener(
        "scroll",
        onScroll as EventListener
      );
      window.removeEventListener("resize", onScroll as EventListener);
    };
  }, []);

  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-2xl">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          <Link
            href="/"
            className={`select-none inline-flex items-center transition-colors duration-300 ${
              onLightBackground ? "text-black" : "text-white"
            }`}
            aria-label="Portal Home"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={150}
              height={22}
              priority
              className={`transition duration-300 ${
                onLightBackground ? "" : "invert"
              }`}
            />
          </Link>

          {/* mobile star toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden shrink-0 h-10 w-10 inline-flex items-center justify-center bg-transparent text-xl"
          >
            <Image
              src="/asterisk.svg"
              alt=""
              width={22}
              height={22}
              aria-hidden
              className={`transition-transform duration-300 will-change-transform inline-block ${
                onLightBackground ? "" : "invert"
              } ${open ? "rotate-90" : "rotate-0"}`}
            />
          </button>

          {/* desktop nav */}
          <nav
            className={`hidden md:flex items-center gap-8 text-sm transition-colors duration-300 ${
              onLightBackground ? "text-black" : "text-white"
            }`}
          >
            <Link
              href="#banking"
              className="hover:underline underline-offset-4"
            >
              The Banking System and Wallet Paradox
            </Link>
            <Link
              href="#download"
              className="hover:underline underline-offset-4"
            >
              Download
            </Link>
            <Link href="#know" className="hover:underline underline-offset-4">
              Know PORTAL
            </Link>
          </nav>
        </div>
      </div>

      {/* mobile dropdown wrapper covers full viewport minus header */}
      <div
        className={`md:hidden fixed inset-x-0 top-14 z-40 h-[calc(100dvh-56px)] ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* backdrop below header (transparent w/ strong blur) */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className={`absolute inset-0 z-[40] transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* animated panel fills from under header to bottom with skew/scale */}
        <div
          className={`absolute inset-0 z-[41] mx-auto max-w-screen-2xl px-4 sm:px-6 flex flex-col h-full transform-gpu transition-transform duration-500 ease-out will-change-transform ${
            open ? "scale-y-100 skew-y-0" : "scale-y-0 skew-y-3"
          }`}
          style={{ transformOrigin: "top" }}
        >
          <div
            className={`flex-1 rounded-t-md transition-colors duration-300 ${
              onLightBackground ? "text-black" : "text-white"
            }`}
          >
            {/* links (not scrollable) */}
            <div className="divide-y-8 divide-transparent pt-6 px-4 sm:px-6">
              <div
                className={`my-16 py-5 border-b-2 transition-colors duration-300 ${
                  onLightBackground ? "border-black/70" : "border-white/70"
                }`}
              >
                <Link
                  href="#banking"
                  className="flex items-center justify-between"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-left text-lg font-medium underline underline-offset-4">
                    The Banking System and Wallet Paradox
                  </span>
                  <span aria-hidden className="text-2xl">
                    ↗
                  </span>
                </Link>
              </div>
              <div
                className={`my-16 py-5 border-b-2 transition-colors duration-300 ${
                  onLightBackground ? "border-black/70" : "border-white/70"
                }`}
              >
                <Link
                  href="#download"
                  className="flex items-center justify-between"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-left text-lg font-medium underline underline-offset-4">
                    Download
                  </span>
                  <span aria-hidden className="text-2xl">
                    ↗
                  </span>
                </Link>
              </div>
              <div
                className={`my-16 py-5 border-b-2 transition-colors duration-300 ${
                  onLightBackground ? "border-black/70" : "border-white/70"
                }`}
              >
                <Link
                  href="#know"
                  className="flex items-center justify-between"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-left text-lg font-medium underline underline-offset-4">
                    Know Portal
                  </span>
                  <span aria-hidden className="text-2xl">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* social footer pinned bottom with extra bottom margin */}
          <div
            className={`py-6 px-4 sm:px-6 mb-4 flex items-center justify-between border-b-2 transition-colors duration-300 ${
              onLightBackground
                ? "border-black/70 text-black"
                : "border-white/70 text-white"
            }`}
          >
            <span className="text-base font-medium">Follow us</span>
            <div className="flex items-center gap-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
                className="underline decoration-2 underline-offset-4"
              >
                Instagram
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                aria-label="X"
                className="underline decoration-2 underline-offset-4"
              >
                X
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
