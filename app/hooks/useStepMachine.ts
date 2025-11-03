"use client";

import { useEffect, useRef } from "react";
import { createFinalController } from "../lib/animation/finalController";

export function useStepMachine(
  sectionRefs: React.MutableRefObject<Array<HTMLElement | null>>,
  euroLockStep: React.MutableRefObject<number>,
  refs?: {
    logoYellow?: React.RefObject<HTMLElement | null>;
    logoPath?: React.RefObject<SVGPathElement | null>;
    finalTitle?: React.RefObject<HTMLElement | null>;
    finalSubtitle?: React.RefObject<HTMLElement | null>;
  },
  containerRef?: React.RefObject<HTMLElement | null>
) {
  const finalControllerRef = useRef<ReturnType<typeof createFinalController> | null>(null);

  // Page 4 animation controller only
  useEffect(() => {
    const container = (containerRef?.current as HTMLElement | null) ??
      (document.querySelector("div.h-dvh.overflow-y-scroll") as HTMLElement | null);
    if (!container) return;

    const logoYellow = refs?.logoYellow?.current ?? null;
    const finalTitle = refs?.finalTitle?.current ?? null;
    const finalSubtitle = refs?.finalSubtitle?.current ?? null;
    const logoPath = refs?.logoPath?.current ?? null;
    const finalSection = sectionRefs.current[3] ?? null;

    // Guard: if key refs missing, return early
    if (!logoYellow || !logoPath || !finalTitle || !finalSubtitle) {
      return;
    }

    // Create final controller
    if (!finalControllerRef.current) {
      finalControllerRef.current = createFinalController({
        logoYellow,
        logoPath,
        finalTitle,
        finalSubtitle,
      });
    }

    const DEBUG = true;
    const log = (...args: unknown[]) => {
      if (DEBUG) console.log("[final-controller]", ...args);
    };

    // Intersection observer for Page 4
    const finalSectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const controller = finalControllerRef.current;
        if (!controller) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Page 4 is visible - trigger forward animation
          log("Page 4 visible, triggering forward animation");
          controller.playForward();
        } else if (entry.intersectionRatio < 0.5) {
          // Page 4 not visible - trigger reverse animation
          log("Page 4 not visible, triggering reverse animation");
          controller.playReverse();
        }
      },
      {
        root: container,
        threshold: [0, 0.5, 1],
      }
    );

    if (finalSection) {
      finalSectionObserver.observe(finalSection);
    }

    return () => {
      finalSectionObserver.disconnect();
      
      if (finalControllerRef.current) {
        finalControllerRef.current.destroy();
        finalControllerRef.current = null;
      }
    };

  }, [
    containerRef?.current,
    refs?.logoYellow?.current,
    refs?.logoPath?.current,
    refs?.finalTitle?.current,
    refs?.finalSubtitle?.current,
  ]);
}