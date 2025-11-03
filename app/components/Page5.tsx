"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { resetLogoYellow } from "./Page4";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page5({ scrollContainerRef }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [cardPhase, setCardPhase] = useState<'hidden' | 'center' | 'expanded'>('hidden');
  const page5ContainerRef = useRef<HTMLDivElement | null>(null);
  const hasEnteredRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const isExitingRef = useRef(false);

  useEffect(() => {
    const container = page5ContainerRef.current;
    if (!container) return;

    const scrollContainerEl = scrollContainerRef.current;
    if (!scrollContainerEl) return;

    const page5Section = container.closest("section");
    if (!page5Section) return;

    const ensureLogoVisible = () => {
      const logoYellow = document.querySelector('[data-logo-yellow]') as HTMLElement;
      if (logoYellow) {
        // Ensure logo maintains its visible state
        logoYellow.style.opacity = "1";
        logoYellow.style.top = "50vh";
        logoYellow.style.transform = "translate(-50%, -50%)";
        logoYellow.style.width = "900px";
        logoYellow.style.height = "900px";
        logoYellow.style.transition = "none";
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        // Keep logo visible whenever Page5 is intersecting
        if (isIntersecting && intersectionRatio >= 0.5) {
          ensureLogoVisible();

          // Enter animation: section becomes visible for the first time
          if (!hasEnteredRef.current && !isAnimatingRef.current) {
            hasEnteredRef.current = true;
            isAnimatingRef.current = true;
            
            // Start background transition and card rise simultaneously
            setTimeout(() => {
              setIsVisible(true);
              setCardPhase('center');
            }, 100);
            
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
        
        // Exit animation: section becomes invisible
        else if (!isIntersecting && hasEnteredRef.current && cardPhase !== 'hidden' && !isAnimatingRef.current && !isExitingRef.current) {
          isExitingRef.current = true;
          isAnimatingRef.current = true;
          
          // Reset logo when leaving Page5 (going backwards)
          resetLogoYellow();
          
          // Start reverse animation
          setCardPhase('hidden');
          setIsVisible(false);
          
          // Animation complete
          setTimeout(() => {
            isAnimatingRef.current = false;
            isExitingRef.current = false;
            hasEnteredRef.current = false; // Reset for next cycle
          }, 1000);
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    observer.observe(page5Section);

    return () => {
      observer.disconnect();
    };
  }, [scrollContainerRef]);

  return (
    <div 
      ref={page5ContainerRef} 
      className="relative w-full h-dvh flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: isVisible ? '#ffffff' : '#141416',
        transition: 'background-color 1000ms ease-out'
      }}
    >
      {/* Card1 Image Animation */}
      <div
        className="transition-all duration-1000 ease-out"
        style={{
          position: 'absolute',
          left: '50%',
          top: cardPhase === 'hidden' ? '100%' : '50%',
          transform: 'translate(-50%, -50%)',
          width: cardPhase === 'expanded' ? '85vw' : '200px',
          height: cardPhase === 'expanded' ? '65vh' : '300px',
          opacity: cardPhase === 'hidden' ? 0 : 1,
          transition: cardPhase === 'expanded' ? 'width 800ms ease-out, height 800ms ease-out' : 'all 1000ms ease-out'
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
  );
}