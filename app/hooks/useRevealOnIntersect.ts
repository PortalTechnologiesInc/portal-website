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

    elements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = index === 0 ? "translateY(0)" : "translateY(1.5rem)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const startingTranslate = target.style.transform?.includes("1.5rem")
              ? 1.5
              : 0;
            animate(target, {
              opacity: [0, 1],
              translateY: [startingTranslate, 0],
              easing: EASING_DEFAULT,
              duration: DUR_REVEAL_SHORT_MS,
            });
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.4 }
    );

    elements.forEach((el) => {
      io.observe(el);
    });
    return () => io.disconnect();
  }, [targets]);
}
