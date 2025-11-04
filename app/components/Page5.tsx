"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { resetLogoYellow } from "./Page4";
import { DUR_STEP_MS } from "../lib/constants/animation";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page5({ scrollContainerRef }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPage5Intersecting, setIsPage5Intersecting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [cardPhase, setCardPhase] = useState<'hidden' | 'center' | 'expanded'>('hidden');
  const page5ContainerRef = useRef<HTMLDivElement | null>(null);
  const hasEnteredRef = useRef(false);
  const isAnimatingRef = useRef(false);

  // Track client-side mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const container = page5ContainerRef.current;
    if (!container) return;

    const scrollContainerEl = scrollContainerRef.current;
    if (!scrollContainerEl) return;

    const page5Section = container.closest("section");
    if (!page5Section) return;

    // Get Page6 section
    const page6Section = page5Section.nextElementSibling as HTMLElement;

    const ensureLogoVisible = () => {
      const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
      const logoPath = document.querySelector('[data-logo-path]') as SVGPathElement;
      if (logoYellow) {
        // Ensure logo maintains its visible state but below cards
        logoYellow.style.opacity = "1";
        logoYellow.style.top = "50vh";
        logoYellow.style.transform = "translate(-50%, -50%)";
        logoYellow.style.width = "900px";
        logoYellow.style.height = "900px";
        logoYellow.style.transition = "none";
        logoYellow.style.zIndex = "48"; // Below cards but above background
      }
      if (logoPath) {
        logoPath.style.strokeWidth = "1.2";
        logoPath.style.transition = "none";
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        // Keep logo visible whenever Page5 is intersecting
        if (isIntersecting && intersectionRatio >= 0.5) {
          setIsPage5Intersecting(true);
          ensureLogoVisible();

          // Enter animation: section becomes visible for the first time
          if (!hasEnteredRef.current && !isAnimatingRef.current) {
            hasEnteredRef.current = true;
            isAnimatingRef.current = true;
            
            // Start background transition and card rise simultaneously
            requestAnimationFrame(() => {
              setIsVisible(true);
              setCardPhase('center');
            });
            
            // Card expansion after reaching center
            setTimeout(() => {
              setCardPhase('expanded');
            }, 1400); // 100ms + 1000ms rise + 300ms pause
            
            // Animation complete
            setTimeout(() => {
              isAnimatingRef.current = false;
            }, 2200); // Total animation time
          }
        } else {
          // Immediately set to false when not intersecting or ratio too low
          setIsPage5Intersecting(false);
          
          // Hide logo when scrolling forward past Page5
          if (hasEnteredRef.current && !isIntersecting) {
            const page5Rect = page5Section.getBoundingClientRect();
            const viewportHeight = scrollContainerEl.clientHeight;
            // If Page5 is above the viewport (scrolled past), hide the logo
            if (page5Rect.bottom < viewportHeight * 0.5) {
              const logoYellowEl = document.querySelector('[data-logo-yellow]') as HTMLElement;
              if (logoYellowEl) {
                const currentOpacity = getComputedStyle(logoYellowEl).opacity;
                if (currentOpacity !== "0" && parseFloat(currentOpacity) > 0) {
                  logoYellowEl.style.transition = `opacity ${DUR_STEP_MS}ms ease-in-out`;
                  logoYellowEl.style.opacity = "0";
                }
              }
            }
          }
        }
        
        // Exit animation: section becomes invisible (backwards scroll)
        if (!isIntersecting && hasEnteredRef.current && cardPhase !== 'hidden' && !isAnimatingRef.current) {
          const page5Rect = page5Section.getBoundingClientRect();
          const viewportHeight = scrollContainerEl.clientHeight;
          // Only reset when scrolling backwards (Page5 is below viewport)
          if (page5Rect.top > viewportHeight * 0.5) {
            isAnimatingRef.current = true;
            
            // Reset logo when leaving Page5 (going backwards)
            resetLogoYellow();
            
            // Start reverse animation
            setCardPhase('hidden');
            setIsVisible(false);
            
            // Animation complete
            setTimeout(() => {
              isAnimatingRef.current = false;
              hasEnteredRef.current = false; // Reset for next cycle
            }, 1000);
          }
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    // Observer for Page6 - to detect when we're scrolling forward to it
    const page6Observer = page6Section ? new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isPage6Intersecting = entry.isIntersecting;
        const page6Ratio = entry.intersectionRatio;
        
        // Check if Page5 is currently intersecting
        const page5Rect = page5Section.getBoundingClientRect();
        const viewportHeight = scrollContainerEl.clientHeight;
        const page5Ratio = page5Rect.top < viewportHeight && page5Rect.bottom > 0 
          ? Math.min(1, Math.max(0, (viewportHeight - Math.max(0, page5Rect.top)) / viewportHeight))
          : 0;
        
        // If Page6 is starting to become visible (low threshold) while Page5 is still partially visible, fade out
        // This makes the fade happen DURING the scroll transition, not after
        if (isPage6Intersecting && page6Ratio > 0.1 && page5Ratio < 0.8 && hasEnteredRef.current) {
          const logoYellowEl = document.querySelector('[data-logo-yellow]') as HTMLElement;
          if (logoYellowEl) {
            const currentOpacity = getComputedStyle(logoYellowEl).opacity;
            // Only fade if not already faded out
            if (currentOpacity !== "0" && parseFloat(currentOpacity) > 0) {
              // Gracefully fade out with transition while scrolling
              logoYellowEl.style.transition = `opacity ${DUR_STEP_MS}ms ease-in-out`;
              logoYellowEl.style.opacity = "0";
            }
          }
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.1, 0.2, 0.3, 0.5, 1],
      }
    ) : null;

    observer.observe(page5Section);
    if (page6Section && page6Observer) {
      page6Observer.observe(page6Section);
    }
    
    // Check initial intersection state in case page is already visible on mount
    // Use a small delay to ensure DOM is ready
    setTimeout(() => {
      const rect = page5Section.getBoundingClientRect();
      const containerRect = scrollContainerEl.getBoundingClientRect();
      const isInitiallyVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top;
      
      if (isInitiallyVisible && !hasEnteredRef.current) {
        const intersectionRatio = Math.min(1, Math.max(0, 
          (Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top)) / rect.height
        ));
        
        if (intersectionRatio >= 0.5) {
          ensureLogoVisible();
          hasEnteredRef.current = true;
          isAnimatingRef.current = true;
          
          requestAnimationFrame(() => {
            setIsVisible(true);
            setCardPhase('center');
          });
          
          setTimeout(() => {
            setCardPhase('expanded');
          }, 1400);
          
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 2200);
        }
      }
    }, 50);

    return () => {
      observer.disconnect();
      if (page6Observer) {
        page6Observer.disconnect();
      }
    };
  }, [scrollContainerRef]);

  // Cleanup portal background when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup: remove any portal background elements
      const portalBackgrounds = document.body.querySelectorAll('[data-page5-background]');
      portalBackgrounds.forEach(el => el.remove());
    };
  }, []);

  // Update section background color when isVisible changes
  useEffect(() => {
    const section = page5ContainerRef.current?.closest("section");
    if (section) {
      // Remove background from section
      section.style.backgroundColor = 'transparent';
    }
  }, [isVisible]);

  return (
    <>
      {/* Fixed background for Page5 - rendered via portal to avoid stacking context issues */}
      {isMounted && createPortal(
        <div
          data-page5-background
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 47,
            backgroundColor: '#ffffff',
            transition: 'opacity 1000ms ease-out',
            pointerEvents: 'none',
            opacity: isPage5Intersecting ? 1 : 0,
            visibility: isPage5Intersecting ? 'visible' : 'hidden'
          }}
        />,
        document.body
      )}
      
      <div 
        ref={page5ContainerRef} 
        className="relative w-full h-dvh flex flex-col items-center justify-center"
        style={{
          position: 'relative',
          zIndex: 50
        }}
      >
      {/* Horizontal Carousel Container - Always visible */}
      <div 
        className="w-full h-full overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
        style={{
          position: 'relative',
          zIndex: 52,
          scrollPaddingLeft: '11.5vw',
          scrollPaddingRight: '11.5vw',
          opacity: cardPhase === 'expanded' ? 1 : 0,
          pointerEvents: cardPhase === 'expanded' ? 'auto' : 'none',
          transition: 'opacity 300ms ease-out'
        }}
      >
        <div className="flex h-full gap-6 py-6 z-52" style={{ paddingLeft: '11.5vw', paddingRight: '0' }}>
          {/* Card 1 - Hidden when animated card1 is showing, visible when expanded */}
          <div 
            className="flex-shrink-0 w-[77vw] flex items-center justify-center snap-center"
            style={{
              opacity: cardPhase === 'expanded' ? 1 : 0,
              pointerEvents: cardPhase === 'expanded' ? 'auto' : 'none'
            }}
          >
            <div className="z-52 relative w-full h-[57vh] max-w-full max-h-[57vh] flex items-center justify-center" style={{ width: '77vw', height: '57vh' }}>
              <Image
                src="/card1.png"
                alt="Card 1"
                fill
                className="object-cover rounded-3xl"
                sizes="77vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="flex-shrink-0 w-[77vw] flex items-center justify-center snap-center"
            style={{
              opacity: 1,
              pointerEvents: 'auto',
              zIndex: 52
            }}
          >
            <div className="relative w-full h-[57vh] max-w-full max-h-[57vh] flex items-center justify-center" style={{ width: '77vw', height: '57vh' }}>
              <Image
                src="/card2.png"
                alt="Card 2"
                fill
                className="object-cover rounded-3xl"
                sizes="77vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className="flex-shrink-0 w-[77vw] flex items-center justify-center snap-center"
            style={{
              opacity: 1,
              pointerEvents: 'auto'
            }}
          >
            <div className="relative w-full h-[57vh] max-w-full max-h-[57vh] flex items-center justify-center" style={{ width: '77vw', height: '57vh' }}>
              <Image
                src="/card3.png"
                alt="Card 3"
                fill
                className="object-cover rounded-3xl"
                sizes="77vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          {/* Spacer to ensure last card can center */}
          <div className="flex-shrink-0 w-[11.5vw]" />
        </div>
      </div>

      {/* Card1 Image Animation - Shows during animation, hidden when expanded */}
      <div
        className="transition-all duration-1000 ease-out pointer-events-none"
        style={{
          position: 'absolute',
          left: cardPhase === 'expanded' ? '-9999px' : '50%',
          top: cardPhase === 'hidden' ? '100%' : cardPhase === 'expanded' ? '-9999px' : '50%',
          transform: 'translate(-50%, -50%)',
          width: cardPhase === 'expanded' ? '77vw' : '200px',
          height: cardPhase === 'expanded' ? '57vh' : '300px',
          opacity: cardPhase === 'hidden' ? 0 : cardPhase === 'expanded' ? 0 : 1,
          transition: cardPhase === 'expanded' ? 'opacity 300ms ease-out, width 800ms ease-out, height 800ms ease-out, left 300ms ease-out, top 300ms ease-out' : 'all 1000ms ease-out',
          zIndex: 53,
          visibility: cardPhase === 'expanded' ? 'hidden' : 'visible'
        }}
      >
        <Image
          src="/card1.png"
          alt="Card 1"
          width={200}
          height={300}
          className="w-full h-full object-contain rounded-3xl"
        />
      </div>
    </div>
    </>
  );
}