"use client";

import { useEffect, useRef } from "react";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function LogoManager({ scrollContainerRef }: Props) {
  const lastScrollTopRef = useRef(0);
  const currentPageRef = useRef<'page4' | 'page5' | null>(null);

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
      const currentScrollTop = scrollContainerEl.scrollTop;
      const scrollDirection = currentScrollTop > lastScrollTopRef.current ? 'down' : currentScrollTop < lastScrollTopRef.current ? 'up' : null;
      lastScrollTopRef.current = currentScrollTop;

      const viewportHeight = scrollContainerEl.clientHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Check if Page4 is significantly visible
      const page4Rect = page4Section.getBoundingClientRect();
      const page4Top = page4Rect.top;
      const page4Bottom = page4Rect.bottom;
      const page4Center = page4Top + (page4Bottom - page4Top) / 2;
      const page4Visible = page4Top < viewportCenter && page4Bottom > viewportCenter;
      
      // Check if Page5 is significantly visible
      let page5Visible = false;
      let page5Center = 0;
      if (page5Section) {
        const page5Rect = page5Section.getBoundingClientRect();
        const page5Top = page5Rect.top;
        const page5Bottom = page5Rect.bottom;
        page5Center = page5Top + (page5Bottom - page5Top) / 2;
        page5Visible = page5Top < viewportCenter && page5Bottom > viewportCenter;
      }

      // Determine current page
      let currentPage: 'page4' | 'page5' | null = null;
      if (page4Visible && page5Visible) {
        // Both visible - determine which is more centered
        const page4Distance = Math.abs(page4Center - viewportCenter);
        const page5Distance = Math.abs(page5Center - viewportCenter);
        currentPage = page4Distance < page5Distance ? 'page4' : 'page5';
      } else if (page4Visible) {
        currentPage = 'page4';
      } else if (page5Visible) {
        currentPage = 'page5';
      }

      // Show logo only if Page4 or Page5 is significantly visible in viewport
      if (page4Visible || page5Visible) {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const baseWidth = 246; // SVG viewBox width
        const baseHeight = 210; // SVG viewBox height
        const viewportWidth = window.innerWidth;
        // Calculate responsive width: mobile uses ~78% of viewport, desktop uses ~104% (2000px at 1920px viewport)
        const targetWidth = isMobile 
          ? viewportWidth * 1.5  // ~800px at 768px viewport
          : Math.max(viewportWidth * 1.04, 1200); // Responsive but minimum 1200px
        const targetHeight = isMobile ? 1200 : 2400; // 37.5rem = 600px, 180rem = 2880px
        const scaleX = targetWidth / baseWidth;
        const scaleY = targetHeight / baseHeight;
        const clipPath = isMobile ? "inset(20% 5% 20% 5%)" : "inset(20% 5% 20% 5%)";
        
      // Determine target center position
      let targetCenter: number;
      let shouldUpdatePosition = false;

      // Determine which page we're anchored to
      if (currentPage === 'page4') {
        // On Page4
        targetCenter = page4Center;
        // Update position if entering Page4 from outside (not from Page5)
        if (currentPageRef.current !== 'page4' && currentPageRef.current !== 'page5') {
          shouldUpdatePosition = true;
          currentPageRef.current = 'page4';
        } else if (currentPageRef.current === null) {
          // First time entering
          shouldUpdatePosition = true;
          currentPageRef.current = 'page4';
        } else {
          // Already anchored - keep current position (don't update)
          shouldUpdatePosition = false;
        }
      } else if (currentPage === 'page5') {
        // On Page5
        targetCenter = page5Center;
        // Update position if entering Page5 from outside (not from Page4)
        if (currentPageRef.current !== 'page5' && currentPageRef.current !== 'page4') {
          shouldUpdatePosition = true;
          currentPageRef.current = 'page5';
        } else if (currentPageRef.current === null) {
          // First time entering
          shouldUpdatePosition = true;
          currentPageRef.current = 'page5';
        } else {
          // Already anchored - keep current position (don't update)
          shouldUpdatePosition = false;
        }
      } else {
        // Transitioning between pages or leaving
        if (currentPageRef.current === 'page4') {
          // Was on Page4, keep at Page4 center during transition
          targetCenter = page4Center;
          shouldUpdatePosition = false;
        } else if (currentPageRef.current === 'page5') {
          // Was on Page5, keep at Page5 center during transition
          targetCenter = page5Center;
          shouldUpdatePosition = false;
        } else {
          // Fallback
          targetCenter = page4Visible ? page4Center : page5Center;
          shouldUpdatePosition = true;
        }
      }

      // Check if we're leaving Page4 backwards or Page5 forwards
      if (!page4Visible && !page5Visible) {
        // Leaving both pages - reset anchor
        currentPageRef.current = null;
      } else if (currentPageRef.current === 'page4' && !page4Visible && scrollDirection === 'up') {
        // Leaving Page4 backwards
        currentPageRef.current = null;
      } else if (currentPageRef.current === 'page5' && !page5Visible && scrollDirection === 'down') {
        // Leaving Page5 forwards
        currentPageRef.current = null;
      }

        // Always update position to follow the anchored page's center (instant, no transition)
        logoYellow.style.transitionProperty = "opacity";
        logoYellow.style.transitionDuration = "100ms";
        logoYellow.style.transitionTimingFunction = "ease-in-out";
        logoYellow.style.top = `${targetCenter}px`;
        logoYellow.style.transform = `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`;
        logoYellow.style.width = `${baseWidth}px`;
        logoYellow.style.height = `${baseHeight}px`;
        logoYellow.style.maxHeight = "none";
        logoYellow.style.maxWidth = "none";
        logoYellow.style.zIndex = "30";
        logoYellow.style.clipPath = clipPath;
        logoYellow.style.opacity = "1";
        
        if (logoPath) {
          logoPath.style.strokeWidth = "1.2";
          logoPath.style.transition = "none";
        }
      } else {
        // Hide logo when neither Page4 nor Page5 is significantly visible
        logoYellow.style.transitionProperty = "opacity";
        logoYellow.style.transitionDuration = "100ms";
        logoYellow.style.transitionTimingFunction = "ease-in-out";
        logoYellow.style.opacity = "0";
        currentPageRef.current = null;
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
    
    // Add resize listener to update logo size responsively
    const handleResize = () => {
      checkAndUpdateLogo();
    };
    window.addEventListener('resize', handleResize, { passive: true });

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
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollContainerRef]);

  return null; // This component doesn't render anything
}

