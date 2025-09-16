"use client";

import { useEffect, useState } from "react";

export default function ContactCarousel() {
  const text =
    "Get in touch to know more about the P+RTAL potential to your business, private and public events";
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(
        "div.h-dvh.overflow-y-scroll"
      );
      if (!scrollContainer) return;

      const firstSection = document.querySelector("section:first-of-type");
      const secondSection = document.querySelector("section:nth-of-type(2)");

      if (!firstSection || !secondSection) return;

      const firstRect = firstSection.getBoundingClientRect();
      const secondRect = secondSection.getBoundingClientRect();

      // Hide carousel when second section is visible
      const shouldHide = secondRect.top < window.innerHeight * 0.5;
      setIsVisible(!shouldHide);
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
  }, []);

  if (!isVisible) return null;

  return (
    <div className="w-full h-[2.875rem] backdrop-blur-[0.625rem] bg-white/10 overflow-hidden flex items-center fixed bottom-0 left-0 z-[999]">
      <div className="whitespace-nowrap animate-scroll">
        <span className="text-black text-sm font-normal mr-8">{text}</span>
        <span className="text-black text-sm font-normal mr-8">{text}</span>
        <span className="text-black text-sm font-normal mr-8">{text}</span>
      </div>
    </div>
  );
}
