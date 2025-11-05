"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  containerRef: React.RefObject<HTMLElement | null>;
  cardsRef: React.RefObject<HTMLElement[]>;
  totalCards: number;
  onEnterCarousel?: () => void;
  onExitCarousel?: () => void;
  enableVerticalExit?: boolean;
  autoEnter?: boolean;
};

export function useHorizontalCardCarousel(options: Options) {
  const {
    containerRef,
    cardsRef,
    totalCards,
    onEnterCarousel,
    onExitCarousel,
    enableVerticalExit = false,
    autoEnter = false,
  } = options;

  const [currentCard, setCurrentCard] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollContainerEl = document.querySelector(
      "#main-scroll-container"
    ) as HTMLElement | null;
    if (!scrollContainerEl) return;

    const section = container.closest("section") as HTMLElement | null;
    if (!section) return;

    // Use IntersectionObserver to detect when section is active
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isActiveNow = entry.isIntersecting && entry.intersectionRatio >= 0.5;

        if (isActiveNow && !isActive) {
          setIsActive(true);
          if (autoEnter) {
            setCurrentCard(0);
          }
          onEnterCarousel?.();
        } else if (!isActiveNow && isActive) {
          setIsActive(false);
          onExitCarousel?.();
        }
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    observer.observe(section);

    // Horizontal scroll handler
    const handleHorizontalScroll = (e: WheelEvent) => {
      if (!isActive || isTransitioning) return;

      const deltaX = e.deltaX;
      const deltaY = e.deltaY;

      // Determine scroll direction based on dominant axis
      const isHorizontalScroll = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalScroll) {
        e.preventDefault();
        e.stopPropagation();

        if (deltaX > 0) {
          // Scroll right - next card
          if (currentCard < totalCards - 1) {
            setIsTransitioning(true);
            setCurrentCard(currentCard + 1);
            setTimeout(() => setIsTransitioning(false), 300);
          }
        } else {
          // Scroll left - previous card
          if (currentCard > 0) {
            setIsTransitioning(true);
            setCurrentCard(currentCard - 1);
            setTimeout(() => setIsTransitioning(false), 300);
          }
        }
      } else if (enableVerticalExit && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical scroll - allow exit if enabled
        if (deltaY > 0 && currentCard === totalCards - 1) {
          // Scroll down - exit if on last card
          onExitCarousel?.();
        } else if (deltaY < 0 && currentCard === 0) {
          // Scroll up - exit if on first card
          onExitCarousel?.();
        }
      }
    };

    // Touch/swipe handler for horizontal navigation
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isActive || isTransitioning) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isActive || isTransitioning) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;

      // Only process horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left - next card
          if (currentCard < totalCards - 1) {
            setIsTransitioning(true);
            setCurrentCard(currentCard + 1);
            setTimeout(() => setIsTransitioning(false), 300);
          }
        } else {
          // Swipe right - previous card
          if (currentCard > 0) {
            setIsTransitioning(true);
            setCurrentCard(currentCard - 1);
            setTimeout(() => setIsTransitioning(false), 300);
          }
        }
      } else if (enableVerticalExit && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        // Vertical swipe - handle exits
        if (deltaY > 0 && currentCard === totalCards - 1) {
          // Swipe down - exit if on last card
          onExitCarousel?.();
        } else if (deltaY < 0 && currentCard === 0) {
          // Swipe up - exit if on first card
          onExitCarousel?.();
        }
      }
    };

    // Add event listeners
    container.addEventListener("wheel", handleHorizontalScroll, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener("wheel", handleHorizontalScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    containerRef,
    currentCard,
    isTransitioning,
    isActive,
    totalCards,
    onEnterCarousel,
    onExitCarousel,
    enableVerticalExit,
    autoEnter,
  ]);

  return {
    currentCard,
    isTransitioning,
    isActive,
  };
}

