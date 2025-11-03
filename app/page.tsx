"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRevealOnIntersect } from "./hooks/useRevealOnIntersect";
import { Page1 } from "./components/Page1";
import { Page2 } from "./components/Page2";
import { Page3 } from "./components/Page3";
import { Page4 } from "./components/Page4";
import { Page5 } from "./components/Page5";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useRevealOnIntersect(
    () => sectionRefs.current.filter(Boolean) as HTMLElement[]
  );

  return (
    <div
      ref={(el) => {
        scrollContainerRef.current = el as unknown as HTMLElement;
      }}
      className="h-dvh overflow-y-scroll overflow-x-hidden scroll-smooth snap-y snap-mandatory"
      id="main-scroll-container"
    >
      {/* Logo Yellow SVG - Shared across Page4 and Page5 */}
      <div
        data-logo-yellow
        className="fixed left-1/2 pointer-events-none"
        style={{
          transformOrigin: "center center",
          zIndex: 9999,
          opacity: 0,
          top: "100vh",
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
        }}
      >
        <Image
          src="/LOGO-YELLOW.svg"
          alt="Logo Yellow"
          width={200}
          height={200}
          className="w-auto h-auto"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      {/* Page 1: Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="relative min-h-dvh snap-start bg-white text-[#141416] pt-20"
        style={{ scrollSnapStop: "always" }}
      >
        <Page1 />
      </section>

      {/* Page 2: Payments Section */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="min-h-dvh snap-start text-white px-6 relative z-40 pt-28 md:pt-36"
        style={{ scrollSnapStop: "always" }}
      >
        <Page2 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 3: Horizontal Carousel Section */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="min-h-dvh snap-start text-white relative z-40"
        style={{ scrollSnapStop: "always" }}
      >
        <Page3 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 4: Solution Section */}
      <section
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        className="min-h-dvh snap-start text-white relative z-40"
        style={{ scrollSnapStop: "always" }}
      >
        <Page4 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 5: Final Section */}
      <section
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        className="min-h-dvh snap-start relative z-40"
        style={{ scrollSnapStop: "always" }}
      >
        <Page5 scrollContainerRef={scrollContainerRef} />
      </section>

    </div>
  );
}
