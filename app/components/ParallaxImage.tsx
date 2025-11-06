"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface ParallaxImageProps {
  variant?: "mobile" | "desktop";
}

export default function ParallaxImage({ variant = "mobile" }: ParallaxImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply parallax effect for mobile variant
    if (variant === "desktop") return;

    const handleScroll = () => {
      const scrollContainer = document.querySelector(
        "div.h-dvh.overflow-y-scroll"
      );
      if (!scrollContainer || !imageRef.current) return;

      const firstSection = document.querySelector("section:first-of-type");
      const secondSection = document.querySelector("section:nth-of-type(2)");

      if (!firstSection || !secondSection) return;

      const firstRect = firstSection.getBoundingClientRect();
      const secondRect = secondSection.getBoundingClientRect();

      // Calculate scroll progress between first and second page
      const totalDistance = firstRect.height + secondRect.height;
      const scrolledDistance = Math.abs(firstRect.top);

      // Progress from 0 (bottom of first page) to 1 (top of second page)
      // Apply scroll sensitivity reduction to make animations slower
      const scrollSensitivity = 0.5; // Reduce scroll sensitivity by half
      const progress = Math.min(
        Math.max((scrolledDistance * scrollSensitivity) / totalDistance, 0),
        1
      );

      // Apply parallax transform with speed multiplier
      const speedMultiplier = 3; // Image moves 1.5x faster than scroll
      const translateY = progress * -100 * speedMultiplier; // Move up faster than scroll
      imageRef.current.style.transform = `translateY(${translateY}vh)`;
    };

    const scrollContainer = document.querySelector(
      "div.h-dvh.overflow-y-scroll"
    );
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      handleScroll(); // Initial call

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [variant]);

  const isDesktop = variant === "desktop";

  return (
    <div
      ref={imageRef}
      className={
        isDesktop
          ? "relative w-full h-full pointer-events-none z-10 flex items-center justify-end"
          : "absolute bottom-0 left-0 w-full h-screen pointer-events-none z-10"
      }
      style={{
        transform: isDesktop ? "none" : "translateY(0vh)",
        transition: isDesktop ? "none" : "transform 0.1s ease-out",
      }}
    >
      <div
        className={
          isDesktop
            ? "relative w-full h-full flex items-center justify-end"
            : "relative h-full flex items-end justify-center"
        }
        style={{ transform: isDesktop ? "none" : "translateY(20%)" }}
      >
        <Image
          src="/cross-gray.png"
          alt="Parallax cross"
          width={800}
          height={800}
          className={`opacity-100 w-auto object-contain ${
            isDesktop
              ? "h-[50vh] lg:h-[60vh] xl:h-[70vh]"
              : "h-[50vh] sm:h-[60vh] md:h-[40vh] lg:h-[35rem]"
          }`}
          priority
        />
      </div>
    </div>
  );
}
