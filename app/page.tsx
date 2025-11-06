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
    () => sectionRefs.current.filter((el, index) => el && index !== 5) as HTMLElement[]
  );

  // Disable snapping after page 5, re-enable when reaching page 5 again
  useEffect(() => {
    const container = scrollContainerRef.current;
    const page5Section = sectionRefs.current[4];
    const page6Section = sectionRefs.current[5];

    if (!container || !page5Section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const page5Entry = entries.find(e => e.target === page5Section);
        const page6Entry = page6Section ? entries.find(e => e.target === page6Section) : null;
        
        if (page6Entry && page6Entry.isIntersecting && page6Entry.intersectionRatio > 0.3) {
          // Page 6 is visible - disable snapping
          setSnappingEnabled(false);
        } else if (page5Entry) {
          // Page 5 is visible - enable snapping
          if (page5Entry.isIntersecting && page5Entry.intersectionRatio > 0.3) {
            setSnappingEnabled(true);
          }
        }
      },
      {
        root: container,
        threshold: [0, 0.3, 0.5, 1],
      }
    );

    observer.observe(page5Section);
    if (page6Section) {
      observer.observe(page6Section);
    }

    return () => {
      observer.disconnect();
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

    // Handle wheel events (desktop)
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      wheelDelta += e.deltaY;
      
      // Reset delta after a delay
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        wheelDelta = 0;
      }, 150);

      // If accumulated delta exceeds threshold, snap
      const threshold = 50;
      if (Math.abs(wheelDelta) > threshold) {
        const currentScrollTop = container.scrollTop;
        const currentIndex = getNearestSectionIndex(currentScrollTop);
        
        if (wheelDelta > 0 && currentIndex < sections.length - 1) {
          // Scroll down
          isScrolling = true;
          snapToSection(currentIndex + 1);
          wheelDelta = 0;
          setTimeout(() => { isScrolling = false; }, 500);
        } else if (wheelDelta < 0 && currentIndex > 0) {
          // Scroll up
          isScrolling = true;
          snapToSection(currentIndex - 1);
          wheelDelta = 0;
          setTimeout(() => { isScrolling = false; }, 500);
        }
      }
    };

    // Handle touch events (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      isTouching = true;
      touchStartY = e.touches[0].clientY;
      touchStartScrollTop = container.scrollTop;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouching) return;
      isTouching = false;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const threshold = 30; // Minimum swipe distance

      if (Math.abs(deltaY) > threshold) {
        const currentScrollTop = container.scrollTop;
        const currentIndex = getNearestSectionIndex(currentScrollTop);
        
        if (deltaY > 0 && currentIndex < sections.length - 1) {
          // Swipe up - go to next section
          snapToSection(currentIndex + 1);
        } else if (deltaY < 0 && currentIndex > 0) {
          // Swipe down - go to previous section
          snapToSection(currentIndex - 1);
        }
      }
    };

    // Also handle scroll end to ensure perfect alignment
    let scrollEndTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollEndTimeout);
      
      scrollEndTimeout = setTimeout(() => {
        if (isTouching || isScrolling) return;
        
        const scrollTop = container.scrollTop;
        const currentIndex = getNearestSectionIndex(scrollTop);
        const targetTop = sections[currentIndex].offsetTop;
        const misalignment = Math.abs(scrollTop - targetTop);

        // If misaligned by more than 10px, correct it
        if (misalignment > 10) {
          container.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
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
        className="relative h-dvh snap-start bg-white text-[#141416]"
        style={{ 
          scrollSnapStop: "always", 
          scrollSnapAlign: "start",
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
        className="h-dvh snap-start text-white relative z-40 md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          scrollSnapStop: "always", 
          scrollSnapAlign: "start",
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
        className="h-dvh snap-start text-white relative z-40 md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          scrollSnapStop: "always", 
          scrollSnapAlign: "start",
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
        className="h-dvh snap-start text-white relative z-40 md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          scrollSnapStop: "always", 
          scrollSnapAlign: "start",
          flexShrink: 0, // Prevent flex shrinking
        }}
      >
        <Page4 scrollContainerRef={scrollContainerRef} />
      </section>

      {/* Page 5: Final Section - Exactly 100vh */}
      <section
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        className="h-dvh snap-start relative md:[&>*]:max-w-[95rem] md:[&>*]:mx-auto"
        style={{ 
          scrollSnapStop: "always",
          scrollSnapAlign: "start",
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
