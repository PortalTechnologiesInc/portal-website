"use client";

import { useEffect } from "react";
// We compute transforms directly per scroll for deterministic, smooth behavior
import { computeSectionProgress } from "../lib/scroll/computeSectionProgress";
import { DUR_SCROLL_MS } from "../lib/constants/animation";

type Options = {
  distancePx?: number;
  continueDistancePx?: number;
  delaysMs?: number[];
  durationMs?: number;
  easing?: string;
  start?: number; // section progress start
  end?: number; // section progress end
  continueIntoNext?: boolean; // allow progress > 1 to carry into next section
  respectReducedMotion?: boolean; // if false, ignore prefers-reduced-motion
};

export function useStaggeredScrollRise(
  containerRef: React.RefObject<HTMLElement | null>,
  elementRefs: Array<React.RefObject<HTMLElement | null>>,
  scrollContainerRef?: React.RefObject<HTMLElement | null>,
  options?: Options
) {
  useEffect(() => {
    const container = containerRef.current;
    const elements = elementRefs
      .map((r) => r.current)
      .filter(Boolean) as HTMLElement[];
    if (!container || elements.length === 0) return;

    // Resolve sections relative to the wrapper to avoid SSR timing issues
    const toEl = container.closest("section") as HTMLElement | null;
    const fromEl = (toEl?.previousElementSibling as HTMLElement) ?? null;
    const nextEl = (toEl?.nextElementSibling as HTMLElement) ?? null;
    if (!fromEl || !toEl) return;

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const distance = options?.distancePx ?? 32;
    const delaysMs = options?.delaysMs ?? [0, 200, 400];
    const duration = options?.durationMs ?? DUR_SCROLL_MS;
    // easing is not used in direct transform approach; retained for API parity
    // const easing = options?.easing ?? EASING_DEFAULT;
    const start = options?.start ?? 0.2;
    const end = options?.end ?? 0.8;
    const continueDistance = options?.continueDistancePx ?? distance;

    // Prepare elements initial transform
    elements.forEach((el) => {
      el.style.transform = `translateY(${distance}px)`;
      el.style.opacity = "1";
    });

    if (reduced && options?.respectReducedMotion !== false) {
      // Snap to end state and skip listeners
      elements.forEach((el) => {
        el.style.transform = `translateY(0px)`;
      });
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const containerEl =
          scrollContainerRef?.current ??
          (document.querySelector(
            "div.h-dvh.overflow-y-scroll"
          ) as HTMLElement | null);
        if (!containerEl) {
          ticking = false;
          return;
        }

        // Compute section progress and normalize to [0,1] between start/end
        const pPrev = computeSectionProgress(
          fromEl as HTMLElement,
          toEl as HTMLElement
        );
        let np = (pPrev - start) / (end - start);
        np = Math.min(Math.max(np, 0), 1);

        // Compute within-section progress (0 at section top, 1 at bottom)
        // Compute based on offsets to avoid unused local rects
        const toTopAbs = toEl.offsetTop; // relative to scroll container
        const toHeight = Math.max(toEl.offsetHeight, 1);
        const scrollTop = containerEl.scrollTop;
        const within = Math.min(
          Math.max((scrollTop - toTopAbs) / toHeight, 0),
          1
        );

        // Next-section progress
        let nextP = 0;
        if (options?.continueIntoNext && nextEl) {
          nextP = computeSectionProgress(
            toEl as HTMLElement,
            nextEl as HTMLElement
          );
          nextP = Math.min(Math.max(nextP, 0), 1);
        }

        // Drive transforms directly from three phases:
        // 1) enter phase: from distance -> 0 using np
        // 2) within current section: from 0 -> -continueDistance using within
        // 3) into next section: further from -continueDistance -> -2*continueDistance using nextP
        elements.forEach((el, idx) => {
          const delay = delaysMs[idx] ?? 0;
          const delayFrac = Math.min(Math.max(delay / duration, 0), 0.99);

          const enterP = Math.min(
            Math.max((np - delayFrac) / (1 - delayFrac), 0),
            1
          );
          const withinP = Math.min(
            Math.max((within - delayFrac) / (1 - delayFrac), 0),
            1
          );
          const nextPhaseP = Math.min(
            Math.max((nextP - delayFrac) / (1 - delayFrac), 0),
            1
          );

          const translate =
            distance * (1 - enterP) -
            continueDistance * withinP -
            continueDistance * nextPhaseP;

          el.style.transform = `translateY(${translate}px)`;
        });
        ticking = false;
      });
    };

    const containerEl =
      scrollContainerRef?.current ??
      (document.querySelector(
        "div.h-dvh.overflow-y-scroll"
      ) as HTMLElement | null);
    if (containerEl) {
      containerEl.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => containerEl.removeEventListener("scroll", onScroll);
    }
  }, [
    containerRef,
    elementRefs,
    scrollContainerRef,
    options?.distancePx,
    options?.continueDistancePx,
    options?.delaysMs,
    options?.durationMs,
    options?.start,
    options?.end,
    options?.continueIntoNext,
    options?.respectReducedMotion,
  ]);
}
