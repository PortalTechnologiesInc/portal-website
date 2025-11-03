"use client";

import { useRef, useState, useEffect } from "react";
import { useRevealOnIntersect } from "./hooks/useRevealOnIntersect";
import { Page1 } from "./components/Page1";
import { Page2 } from "./components/Page2";
import { Page3 } from "./components/Page3";
import { Page4 } from "./components/Page4";
import { Page5 } from "./components/Page5";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [svgVisible, setSvgVisible] = useState(false);

  useRevealOnIntersect(
    () => sectionRefs.current.filter(Boolean) as HTMLElement[]
  );

  // Show SVG only for Page4 and Page5
  useEffect(() => {
    const page4Section = sectionRefs.current[3];
    const page5Section = sectionRefs.current[4];
    if (!page4Section || !page5Section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const page4Entry = entries.find(entry => entry.target === page4Section);
        const page5Entry = entries.find(entry => entry.target === page5Section);
        
        const isPage4Visible = page4Entry?.isIntersecting && page4Entry.intersectionRatio >= 0.5;
        const isPage5Visible = page5Entry?.isIntersecting && page5Entry.intersectionRatio >= 0.5;
        
        // Show SVG when either Page4 or Page5 is visible
        if (isPage4Visible || isPage5Visible) {
          setSvgVisible(true);
        } else {
          setSvgVisible(false);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: [0, 0.5, 1],
      }
    );

    observer.observe(page4Section);
    observer.observe(page5Section);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={(el) => {
        scrollContainerRef.current = el as unknown as HTMLElement;
      }}
      className="h-dvh overflow-y-scroll overflow-x-hidden scroll-smooth snap-y snap-mandatory"
      id="main-scroll-container"
    >
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

      {/* Fixed Yellow SVG Logo - Shared between Page4 and Page5 */}
      <div
        className="fixed z-40 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: svgVisible ? "950px" : "20px",
          opacity: svgVisible ? 1 : 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 246 210"
          style={{ width: "100%", height: "auto", display: "block" }}
          role="img"
          aria-label="Portal yellow logo"
        >
          <path
            d="M174.011 1.5C174.029 17.4525 174.358 29.8097 175.814 39.3369C177.317 49.1665 180.048 56.2148 185.089 61.127C190.126 66.0356 197.249 68.5948 207.03 69.9609C216.506 71.2844 228.703 71.5115 244.313 71.5244V138.475C228.7 138.488 216.501 138.716 207.024 140.039C197.243 141.405 190.12 143.965 185.084 148.873C180.044 153.785 177.314 160.834 175.812 170.663C174.358 180.19 174.029 192.548 174.011 208.5H71.8027C71.7841 192.547 71.455 180.19 69.999 170.663C68.4968 160.833 65.7646 153.785 60.7236 148.873C55.6863 143.965 48.5641 141.405 38.7832 140.039C29.3072 138.716 17.1101 138.488 1.5 138.475V71.5244C17.1136 71.5115 29.3124 71.2845 38.7891 69.9609C48.5707 68.5948 55.693 66.0356 60.7295 61.127C65.7696 56.2148 68.4999 49.1664 70.001 39.3369C71.4559 29.8097 71.7842 17.4525 71.8027 1.5H174.011Z"
            stroke="#FFED00"
            strokeWidth={svgVisible ? 1.2 : 3}
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>

    </div>
  );
}
