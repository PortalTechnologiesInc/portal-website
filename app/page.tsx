"use client";

import { useRef, useEffect, useState } from "react";
import { useRevealOnIntersect } from "./hooks/useRevealOnIntersect";
import { Page1 } from "./components/Page1";
import { Page2 } from "./components/Page2";
import { Page3 } from "./components/Page3";
import { Page4 } from "./components/Page4";
import { Page5 } from "./components/Page5";
import { Page6 } from "./components/Page6";
import Footer from "./components/Footer";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [isPastPage5, setIsPastPage5] = useState(false);

  useRevealOnIntersect(
    () => sectionRefs.current.filter((el, index) => el && index !== 5) as HTMLElement[]
  );

  // Dynamically disable scroll-snap when past Page 5
  useEffect(() => {
    const container = scrollContainerRef.current;
    const page5Section = sectionRefs.current[4]; // Page 5 is at index 4

    if (!container || !page5Section) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const page5Bottom = page5Section.offsetTop + page5Section.offsetHeight;
        
        // Disable snap when scroll position has passed Page 5's bottom
        // Using a small threshold (50px) to disable snap slightly before fully past Page 5
        const isPast = scrollTop >= page5Bottom - 50;
        
        setIsPastPage5((prev) => {
          if (prev !== isPast) {
            return isPast;
          }
          return prev;
        });
        
        ticking = false;
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={(el) => {
        scrollContainerRef.current = el as unknown as HTMLElement;
      }}
      className="h-dvh overflow-y-scroll overflow-x-hidden scroll-smooth snap-y"
      style={{
        scrollSnapType: isPastPage5 ? "none" : "y mandatory",
      }}
      id="main-scroll-container"
    >
      {/* Logo Yellow SVG - Shared across Page4 and Page5 */}
      <div
        data-logo-yellow
        className="fixed left-1/2 pointer-events-none"
        style={{
          transformOrigin: "center center",
          zIndex: 48,
          opacity: 0,
          top: "100vh",
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
        }}
      >
        <svg
          width="246"
          height="210"
          viewBox="0 0 246 210"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <path
            data-logo-path
            d="M174.011 1.5C174.029 17.4525 174.358 29.8097 175.814 39.3369C177.317 49.1665 180.048 56.2148 185.089 61.127C190.126 66.0356 197.249 68.5948 207.03 69.9609C216.506 71.2844 228.703 71.5115 244.313 71.5244V138.475C228.7 138.488 216.501 138.716 207.024 140.039C197.243 141.405 190.12 143.965 185.084 148.873C180.044 153.785 177.314 160.834 175.812 170.663C174.358 180.19 174.029 192.548 174.011 208.5H71.8027C71.7841 192.547 71.455 180.19 69.999 170.663C68.4968 160.833 65.7646 153.785 60.7236 148.873C55.6863 143.965 48.5641 141.405 38.7832 140.039C29.3072 138.716 17.1101 138.488 1.5 138.475V71.5244C17.1136 71.5115 29.3124 71.2845 38.7891 69.9609C48.5707 68.5948 55.693 66.0356 60.7295 61.127C65.7696 56.2148 68.4999 49.1664 70.001 39.3369C71.4559 29.8097 71.7842 17.4525 71.8027 1.5H174.011Z"
            stroke="#FFED00"
            strokeWidth="3"
          />
        </svg>
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
        className="min-h-dvh snap-start relative"
        style={{ 
          scrollSnapStop: "always", 
          zIndex: 49, 
          position: 'relative'
        }}
      >
        <Page5 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 6: Yellow Background Section */}
      <section
        ref={(el) => {
          sectionRefs.current[5] = el;
        }}
        className="min-h-dvh snap-none relative overflow-hidden"
        style={{ 
          backgroundColor: "#FFED00",
          opacity: 1
        }}
      >
        <Page6 />
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
