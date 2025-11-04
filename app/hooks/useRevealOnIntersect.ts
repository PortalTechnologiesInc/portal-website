"use client";

import { useEffect } from "react";
import { animate } from "animejs";
import {
  DUR_REVEAL_SHORT_MS,
  EASING_DEFAULT,
} from "../lib/constants/animation";

export function useRevealOnIntersect(targets: () => HTMLElement[]) {
  useEffect(() => {
    const elements = targets().filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const animateElement = (el: HTMLElement, index: number) => {
      const startingTranslate = index === 0 ? 0 : 1.5;
      animate(el, {
        opacity: [0, 1],
        translateY: [startingTranslate, 0],
        easing: EASING_DEFAULT,
        duration: DUR_REVEAL_SHORT_MS,
      });
    };

    elements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = index === 0 ? "translateY(0)" : "translateY(1.5rem)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = elements.indexOf(target);
            animateElement(target, index);
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.4 }
    );

    elements.forEach((el, index) => {
      // Check if element is already intersecting when observer is set up
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
      
      if (isVisible) {
        // Element is already in view, animate immediately
        animateElement(el, index);
      } else {
        // Element not in view, observe for intersection
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, [targets]);
}
