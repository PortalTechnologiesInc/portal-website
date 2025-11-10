"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ContactCarousel from "./ContactCarousel";
import ParallaxImage from "./ParallaxImage";

export function Page1() {
  const [showDesktopCarousel, setShowDesktopCarousel] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.querySelector("section[data-section='page1']");
    if (!section) return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateVisibility = () => {
      if (!mediaQuery.matches) {
        setShowDesktopCarousel(true);
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isVisible = rect.top < viewportHeight && rect.bottom > 0;
      setShowDesktopCarousel(isVisible);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!mediaQuery.matches) return;
        const isVisible = entries.some((entry) => entry.isIntersecting);
        setShowDesktopCarousel(isVisible);
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    mediaQuery.addEventListener("change", updateVisibility);
    updateVisibility();

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateVisibility);
    };
  }, []);

  return (
    <>
      {/* Background SVG Vector - Mobile (original working state) */}
      <div className="absolute inset-0 flex md:hidden items-center justify-center pointer-events-none">
        <Image
          src="/yellowvec.svg"
          alt=""
          width={300}
          height={300}
          className=""
          style={{ minWidth: "210%", minHeight: "210%" }}
          priority
        />
      </div>

      {/* Background SVG Vector - Desktop (clip bottom 50%) */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 hidden md:flex items-start justify-center pointer-events-none z-20 w-screen lg:max-w-[120rem] lg:mx-auto">
        <Image
          src="/yellowvec.svg"
          alt=""
          width={1200}
          height={1200}
          className="w-[100vw] lg:w-[150vw] xl:w-[95vw] h-auto object-contain object-top mt-10"
          style={{ clipPath: "inset(0 0 50% 0)" }}
          priority
        />
      </div>

      {/* Desktop Layout: Content + Image side by side, vertically centered */}
      <div className="relative z-50 h-full flex flex-col md:flex-row md:items-center md:justify-between px-6 md:max-w-[98rem] md:mx-auto pt-8 xxs:pt-0 md:pt-0">
        {/* Left side: Text content */}
        <div className="text-left max-w-4xl md:max-w-2xl lg:max-w-3xl relative z-50">
          <h1 className="text-5xl xxs:text-4xl md:text-7xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight font-eurostile page1-title-mobile">
            BE THE ONE IN CONTROL, <span className="md:whitespace-nowrap">TRUST NOTHING</span>
          </h1>
          <p className="text-2xl md:text-xl lg:text-3xl font-normal mb-8 max-w-2xl leading-tight">
            The next revolution is now,
            <br />
            Skip the fees with P+RTAL
            <br />
            and get the highest security ever
          </p>
          <button
            type="button"
            className="text-white px-4 py-2 text-lg font-semibold transition-colors duration-200"
            style={{ backgroundColor: "#141416" }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = "#1a1a1c";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = "#141416";
            }}
          >
            Discover More
          </button>
        </div>

        {/* Right side: Parallax Image (desktop only) */}
        <div className="hidden md:block md:flex-shrink-0 md:relative md:w-1/2 lg:w-3/7 md:h-full md:flex md:items-center md:justify-end">
          <ParallaxImage variant="desktop" />
        </div>
      </div>

      {/* Mobile: Parallax Image positioned at bottom */}
      <div className="md:hidden">
        <ParallaxImage variant="mobile" />
      </div>

      {/* Contact Carousel - Desktop: under header, Mobile: at bottom */}
      <div
        className={`md:fixed md:top-14 md:left-0 md:right-0 md:z-[9999] ${
          showDesktopCarousel ? "" : "md:hidden"
        }`}
      >
        <ContactCarousel />
      </div>
    </>
  );
}
