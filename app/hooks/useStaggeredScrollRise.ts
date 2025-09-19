"use client";

import { useEffect } from "react";
import { buildPausedAnimation } from "../lib/animation/anime";
import { computeSectionProgress } from "../lib/scroll/computeSectionProgress";
import { DUR_SCROLL_MS, EASING_DEFAULT } from "../lib/constants/animation";

type Options = {
  distancePx?: number;
  delaysMs?: number[];
  durationMs?: number;
  easing?: string;
  start?: number; // section progress start
  end?: number; // section progress end
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
    const easing = options?.easing ?? EASING_DEFAULT;
    const start = options?.start ?? 0.2;
    const end = options?.end ?? 0.8;

    // Prepare elements initial transform
    elements.forEach((el) => {
      el.style.transform = `translateY(${distance}px)`;
      el.style.opacity = "1";
    });

    // Build paused animations for each element
    const animations = elements.map((el) =>
      buildPausedAnimation(el, {
        translateY: [distance, 0],
        duration,
        easing,
      })
    );

    if (reduced) {
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

        // If next section started, clamp to end state so animation fully finishes in page 2
        if (nextEl) {
          const pNext = computeSectionProgress(
            toEl as HTMLElement,
            nextEl as HTMLElement
          );
          if (pNext > 0) {
            np = 1;
          }
        }

        // Seek each animation with delay that finishes together at np=1
        animations.forEach((anim, idx) => {
          const delay = delaysMs[idx] ?? 0;
          const delayFrac = Math.min(Math.max(delay / duration, 0), 0.99);
          const localP = Math.min(
            Math.max((np - delayFrac) / (1 - delayFrac), 0),
            1
          );
          const t = localP * duration;
          anim.seek(t);
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
    options?.delaysMs,
    options?.durationMs,
    options?.easing,
    options?.start,
    options?.end,
  ]);
}
