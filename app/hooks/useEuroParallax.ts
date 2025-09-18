"use client";

import { useEffect } from "react";
import { buildPausedAnimation } from "../lib/animation/anime";
import { computeSectionProgress } from "../lib/scroll/computeSectionProgress";
import {
  EASING_DEFAULT,
  DUR_SCROLL_MS,
  EURO_SCROLL,
} from "../lib/constants/animation";

export function useEuroParallax(
  euroParallaxRef: React.RefObject<HTMLElement>,
  isActiveRef: React.RefObject<number>,
  containerRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const euroEl = euroParallaxRef.current;
    if (!euroEl) return;

    // Resolve sections relative to the wrapper to avoid SSR timing issues
    const toEl = euroEl.closest("section") as HTMLElement | null;
    const fromEl = (toEl?.previousElementSibling as HTMLElement) ?? null;
    if (!fromEl || !toEl) return;

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    euroEl.style.transform = `translateY(${EURO_SCROLL.startY}px)`;
    euroEl.style.opacity = "0";

    const tl = buildPausedAnimation(euroEl, {
      translateY: [EURO_SCROLL.startY, EURO_SCROLL.endY],
      opacity: [0, 1],
      duration: DUR_SCROLL_MS,
      easing: EASING_DEFAULT,
    });

    if (reduced) {
      // Snap to end state and skip listeners
      euroEl.style.transform = `translateY(${EURO_SCROLL.endY}px)`;
      euroEl.style.opacity = "1";
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const container =
          containerRef?.current ??
          document.querySelector("div.h-dvh.overflow-y-scroll");
        if (!container) {
          ticking = false;
          return;
        }
        if (isActiveRef.current !== 0) {
          ticking = false;
          return;
        }
        const p = computeSectionProgress(
          fromEl as HTMLElement,
          toEl as HTMLElement
        );
        let eurP =
          (p - EURO_SCROLL.start) / (EURO_SCROLL.end - EURO_SCROLL.start);
        eurP = Math.min(Math.max(eurP, 0), 1);
        tl.seek(DUR_SCROLL_MS * eurP);
        ticking = false;
      });
    };

    const container =
      containerRef?.current ??
      document.querySelector("div.h-dvh.overflow-y-scroll");
    if (container) {
      container.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => container.removeEventListener("scroll", onScroll);
    }
  }, [euroParallaxRef, isActiveRef, containerRef?.current]);
}
