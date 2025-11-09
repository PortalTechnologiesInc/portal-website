"use client";

import { useEffect, useRef } from "react";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function LogoManager({ scrollContainerRef }: Props) {
  const lastScrollTopRef = useRef(0);
  const currentPageRef = useRef<'page4' | 'page5' | null>(null);
  const page4CenterPositionRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainerEl = scrollContainerRef.current;
    const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
    const logoPath = document.querySelector('[data-logo-path]') as SVGPathElement;

    if (!scrollContainerEl || !logoYellow) return;

    // Find Page4 and all Page5 sections by data-page attribute
    const page4Section = document.querySelector('[data-page="page4"]')?.closest('section') as HTMLElement;
    const allPage5Sections = Array.from(document.querySelectorAll('section[data-page="page5"]')) as HTMLElement[];
    
    if (!page4Section) return;

    const checkAndUpdateLogo = () => {
      const currentScrollTop = scrollContainerEl.scrollTop;
      const scrollDirection = currentScrollTop > lastScrollTopRef.current ? 'down' : currentScrollTop < lastScrollTopRef.current ? 'up' : null;
      lastScrollTopRef.current = currentScrollTop;

      const viewportHeight = scrollContainerEl.clientHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Get Page4 bounds
      const page4Rect = page4Section.getBoundingClientRect();
      const page4Top = page4Rect.top;
      const page4Bottom = page4Rect.bottom;
      const page4Center = page4Top + (page4Bottom - page4Top) / 2;
      const page4Visible = page4Top < viewportCenter && page4Bottom > viewportCenter;
      
      // Get all Page5 sections bounds and find the last one
      let lastPage5Section: HTMLElement | null = null;
      let lastPage5Bottom = 0;
      let page5Visible = false;
      let page5Center = 0;
      let visiblePage5Section: HTMLElement | null = null;
      let minDistanceToCenter = Infinity;
      
      // Find the last Page5 section (furthest down)
      for (const page5Section of allPage5Sections) {
        const page5Rect = page5Section.getBoundingClientRect();
        const page5Bottom = page5Rect.bottom;
        if (page5Bottom > lastPage5Bottom) {
          lastPage5Bottom = page5Bottom;
          lastPage5Section = page5Section;
        }
      }
      
      // Check all Page5 sections to find which one is currently visible and most centered
      // Also calculate centers for all Page5 sections for transition logic
      for (const page5Section of allPage5Sections) {
        const page5Rect = page5Section.getBoundingClientRect();
        const page5Top = page5Rect.top;
        const page5Bottom = page5Rect.bottom;
        const page5CenterCandidate = page5Top + (page5Bottom - page5Top) / 2;
        const isPage5Visible = page5Top < viewportCenter && page5Bottom > viewportCenter;
        
        if (isPage5Visible) {
          const distanceToCenter = Math.abs(page5CenterCandidate - viewportCenter);
          if (distanceToCenter < minDistanceToCenter) {
            minDistanceToCenter = distanceToCenter;
            page5Visible = true;
            visiblePage5Section = page5Section;
            page5Center = page5CenterCandidate;
          }
        } else if (!page5Visible) {
          // If no Page5 section is visible, use the closest one for transition calculations
          const distanceToCenter = Math.abs(page5CenterCandidate - viewportCenter);
          if (distanceToCenter < minDistanceToCenter) {
            minDistanceToCenter = distanceToCenter;
            page5Center = page5CenterCandidate;
          }
        }
      }

      // Check if we're within the range from Page4 to the last Page5 section
      // This ensures the logo stays visible during transitions
      const viewportTop = scrollContainerEl.scrollTop;
      const viewportBottom = viewportTop + viewportHeight;
      const page4SectionTop = page4Section.offsetTop;
      const lastPage5SectionTop = lastPage5Section ? lastPage5Section.offsetTop : 0;
      const lastPage5SectionHeight = lastPage5Section ? lastPage5Section.offsetHeight : 0;
      const lastPage5SectionBottom = lastPage5SectionTop + lastPage5SectionHeight;
      
      // Check if viewport overlaps with the range from Page4 start to last Page5 end
      const isInPage4To5Range = viewportBottom >= page4SectionTop && viewportTop <= lastPage5SectionBottom;
      
      // Only show logo when Page4 is actually visible (not just when viewport bottom reaches Page4 top)
      // This prevents the logo from showing at the bottom of Page3
      const shouldShowLogo = (page4Visible || page5Visible) && viewportTop >= page4SectionTop;

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
      } else if (isInPage4To5Range && viewportTop >= page4SectionTop) {
        // During transition, determine which page we're closer to
        // Only if we've actually scrolled past Page4's top
        const page4Distance = Math.abs(page4Center - viewportCenter);
        const page5Distance = page5Center > 0 ? Math.abs(page5Center - viewportCenter) : Infinity;
        if (page5Center > 0 && page5Distance < page4Distance) {
          currentPage = 'page5';
        } else {
          currentPage = 'page4';
        }
      }

      // Show logo only when Page4 is visible or we've scrolled past Page4's top
      if (shouldShowLogo) {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const baseWidth = 246; // SVG viewBox width
        const baseHeight = 210; // SVG viewBox height
        const viewportWidth = window.innerWidth;
        // Calculate responsive width: mobile uses ~78% of viewport, desktop uses ~104% (2000px at 1920px viewport)
        const targetWidth = isMobile 
          ? viewportWidth * 1.5  // ~800px at 768px viewport
          : Math.max(viewportWidth * 1.04, 1200); // Responsive but minimum 1200px
        const targetHeight = isMobile ? 1450 : 2400; // 37.5rem = 600px, 180rem = 2880px
        const scaleX = targetWidth / baseWidth;
        const scaleY = targetHeight / baseHeight;
        const clipPath = isMobile ? "inset(20% 5% 20% 5%)" : "inset(20% 5% 20% 5%)";
        
      // Determine target center position - always use Page4 center when in Page4-5 range
      // This keeps the logo still from Page4 to Page5
      // Store the initial Page4 center position when entering the range (from any direction)
      if (page4CenterPositionRef.current === null && shouldShowLogo) {
        // Calculate Page4 center based on section position, not visibility
        // This works even when coming from Page6 to Page5
        const page4SectionRect = page4Section.getBoundingClientRect();
        const page4SectionCenter = page4SectionRect.top + (page4SectionRect.bottom - page4SectionRect.top) / 2;
        page4CenterPositionRef.current = page4SectionCenter;
      }
      
      // Use stored Page4 center position if available, otherwise use current Page4 center
      // This ensures the logo stays at the same position from Page4 to Page5
      let targetCenter: number = page4CenterPositionRef.current ?? page4Center;

      // Set anchor when first entering Page4-5 range
      if (currentPageRef.current === null && shouldShowLogo) {
        currentPageRef.current = 'page4';
      }

      // Check if we're leaving Page4-5 range entirely
      if (!isInPage4To5Range) {
        // Leaving the range - reset anchor and stored position
        currentPageRef.current = null;
        page4CenterPositionRef.current = null;
      } else if (currentPageRef.current === 'page4' && viewportTop < page4SectionTop && scrollDirection === 'up') {
        // Leaving Page4 backwards
        currentPageRef.current = null;
        page4CenterPositionRef.current = null;
      } else if (viewportTop > lastPage5SectionBottom && scrollDirection === 'down') {
        // Leaving last Page5 forwards
        currentPageRef.current = null;
        page4CenterPositionRef.current = null;
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

    // Observer for all Page5 sections
    const page5Observers = allPage5Sections.map(page5Section => {
      return new IntersectionObserver(
        () => {
          checkAndUpdateLogo();
        },
        {
          root: scrollContainerEl,
          threshold: [0, 0.5, 1],
        }
      );
    });

    page4Observer.observe(page4Section);
    allPage5Sections.forEach((page5Section, index) => {
      if (page5Observers[index]) {
        page5Observers[index].observe(page5Section);
      }
    });

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
      page5Observers.forEach(observer => observer.disconnect());
      scrollContainerEl.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollContainerRef]);

  return null; // This component doesn't render anything
}

