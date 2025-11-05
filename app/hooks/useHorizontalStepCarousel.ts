"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  totalSteps?: number;
  onStepChange?: (step: number) => void;
  onExitUp?: () => void;
  onExitDown?: () => void;
};

export function useHorizontalStepCarousel(
  containerRef: React.RefObject<HTMLElement | null>,
  scrollContainerRef?: React.RefObject<HTMLElement | null>,
  options?: Options
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageActive, setIsPageActive] = useState(false);

  const totalSteps = options?.totalSteps ?? 3;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollContainerEl =
      scrollContainerRef?.current ??
      (document.querySelector("#main-scroll-container") as HTMLElement | null);
    if (!scrollContainerEl) return;

    const page3Section = container.closest("section") as HTMLElement | null;
    if (!page3Section) return;

    // Use IntersectionObserver to detect when Page3 is active
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isActive = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        
        console.log('Page3 intersection:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          isActive,
          currentStep
        });
        
        if (isActive && !isPageActive) {
          // Page3 just became active - reset to step 0
          console.log('Page3 became active, resetting to step 0');
          setCurrentStep(0);
        }
        
        setIsPageActive(isActive);
      },
      {
        root: scrollContainerEl,
        threshold: [0, 0.5, 1],
      }
    );

    observer.observe(page3Section);

    // Horizontal scroll handler
    const handleHorizontalScroll = (e: WheelEvent) => {
      if (!isPageActive || isTransitioning) return;
      
      const deltaX = e.deltaX;
      const deltaY = e.deltaY;
      
      console.log('Horizontal scroll detected:', { deltaX, deltaY, currentStep });
      
      // Determine scroll direction based on dominant axis
      const isHorizontalScroll = Math.abs(deltaX) > Math.abs(deltaY);
      
      // Only prevent default for horizontal scrolls to allow CSS scroll-snap to work
      if (isHorizontalScroll) {
        e.preventDefault();
        e.stopPropagation();
        
        if (deltaX > 0) {
          // Scroll right - next step
          if (currentStep < totalSteps - 1) {
            const newStep = currentStep + 1;
            console.log('Changing step from', currentStep, 'to', newStep, '(scroll right)');
            setIsTransitioning(true);
            setCurrentStep(newStep);
            options?.onStepChange?.(newStep);
            
            setTimeout(() => {
              setIsTransitioning(false);
            }, 300);
          }
        } else {
          // Scroll left - previous step
          if (currentStep > 0) {
            const newStep = currentStep - 1;
            console.log('Changing step from', currentStep, 'to', newStep, '(scroll left)');
            setIsTransitioning(true);
            setCurrentStep(newStep);
            options?.onStepChange?.(newStep);
            
            setTimeout(() => {
              setIsTransitioning(false);
            }, 300);
          }
        }
      } else {
        // Vertical scroll - allow it to pass through for CSS scroll-snap
        // Only handle exits if we're at the boundaries, but don't prevent default
        if (deltaY > 0) {
          // Scroll down - exit to Page 4 if on last step
          if (currentStep === totalSteps - 1) {
            console.log('Exiting down to Page 4 (vertical scroll)');
            // Don't call onExitDown here - let CSS scroll-snap handle it naturally
            return;
          }
        } else {
          // Scroll up - exit to Page 2 if on first step
          if (currentStep === 0) {
            console.log('Exiting up to Page 2 (vertical scroll)');
            // Don't call onExitUp here - let CSS scroll-snap handle it naturally
            return;
          }
        }
        // For all other vertical scrolls, let CSS scroll-snap handle it
        return;
      }
    };

    // Touch/swipe handler for horizontal navigation
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!isPageActive || isTransitioning) return;
      
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      
      console.log('Touch start:', { touchStartX, touchStartY, currentStep });
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPageActive || isTransitioning) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;
      
      console.log('Touch end:', { 
        deltaX, 
        deltaY, 
        currentStep,
        isHorizontalSwipe: Math.abs(deltaX) > Math.abs(deltaY)
      });
      
      // Only process horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left - next step
          if (currentStep < totalSteps - 1) {
            const newStep = currentStep + 1;
            console.log('Changing step from', currentStep, 'to', newStep, '(swipe left)');
            setIsTransitioning(true);
            setCurrentStep(newStep);
            options?.onStepChange?.(newStep);
            
            setTimeout(() => {
              setIsTransitioning(false);
            }, 300);
          }
        } else {
          // Swipe right - previous step
          if (currentStep > 0) {
            const newStep = currentStep - 1;
            console.log('Changing step from', currentStep, 'to', newStep, '(swipe right)');
            setIsTransitioning(true);
            setCurrentStep(newStep);
            options?.onStepChange?.(newStep);
            
            setTimeout(() => {
              setIsTransitioning(false);
            }, 300);
          }
        }
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        // Vertical swipe - handle exits
        if (deltaY > 0) {
          // Swipe down - exit to Page 4 if on last step
          if (currentStep === totalSteps - 1) {
            console.log('Exiting down to Page 4 (vertical swipe)');
            options?.onExitDown?.();
            return;
          }
        } else {
          // Swipe up - exit to Page 2 if on first step
          if (currentStep === 0) {
            console.log('Exiting up to Page 2 (vertical swipe)');
            options?.onExitUp?.();
            return;
          }
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
    scrollContainerRef,
    currentStep,
    isTransitioning,
    isPageActive,
    totalSteps,
    options?.onStepChange,
    options?.onExitUp,
    options?.onExitDown,
  ]);

  return {
    currentStep,
    isTransitioning,
    isPageActive,
    goToStep: (step: number) => {
      if (step >= 0 && step < totalSteps && !isTransitioning) {
        setIsTransitioning(true);
        setCurrentStep(step);
        options?.onStepChange?.(step);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
    },
  };
}