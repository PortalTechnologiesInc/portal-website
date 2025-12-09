"use client";

import { useRef, useEffect, useState } from "react";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page4({ scrollContainerRef }: Props) {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const page4ContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = page4ContainerRef.current;
    const scrollContainerEl = scrollContainerRef.current;
    const page4Section = container?.closest("section");

    if (!container || !scrollContainerEl || !page4Section) return;

    // Observer for Page4
    const page4Observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        if (isIntersecting && intersectionRatio >= 0.5) {
          setIsTextVisible(true);
        } else {
          setIsTextVisible(false);
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    page4Observer.observe(page4Section);

    return () => {
      page4Observer.disconnect();
    };
  }, [scrollContainerRef]);

  return (
    <div ref={page4ContainerRef} className="relative w-full h-full flex flex-col items-center justify-center px-6">
      {/* Text Content */}
      <div className="text-center md:text-left md:max-w-5xl lg:max-w-6xl relative z-50">
        <h1
          className="font-eurostile xxs:text-4xl font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-white md:text-center md:w-full"
          style={{
            opacity: isTextVisible ? 1 : 0,
            transform: isTextVisible ? "translateY(0px)" : "translateY(12px)",
            transition: "opacity 1000ms ease-in-out, transform 1000ms ease-out",
          }}
        >
          ONE IDENTITY,
          <br />
          INFINITE POSSIBILITIES
        </h1>

        <p
          className="md:text-center mt-4 md:mt-6 text-2xl md:text-3xl lg:text-[2rem] opacity-90 text-white leading-snug md:max-w-4xl lg:max-w-full"
          style={{
            opacity: isTextVisible ? 0.9 : 0,
            transform: isTextVisible ? "translateY(0px)" : "translateY(12px)",
            transition: "opacity 1000ms ease-in-out, transform 1000ms ease-out",
          }}
        >
          Social media, service login, age verification - all protected by cryptography and Nostr
        </p>
      </div>
    </div>
  );
}
