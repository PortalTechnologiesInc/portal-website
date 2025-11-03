"use client";

import { useRef, useEffect, useState } from "react";

type Props = {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

export function Page5({ scrollContainerRef }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardPhase, setCardPhase] = useState<'hidden' | 'center' | 'expanded'>('hidden');
  const page5ContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = page5ContainerRef.current;
    if (!container) return;

    const scrollContainerEl = scrollContainerRef.current;
    if (!scrollContainerEl) return;

    const page5Section = container.closest("section");
    if (!page5Section) return;

    let hasEntered = false;
    let isExiting = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        console.log('Page5 intersection:', {
          isIntersecting,
          intersectionRatio,
          hasEntered,
          isExiting,
          isVisible,
          isAnimating
        });

        // Enter animation: section becomes visible for the first time
        if (isIntersecting && intersectionRatio >= 0.5 && !hasEntered && !isAnimating) {
          console.log("Page5: Starting enter animation");
          hasEntered = true;
          setIsAnimating(true);
          
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
            setIsAnimating(false);
            console.log("Page5: Enter animation completed");
          }, 2200); // Total animation time
        }
        
        // Exit animation: section becomes invisible
        else if (!isIntersecting && hasEntered && isVisible && !isAnimating && !isExiting) {
          console.log("Page5: Starting exit animation");
          isExiting = true;
          setIsAnimating(true);
          
          // Start reverse animation
          setCardPhase('hidden');
          setIsVisible(false);
          
          // Animation complete
          setTimeout(() => {
            setIsAnimating(false);
            isExiting = false;
            hasEntered = false; // Reset for next cycle
            
            console.log("Page5: Exit animation completed");
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
      {/* Red Card Animation */}
      <div
        className="bg-red-600 rounded-3xl transition-all duration-1000 ease-out"
        style={{
          position: 'absolute',
          left: '50%',
          top: cardPhase === 'hidden' ? '100%' : '50%',
          transform: 'translate(-50%, -50%)',
          width: cardPhase === 'expanded' ? '80vw' : '200px',
          height: cardPhase === 'expanded' ? '80vh' : '300px',
          opacity: cardPhase === 'hidden' ? 0 : 1,
          transition: cardPhase === 'expanded' ? 'width 800ms ease-out, height 800ms ease-out' : 'all 1000ms ease-out'
        }}
      />

    </div>
  );
}
