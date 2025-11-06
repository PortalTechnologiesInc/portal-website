"use client";

import { useRef, useEffect, useState } from "react";
import { useRevealOnIntersect } from "./hooks/useRevealOnIntersect";
import { Page1 } from "./components/Page1";
import { Page2 } from "./components/Page2";
import { Page3 } from "./components/Page3";
import { Page4 } from "./components/Page4";
import { Page5 } from "./components/Page5";
import { Page6 } from "./components/Page6";
import { Page7 } from "./components/Page7";
import Footer from "./components/Footer";

export default function Home() {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [snappingEnabled, setSnappingEnabled] = useState(true);

  useRevealOnIntersect(
    () => sectionRefs.current.filter((el, index) => el && index !== 4 && index !== 5) as HTMLElement[]
  );

  // Ensure Page5 background stays white and opacity stays at 1 - no animations
  useEffect(() => {
    const page5Section = sectionRefs.current[4];
    if (page5Section) {
      // Set background and opacity immediately - no transitions or animations
      page5Section.style.backgroundColor = '#ffffff';
      page5Section.style.opacity = '1'; // Always visible, never animate
      page5Section.style.transition = 'none';
      // Use will-change to optimize rendering
      page5Section.style.willChange = 'auto';
      
      // Prevent any CSS transitions from affecting the background or opacity
      const computedStyle = window.getComputedStyle(page5Section);
      if (computedStyle.transition && computedStyle.transition !== 'none') {
        page5Section.style.transition = 'none';
      }
      if (computedStyle.opacity !== '1') {
        page5Section.style.opacity = '1';
      }
    }
  }, []);

  // Disable snapping after page 5 midpoint, re-enable when before page 5 midpoint
  useEffect(() => {
    const container = scrollContainerRef.current;
    const page5Section = sectionRefs.current[4];

    if (!container || !page5Section) return;

    const checkScrollPosition = () => {
      const scrollTop = container.scrollTop;
      const page5Top = page5Section.offsetTop;
      const page5Height = page5Section.offsetHeight;
      const page5Midpoint = page5Top + page5Height / 2;
      
      // Only enable snapping when BEFORE page 5 midpoint
      // This prevents re-enabling snapping when scrolling down from page 6
      if (scrollTop < page5Midpoint) {
        setSnappingEnabled(true);
      } else {
        setSnappingEnabled(false);
      }
    };

    // Check on scroll
    container.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    // Initial check
    checkScrollPosition();

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  // Proper scroll snapping implementation that works during scroll
  useEffect(() => {
    if (!snappingEnabled) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const sections = sectionRefs.current.slice(0, 5).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    let wheelDelta = 0;
    let touchStartY = 0;
    let touchStartScrollTop = 0;
    let isTouching = false;
    let wasOnPage6 = false; // Track if we were on page 6
    let scrollStartTop = container.scrollTop; // Track where scroll started
    let snappingToPage5 = false; // Prevent multiple snap attempts

    // Find nearest section index
    const getNearestSectionIndex = (scrollTop: number): number => {
      let nearestIndex = 0;
      let minDistance = Math.abs(sections[0].offsetTop - scrollTop);

      for (let i = 1; i < sections.length; i++) {
        const distance = Math.abs(sections[i].offsetTop - scrollTop);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      }
      return nearestIndex;
    };

    // Snap to section
    const snapToSection = (index: number) => {
      if (index < 0 || index >= sections.length) return;
      const targetTop = sections[index].offsetTop;
      container.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    };

    // Helper to check if we're past page 5 midpoint
    const isPastPage5Midpoint = (scrollTop: number): boolean => {
      const page5Bottom = sections[4]?.offsetTop + sections[4]?.offsetHeight || 0;
      const page5Top = sections[4]?.offsetTop || 0;
      const page5Height = page5Bottom - page5Top;
      const page5Midpoint = page5Top + page5Height / 2;
      return scrollTop >= page5Midpoint;
    };

    // Handle wheel events (desktop)
    const handleWheel = (e: WheelEvent) => {
      const currentScrollTop = container.scrollTop;
      const page5Top = sections[4]?.offsetTop || 0;
      const page5Bottom = sections[4]?.offsetTop + sections[4]?.offsetHeight || 0;
      
      // ABSOLUTE FIRST CHECK: If wasOnPage6 is true and scrolling up, FORCE snap to page 5 - NO EXCEPTIONS
      if (wasOnPage6 && e.deltaY < 0 && !snappingToPage5) {
        isScrolling = true;
        snappingToPage5 = true;
        // Instant hard snap to page 5
        container.scrollTo({
          top: page5Top,
          behavior: 'auto'
        });
        setTimeout(() => {
          container.scrollTo({
            top: page5Top,
            behavior: 'smooth'
          });
        }, 10);
        wasOnPage6 = false;
        wheelDelta = 0;
        setTimeout(() => { 
          isScrolling = false;
          snappingToPage5 = false;
        }, 600);
        e.preventDefault();
        return;
      }
      
      // PRIMARY CHECK: COMPLETELY DISABLE ALL SNAPPING when past page 5 midpoint
      if (isPastPage5Midpoint(currentScrollTop)) {
        wasOnPage6 = true;
        return;
      }
      
      // Also set wasOnPage6 if we're past page 5 bottom (on page 6)
      if (currentScrollTop >= page5Bottom) {
        wasOnPage6 = true;
      }
      
      // Only check snappingEnabled if we're before the midpoint
      if (!snappingEnabled) return;
      
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      // Only prevent default if we're within snapping range
      e.preventDefault();

      wheelDelta += e.deltaY;
      
      // Reset delta after a delay
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        wheelDelta = 0;
      }, 200);

      // If accumulated delta exceeds threshold, snap
      const threshold = 30;
      if (Math.abs(wheelDelta) > threshold) {
        // CRITICAL: If wasOnPage6 is true, NEVER use getNearestSectionIndex - always snap to page 5
        if (wasOnPage6 && wheelDelta < 0) {
          isScrolling = true;
          snappingToPage5 = true;
          container.scrollTo({
            top: page5Top,
            behavior: 'auto'
          });
          setTimeout(() => {
            container.scrollTo({
              top: page5Top,
              behavior: 'smooth'
            });
          }, 10);
          wasOnPage6 = false;
          wheelDelta = 0;
          setTimeout(() => { 
            isScrolling = false;
            snappingToPage5 = false;
          }, 600);
          return;
        }
        
        const currentIndex = getNearestSectionIndex(currentScrollTop);
        
        if (wheelDelta > 0 && currentIndex < sections.length - 1) {
          isScrolling = true;
          snapToSection(currentIndex + 1);
          wheelDelta = 0;
          setTimeout(() => { isScrolling = false; }, 600);
        } else if (wheelDelta < 0 && currentIndex > 0) {
          isScrolling = true;
          snapToSection(currentIndex - 1);
          wheelDelta = 0;
          setTimeout(() => { isScrolling = false; }, 600);
        } else {
          wheelDelta = 0;
        }
      }
    };

    // Handle touch events (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      if (!snappingEnabled) return; // Don't handle if snapping is disabled
      isTouching = true;
      touchStartY = e.touches[0].clientY;
      touchStartScrollTop = container.scrollTop;
      
      // If we're starting a touch on page 6, set the flag immediately
      const page5Bottom = sections[4]?.offsetTop + sections[4]?.offsetHeight || 0;
      if (touchStartScrollTop >= page5Bottom) {
        wasOnPage6 = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouching) return;
      isTouching = false;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const threshold = 30;

      const currentScrollTop = container.scrollTop;
      const page5Bottom = sections[4]?.offsetTop + sections[4]?.offsetHeight || 0;
      const page5Top = sections[4]?.offsetTop || 0;
      
      // ABSOLUTE FIRST CHECK: If wasOnPage6 is true and swiping up, FORCE snap to page 5 - NO EXCEPTIONS
      if (wasOnPage6 && deltaY > 0 && Math.abs(deltaY) > threshold && !snappingToPage5) {
        snappingToPage5 = true;
        container.scrollTo({
          top: page5Top,
          behavior: 'auto'
        });
        setTimeout(() => {
          container.scrollTo({
            top: page5Top,
            behavior: 'smooth'
          });
        }, 10);
        wasOnPage6 = false;
        setTimeout(() => {
          snappingToPage5 = false;
        }, 600);
        return;
      }
      
      // PRIMARY CHECK: Check both start and end positions - if either is past midpoint, COMPLETELY DISABLE SNAPPING
      const wasPastMidpoint = isPastPage5Midpoint(touchStartScrollTop);
      const isPastMidpoint = isPastPage5Midpoint(currentScrollTop);
      
      if (wasPastMidpoint || isPastMidpoint) {
        wasOnPage6 = true;
        
        // FORCE snap to page 5 on ANY upward swipe from page 6
        if (deltaY > 0 && Math.abs(deltaY) > threshold) {
          snappingToPage5 = true;
          container.scrollTo({
            top: page5Top,
            behavior: 'auto'
          });
          setTimeout(() => {
            container.scrollTo({
              top: page5Top,
              behavior: 'smooth'
            });
          }, 10);
          wasOnPage6 = false;
          setTimeout(() => {
            snappingToPage5 = false;
          }, 600);
          return;
        }
        
        return;
      }
      
      if (!snappingEnabled) return;

      if (Math.abs(deltaY) > threshold) {
        const currentIndex = getNearestSectionIndex(currentScrollTop);
        
        if (deltaY > 0 && currentIndex < sections.length - 1) {
          snapToSection(currentIndex + 1);
        } else if (deltaY < 0 && currentIndex > 0) {
          snapToSection(currentIndex - 1);
        }
      }
    };

    // Also handle scroll end to ensure perfect alignment (only for pages 1-5)
    let scrollEndTimeout: NodeJS.Timeout;
    let lastScrollTop = container.scrollTop;
    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      const page5Top = sections[4]?.offsetTop || 0;
      const page5Bottom = sections[4]?.offsetTop + sections[4]?.offsetHeight || 0;
      const page5Height = page5Bottom - page5Top;
      const page5Midpoint = page5Top + page5Height / 2;
      
      // ABSOLUTE FIRST CHECK: If wasOnPage6 is true and scrolling up, FORCE snap to page 5 - NO EXCEPTIONS
      if (wasOnPage6 && !snappingToPage5 && currentScrollTop < lastScrollTop) {
        snappingToPage5 = true;
        container.scrollTo({
          top: page5Top,
          behavior: 'auto'
        });
        setTimeout(() => {
          container.scrollTo({
            top: page5Top,
            behavior: 'smooth'
          });
        }, 10);
        setTimeout(() => {
          wasOnPage6 = false;
          snappingToPage5 = false;
        }, 600);
        scrollStartTop = page5Top;
        lastScrollTop = page5Top;
        return;
      }
      
      // Reset snapping flag if we're clearly past page 5
      if (currentScrollTop >= page5Bottom) {
        snappingToPage5 = false;
      }
      
      // PRIMARY CHECK: COMPLETELY DISABLE SNAPPING when past page 5 midpoint - return IMMEDIATELY
      // This check happens FIRST, before any other logic including snappingEnabled
      if (isPastPage5Midpoint(currentScrollTop)) {
        wasOnPage6 = true;
        scrollStartTop = currentScrollTop;
        lastScrollTop = currentScrollTop;
        // Clear any pending timeout to prevent snapping callbacks from running
        clearTimeout(scrollEndTimeout);
        // Don't set up timeout - completely skip ALL snapping logic
        return;
      }
      
      // Only check snappingEnabled if we're before the midpoint
      if (!snappingEnabled) return;
      
      // Reset scroll start if this is a new scroll gesture
      if (Math.abs(currentScrollTop - scrollStartTop) > 50) {
        scrollStartTop = currentScrollTop;
      }
      
      lastScrollTop = currentScrollTop;
      
      clearTimeout(scrollEndTimeout);
      
      scrollEndTimeout = setTimeout(() => {
        if (isTouching || isScrolling) return;
        
        const scrollTop = container.scrollTop;
        const page5Bottom = sections[4]?.offsetTop + sections[4]?.offsetHeight || 0;
        const page5Top = sections[4]?.offsetTop || 0;
        const page5Height = page5Bottom - page5Top;
        const page5Midpoint = page5Top + page5Height / 2;
        const page4Top = sections[3]?.offsetTop || 0;
        
        // ABSOLUTE FIRST CHECK: If wasOnPage6 is true, FORCE snap to page 5 - NO EXCEPTIONS
        // This MUST be the first check, before ANY other logic including midpoint checks
        if (wasOnPage6 && !snappingToPage5) {
          snappingToPage5 = true;
          container.scrollTo({
            top: page5Top,
            behavior: 'auto'
          });
          setTimeout(() => {
            container.scrollTo({
              top: page5Top,
              behavior: 'smooth'
            });
          }, 10);
          setTimeout(() => {
            wasOnPage6 = false;
            snappingToPage5 = false;
          }, 600);
          scrollStartTop = page5Top;
          return;
        }
        
        // Double-check: COMPLETELY DISABLE SNAPPING when past page 5 midpoint
        if (isPastPage5Midpoint(scrollTop)) {
          wasOnPage6 = true;
          scrollStartTop = scrollTop;
          return; // Completely disable snapping logic
        }
        
        // Determine scroll direction
        const finalScrollDirection = scrollTop < scrollStartTop ? 'up' : scrollTop > scrollStartTop ? 'down' : null;
        
        // CRITICAL: If we were on page 6 and scrolling down, NEVER snap - allow free scrolling
        if (wasOnPage6 && finalScrollDirection === 'down') {
          // Don't reset wasOnPage6 here - keep it true to prevent any snapping
          scrollStartTop = scrollTop;
          return;
        }
        
        // FORCE snap to page 5 when scrolling up from page 6 - ANY upward movement triggers hard snap
        if (wasOnPage6 && !snappingToPage5 && finalScrollDirection === 'up') {
          // ANY upward scroll from page 6 - FORCE snap immediately to page 5
          snappingToPage5 = true;
          // Use instant scroll for hard snap
          container.scrollTo({
            top: page5Top,
            behavior: 'auto' // Instant, hard snap
          });
          // Then smooth it slightly
          setTimeout(() => {
            container.scrollTo({
              top: page5Top,
              behavior: 'smooth'
            });
          }, 10);
          setTimeout(() => {
            wasOnPage6 = false;
            snappingToPage5 = false;
          }, 600);
          scrollStartTop = page5Top;
          return;
        }
        
        // If we're in page 5's range (before midpoint), ensure alignment
        // BUT ONLY if we weren't on page 6 (to prevent snapping when scrolling down from page 6)
        if (!wasOnPage6 && scrollTop >= page5Top && scrollTop < page5Midpoint) {
          const targetTop = page5Top;
          const misalignment = Math.abs(scrollTop - targetTop);
          if (misalignment > 10) {
            container.scrollTo({
              top: targetTop,
              behavior: 'smooth'
            });
          }
          scrollStartTop = scrollTop;
          return;
        }
        
        // Only reset wasOnPage6 if we're clearly on page 5 (at the top of page 5)
        // Don't reset it if we're between page 4 and page 5 when coming from page 6
        if (scrollTop >= page5Top && scrollTop < page5Midpoint && finalScrollDirection !== 'up') {
          // Only reset if we're properly on page 5 and not scrolling up (which means we came from above, not from page 6)
          wasOnPage6 = false;
        } else if (scrollTop < page4Top) {
          // Only reset if we're clearly before page 4
          wasOnPage6 = false;
        }
        
        // Only call getNearestSectionIndex if wasOnPage6 is false
        // This prevents snapping to page 4 when coming from page 6
        // Also only snap if there was actual scroll movement (not just a timeout firing)
        if (!wasOnPage6 && Math.abs(scrollTop - scrollStartTop) > 5) {
          const currentIndex = getNearestSectionIndex(scrollTop);
          const targetTop = sections[currentIndex].offsetTop;
          const misalignment = Math.abs(scrollTop - targetTop);

          // Only snap if misalignment is significant AND we're not in the middle of a scroll gesture
          if (misalignment > 10 && !isScrolling && !isTouching) {
            container.scrollTo({
              top: targetTop,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(scrollEndTimeout);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [snappingEnabled]);

  return (
    <div
      ref={(el) => {
        scrollContainerRef.current = el as unknown as HTMLElement;
      }}
      className="h-dvh overflow-y-scroll overflow-x-hidden"
      style={{
        scrollSnapType: 'none', // Disable CSS scroll snap, we handle it with JS
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth', // Use smooth for our JS snapping
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
      {/* Page 1: Hero Section - Exactly 100vh */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="relative h-dvh bg-white text-[#141416]"
        style={{ 
          flexShrink: 0, // Prevent flex shrinking
        }}
      >
        <div className="h-full pt-20">
          <Page1 />
        </div>
      </section>

      {/* Page 2: Payments Section - Exactly 100vh */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="h-dvh text-white relative z-40 md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          flexShrink: 0, // Prevent flex shrinking
        }}
      >
        <div className="h-full px-6 pt-28 md:pt-36">
          <Page2 scrollContainerRef={scrollContainerRef} />
        </div>
      </section>

      {/* Page 3: Horizontal Carousel Section - Exactly 100vh */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="h-dvh text-white relative z-40 md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          flexShrink: 0, // Prevent flex shrinking
        }}
      >
        <Page3 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 4: Solution Section - Exactly 100vh */}
      <section
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        className="h-dvh text-white relative z-40 md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          flexShrink: 0, // Prevent flex shrinking
        }}
      >
        <Page4 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 5: Final Section - Exactly 100vh */}
      <section
        ref={(el) => {
          sectionRefs.current[4] = el;
          // Ensure background is set immediately to prevent flickering
          if (el) {
            el.style.backgroundColor = '#ffffff';
            // Optimize rendering to prevent flicker
            el.style.backfaceVisibility = 'hidden';
            el.style.transform = 'translateZ(0)'; // Force GPU acceleration
          }
        }}
        className="h-dvh relative bg-white md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          backgroundColor: '#ffffff', // Set inline style as well to prevent flickering
          opacity: 1, // Always visible, never animate
          backfaceVisibility: 'hidden', // Prevent flicker during scroll
          transform: 'translateZ(0)', // Force GPU layer
          zIndex: 49, 
          position: 'relative',
          flexShrink: 0, // Prevent flex shrinking
        }}
      >
        <Page5 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 6: Yellow Background Section - No snapping */}
      <section
        ref={(el) => {
          sectionRefs.current[5] = el;
        }}
        className="min-h-dvh relative overflow-hidden md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
      >
        <Page6 />
      </section>

      {/* Page 7: Behind the P+RTAL company Section - No snapping */}
      <section
        ref={(el) => {
          sectionRefs.current[6] = el;
        }}
        className="min-h-dvh relative overflow-hidden md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
      >
        <Page7 />
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
