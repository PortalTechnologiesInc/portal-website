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
    const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
    const logoPath = document.querySelector('[data-logo-path]') as SVGPathElement;
    const page4Section = container?.closest("section");

    if (!container || !scrollContainerEl || !logoYellow || !page4Section) return;

    // Get Page5 section to check if it's visible
    const page5Section = page4Section.nextElementSibling as HTMLElement;

    const checkAndUpdateLogo = () => {
      const page4Rect = page4Section.getBoundingClientRect();
      const viewportHeight = scrollContainerEl.clientHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Check if Page4 is significantly visible (more than just a small edge)
      const page4Top = page4Rect.top;
      const page4Bottom = page4Rect.bottom;
      const page4Visible = page4Top < viewportCenter && page4Bottom > viewportCenter;
      
      let page5Visible = false;
      if (page5Section) {
        const page5Rect = page5Section.getBoundingClientRect();
        const page5Top = page5Rect.top;
        const page5Bottom = page5Rect.bottom;
        page5Visible = page5Top < viewportCenter && page5Bottom > viewportCenter;
      }

      // Show logo only if Page4 or Page5 is significantly visible in viewport
      if (page4Visible || page5Visible) {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const largeSize = isMobile ? "600px" : "900px";
        
        logoYellow.style.opacity = "1";
        logoYellow.style.top = "50vh";
        logoYellow.style.transform = "translate(-50%, -50%)";
        logoYellow.style.width = largeSize;
        logoYellow.style.height = largeSize;
        logoYellow.style.zIndex = "30";
        logoYellow.style.clipPath = "inset(10% 5% 10% 5%)";
        logoYellow.style.transition = "none";
        
        if (logoPath) {
          logoPath.style.strokeWidth = "1.2";
          logoPath.style.transition = "none";
        }
      } else {
        // Hide logo when neither Page4 nor Page5 is significantly visible
        logoYellow.style.opacity = "0";
        logoYellow.style.transition = "none";
      }
    };

    // Observer for Page4
    const page4Observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        if (isIntersecting && intersectionRatio >= 0.5) {
          checkAndUpdateLogo();
          setIsTextVisible(true);
        } else {
          checkAndUpdateLogo(); // Check if Page5 is visible
          setIsTextVisible(false);
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    // Observer for Page5 to keep logo visible when Page5 is active
    const page5Observer = page5Section ? new IntersectionObserver(
      (entries) => {
        checkAndUpdateLogo();
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    ) : null;

    page4Observer.observe(page4Section);
    if (page5Section && page5Observer) {
      page5Observer.observe(page5Section);
    }

    // Add scroll listener to continuously check visibility
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkAndUpdateLogo();
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainerEl.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    checkAndUpdateLogo();

    return () => {
      page4Observer.disconnect();
      if (page5Observer) {
        page5Observer.disconnect();
      }
      scrollContainerEl.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <div ref={page4ContainerRef} className="relative w-full h-full flex flex-col items-center justify-center px-6">
      {/* Text Content */}
      <div className="text-center relative z-50">
        <h1
          className="font-eurostile font-bold tracking-tight text-5xl md:text-6xl lg:text-6xl text-white"
          style={{
            opacity: isTextVisible ? 1 : 0,
            transform: isTextVisible ? "translateY(0px)" : "translateY(12px)",
            transition: "opacity 1000ms ease-in-out, transform 1000ms ease-out",
          }}
        >
          BREAK THE CYCLE,
          <br />
          SKIP THE THIRD WHEEL
        </h1>

        <p
          className="mt-3 text-2xl md:text-xl lg:text-2xl opacity-90 text-white"
          style={{
            opacity: isTextVisible ? 0.9 : 0,
            transform: isTextVisible ? "translateY(0px)" : "translateY(12px)",
            transition: "opacity 1000ms ease-in-out, transform 1000ms ease-out",
          }}
        >
          A peer-to-peer system for direct business-to-customer communication
        </p>
      </div>
    </div>
  );
}

// Export utility function for Page5 to reset logo
export function resetLogoYellow() {
  const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
  const logoPath = document.querySelector('[data-logo-path]') as SVGPathElement;
  if (logoYellow) {
    logoYellow.style.opacity = "0";
    logoYellow.style.top = "100vh";
    logoYellow.style.transform = "translate(-50%, -50%)";
    logoYellow.style.width = "40px";
    logoYellow.style.height = "40px";
    logoYellow.style.transition = "none";
  }
  if (logoPath) {
    logoPath.style.strokeWidth = "3";
    logoPath.style.transition = "none";
  }
}
