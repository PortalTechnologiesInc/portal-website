"use client";

import { useRef, useEffect, useState } from "react";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page4({ scrollContainerRef }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const page4ContainerRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const container = page4ContainerRef.current;
    if (!container) return;

    const scrollContainerEl = scrollContainerRef.current;
    if (!scrollContainerEl) return;

    const page4Section = container.closest("section");
    if (!page4Section) return;

    let isExiting = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        console.log('Page4 intersection:', {
          isIntersecting,
          intersectionRatio,
          hasAnimated: hasAnimatedRef.current,
          isExiting,
          isVisible,
          isAnimating
        });

        // Enter animation: section becomes visible for the first time (only once)
        if (isIntersecting && intersectionRatio >= 0.5 && !hasAnimatedRef.current && !isAnimating) {
          console.log("Page4: Starting enter animation");
          hasAnimatedRef.current = true;
          setIsAnimating(true);
          
          // Start animation
          setTimeout(() => {
            setIsVisible(true);
          }, 100);
          
          // Animation complete
          setTimeout(() => {
            setIsAnimating(false);
            console.log("Page4: Enter animation completed");
          }, 1100);
        }
        // If already animated, keep it visible
        else if (isIntersecting && hasAnimatedRef.current && !isVisible) {
          setIsVisible(true);
        }
        
        // Exit animation: section becomes invisible
        else if (!isIntersecting && hasAnimatedRef.current && isVisible && !isAnimating && !isExiting) {
          console.log("Page4: Starting exit animation");
          isExiting = true;
          setIsAnimating(true);
          setIsScrollLocked(true);
          
          // Lock scroll
          scrollContainerEl.style.scrollSnapType = 'none';
          scrollContainerEl.style.scrollBehavior = 'auto';
          
          const preventScroll = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          };
          
          scrollContainerEl.addEventListener('wheel', preventScroll, { passive: false });
          scrollContainerEl.addEventListener('touchmove', preventScroll, { passive: false });
          
          // Start reverse animation
          setIsVisible(false);
          // Keep SVG visible for Page5
          // setSvgVisible(false);
          
          // Animation complete
          setTimeout(() => {
            setIsAnimating(false);
            setIsScrollLocked(false);
            isExiting = false;
            // Don't reset hasAnimatedRef - animation should only run once
            
            // Unlock scroll
            scrollContainerEl.removeEventListener('wheel', preventScroll);
            scrollContainerEl.removeEventListener('touchmove', preventScroll);
            scrollContainerEl.style.scrollSnapType = '';
            scrollContainerEl.style.scrollBehavior = '';
            
            console.log("Page4: Exit animation completed");
          }, 1100);
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    observer.observe(page4Section);

    return () => {
      observer.disconnect();
      // Cleanup scroll lock
      scrollContainerEl.style.scrollSnapType = '';
      scrollContainerEl.style.scrollBehavior = '';
    };
  }, [scrollContainerRef]);

  return (
    <div ref={page4ContainerRef} className="relative w-full h-dvh flex flex-col items-center justify-center px-6">
      {/* Debug: Manual scroll unlock button */}
      {isScrollLocked && (
        <button
          onClick={() => {
            const scrollContainerEl = scrollContainerRef.current;
            if (scrollContainerEl) {
              scrollContainerEl.style.scrollSnapType = '';
              scrollContainerEl.style.scrollBehavior = '';
            }
            setIsScrollLocked(false);
          }}
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50"
        >
          Unlock Scroll (Debug)
        </button>
      )}
      

      {/* Final Title and Subtitle */}
      <div className="text-center mx-2">
        <h1
          className="font-eurostile font-bold tracking-tight text-5xl md:text-8xl lg:text-8xl text-white transition-all duration-1000 ease-out"
          style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? "translateY(0px)" : "translateY(12px)" 
          }}
        >
          BREAK THE CYCLE,
          <br />
          SKIP THE THIRD WHEEL
        </h1>
        
        <p
          className="mt-3 text-2xl md:text-xl lg:text-xl opacity-90 max-w-2xl mx-5 text-white transition-all duration-1000 ease-out"
          style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? "translateY(0px)" : "translateY(12px)" 
          }}
        >
          A peer-to-peer system for direct business-to-customer
          communication
        </p>
      </div>
    </div>
  );
}