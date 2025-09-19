"use client";

import { useEffect } from "react";
import { animate } from "animejs";
import { DUR_SCROLL_MS, EASING_DEFAULT } from "../lib/constants/animation";

type Options = {
  distancePx?: number;
  delaysMs?: number[];
  durationMs?: number;
  easing?: string;
  threshold?: number;
  reverseStartRatio?: number;
};

export function useStaggeredRiseOnIntersect(
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

    const distance = options?.distancePx ?? 32;
    const delays = options?.delaysMs ?? [0, 200, 400];
    const duration = options?.durationMs ?? DUR_SCROLL_MS;
    const easing = options?.easing ?? EASING_DEFAULT;
    const threshold = options?.threshold ?? 0.35;
    const reverseStartRatio = options?.reverseStartRatio ?? 0.9;

    // Initialize elements state
    elements.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = `translateY(${distance}px)`;
    });

    // Resolve scroll container (consistent with other hooks)
    const scrollEl =
      scrollContainerRef?.current ??
      (document.querySelector(
        "div.h-dvh.overflow-y-scroll"
      ) as HTMLElement | null);

    // Track scroll direction
    let lastScrollTop = scrollEl?.scrollTop ?? 0;
    let direction: "up" | "down" = "down";
    const handleScroll = () => {
      if (!scrollEl) return;
      const current = scrollEl.scrollTop;
      direction = current < lastScrollTop ? "up" : "down";
      lastScrollTop = current;
    };
    scrollEl?.addEventListener("scroll", handleScroll, { passive: true });

    let hasAnimatedIn = false;

    const animateIn = () => {
      elements.forEach((el, idx) => {
        // Ensure the starting side is applied before animating
        el.style.transform = `translateY(${
          direction === "up" ? -distance : distance
        }px)`;
        animate(el, {
          translateY: 0,
          easing,
          duration,
          delay: delays[idx] ?? 0,
        });
      });
      hasAnimatedIn = true;
    };

    const animateOut = () => {
      // reverse order for a pleasing retract
      const reversed = [...elements].reverse();
      reversed.forEach((el, idx) => {
        animate(el, {
          translateY: direction === "up" ? -distance : distance,
          easing,
          duration,
          delay: delays[idx] ?? 0,
        });
      });
      hasAnimatedIn = false;
    };

    let lastRatio = 0;
    let prevIsIntersecting = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== container) return;

          const isEntering = entry.isIntersecting && !prevIsIntersecting;
          const isExiting = !entry.isIntersecting && prevIsIntersecting;

          if (isEntering) {
            animateIn();
          } else if (entry.isIntersecting) {
            if (
              direction === "up" &&
              entry.intersectionRatio < reverseStartRatio &&
              entry.intersectionRatio < lastRatio
            ) {
              // Start reversing while still partially visible on upward scroll
              animateOut();
            }
          } else if (
            !entry.isIntersecting &&
            direction === "up" &&
            hasAnimatedIn
          ) {
            // Ensure reverse also triggers once it leaves the viewport on upward scroll
            animateOut();
          }

          if (isExiting) {
            // Allow a fresh animate-in on next entry from either direction
            hasAnimatedIn = false;
            // Pre-position elements so the next entry animates from the opposite side
            const preset = direction === "down" ? -distance : distance;
            elements.forEach((el) => {
              el.style.transform = `translateY(${preset}px)`;
            });
          }

          lastRatio = entry.intersectionRatio;
          prevIsIntersecting = entry.isIntersecting;
        });
      },
      { threshold, root: scrollEl ?? undefined }
    );

    io.observe(container);

    return () => {
      io.disconnect();
      scrollEl?.removeEventListener("scroll", handleScroll);
    };
  }, [
    containerRef,
    elementRefs,
    scrollContainerRef,
    options?.distancePx,
    options?.durationMs,
    options?.easing,
    options?.threshold,
    options?.delaysMs,
    options?.reverseStartRatio,
  ]);
}
