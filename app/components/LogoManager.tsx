"use client";

import { useEffect } from "react";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function LogoManager({ scrollContainerRef }: Props) {
  useEffect(() => {
    const scrollContainerEl = scrollContainerRef.current;
    const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
    const logoPath = document.querySelector('[data-logo-path]') as SVGPathElement;

    if (!scrollContainerEl || !logoYellow) return;

    // Find Page4 and Page5 sections by data-page attribute and position
    const page4Section = document.querySelector('[data-page="page4"]')?.closest('section') as HTMLElement;
    const allSections = Array.from(document.querySelectorAll('section')) as HTMLElement[];
    const page4Index = page4Section ? allSections.indexOf(page4Section) : -1;
    const page5Section = page4Index >= 0 && page4Index + 1 < allSections.length ? allSections[page4Index + 1] : null;

    if (!page4Section) return;

    const checkAndUpdateLogo = () => {
      const viewportHeight = scrollContainerEl.clientHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Check if Page4 is significantly visible
      const page4Rect = page4Section.getBoundingClientRect();
      const page4Top = page4Rect.top;
      const page4Bottom = page4Rect.bottom;
      const page4Visible = page4Top < viewportCenter && page4Bottom > viewportCenter;
      
      // Check if Page5 is significantly visible
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
      () => {
        checkAndUpdateLogo();
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    // Observer for Page5
    const page5Observer = page5Section ? new IntersectionObserver(
      () => {
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

    // Initial check with a small delay to ensure DOM is ready
    setTimeout(() => {
      checkAndUpdateLogo();
    }, 100);

    return () => {
      page4Observer.disconnect();
      if (page5Observer) {
        page5Observer.disconnect();
      }
      scrollContainerEl.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef]);

  return null; // This component doesn't render anything
}

