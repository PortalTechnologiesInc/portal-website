"use client";

import { useRef, useEffect, useState } from "react";
import { DUR_STEP_MS } from "../lib/constants/animation";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page5({ scrollContainerRef }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [cardPhase, setCardPhase] = useState<'hidden' | 'center' | 'expanded'>('hidden');
  const page5ContainerRef = useRef<HTMLDivElement | null>(null);
  const hasEnteredRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const container = page5ContainerRef.current;
    if (!container) return;

    const scrollContainerEl = scrollContainerRef.current;
    if (!scrollContainerEl) return;

    const page5Section = container.closest("section");
    if (!page5Section) return;

    // Get Page6 section
    const page6Section = page5Section.nextElementSibling as HTMLElement;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        // Calculate page5Rect and viewportHeight for use in logic
        const page5Rect = page5Section.getBoundingClientRect();
        const viewportHeight = scrollContainerEl.clientHeight;

        // Enter animation: section becomes visible for the first time
        if (isIntersecting && intersectionRatio >= 0.5) {
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
        }
        
        // Exit animation: section becomes invisible (backwards scroll)
        if (!isIntersecting && hasEnteredRef.current && cardPhase !== 'hidden' && !isAnimatingRef.current) {
          const page5Rect = page5Section.getBoundingClientRect();
          const viewportHeight = scrollContainerEl.clientHeight;
          // Only reset when scrolling backwards (Page5 is below viewport)
          if (page5Rect.top > viewportHeight * 0.5) {
            isAnimatingRef.current = true;
            
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
        // Page6 observer logic removed - logo is now managed by wrapper
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

  // Background color is now set via CSS class on the section element
  // No need to set it dynamically to prevent flickering

  return (
    <div 
      ref={page5ContainerRef} 
      className="relative w-full h-full flex flex-col items-center justify-center"
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
        <div className="flex h-full gap-6 z-52 items-center" style={{ paddingLeft: '11.5vw', paddingRight: '0' }}>
          {/* Card 1 - Hidden when animated card1 is showing, visible when expanded */}
          <div 
            className="flex-shrink-0 w-[77vw] flex items-center justify-center snap-center"
            style={{
              opacity: cardPhase === 'expanded' ? 1 : 0,
              pointerEvents: cardPhase === 'expanded' ? 'auto' : 'none'
            }}
          >
            <div className="z-52 relative w-full h-[57vh] max-w-full max-h-[57vh] flex items-center justify-center" style={{ width: '77vw', height: '57vh' }}>
              <img
                src="/card1.png"
                alt="Card 1"
                className="object-cover rounded-3xl"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
              <img
                src="/card2.png"
                alt="Card 2"
                className="object-cover rounded-3xl"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
              <img
                src="/card3.png"
                alt="Card 3"
                className="object-cover rounded-3xl"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
        <img
          src="/card1.png"
          alt="Card 1"
          width={200}
          height={300}
          className="w-full h-full object-contain rounded-3xl"
        />
      </div>
    </div>
  );
}