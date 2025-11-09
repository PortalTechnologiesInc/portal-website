"use client";

import { useEffect, useRef } from 'react';

export function useScrollSnapFallback(containerRef: React.RefObject<HTMLElement | null>) {
  const isScrolling = useRef(false);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling.current) return;
      
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const currentSection = Math.round(scrollTop / containerHeight);
      
      // Only snap if we're close to a section boundary
      const snapThreshold = 50;
      const expectedScrollTop = currentSection * containerHeight;
      const distance = Math.abs(scrollTop - expectedScrollTop);
      
      if (distance > snapThreshold) {
        isScrolling.current = true;
        container.scrollTo({
          top: expectedScrollTop,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          isScrolling.current = false;
        }, 300);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);
}

