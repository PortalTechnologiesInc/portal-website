import { animate, createTimeline } from "animejs";
import { DUR_STEP_MS } from "../constants/animation";

export interface FinalControllerRefs {
  logoYellow: HTMLElement | null;
  logoPath: SVGPathElement | null;
  finalTitle: HTMLElement | null;
  finalSubtitle: HTMLElement | null;
}

export function createFinalController(refs: FinalControllerRefs) {
  const { logoYellow, logoPath, finalTitle, finalSubtitle } = refs;

  let isAnimating = false;
  let currentAnimation: ReturnType<typeof animate> | null = null;
  let timeline: ReturnType<typeof createTimeline> | null = null;

  // Create timeline once
  const createTimelineOnce = () => {
    if (timeline) return timeline;

    timeline = createTimeline({ autoplay: false });

    // Initial states
    if (logoYellow) {
      timeline.set(logoYellow, {
        opacity: 0,
        width: 20,
        translateX: "-50%",
        translateY: "40vh",
      });
    }
    if (finalTitle && finalSubtitle) {
      timeline.set([finalTitle, finalSubtitle], {
        opacity: 0,
        translateY: 12,
      });
    }
    if (logoYellow) {
      timeline.add(logoYellow, {
        translateX: ["-50%", "-50%"],
        translateY: ["40vh", "-50%"],
        opacity: [0, 1],
        duration: DUR_STEP_MS,
      }, 0);
    }
    if (logoYellow) {
      timeline.add(logoYellow, {
        width: [20, 950],
        duration: DUR_STEP_MS
      }, "<")
      if (logoPath) {
        timeline.add(logoPath, {
          strokeWidth: [3, 1.2],
          duration: DUR_STEP_MS
        }, "<")
      }
      if (finalTitle && finalSubtitle) {
        timeline.add([finalTitle, finalSubtitle], {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: DUR_STEP_MS
        }, "<");
      }
      return timeline;
    };

    const playForward = (): Promise<void> => {
      return new Promise((resolve) => {
        if (isAnimating) {
          resolve();
          return;
        }

        if (!logoYellow || !logoPath || !finalTitle || !finalSubtitle) {
          resolve();
          return;
        }

        isAnimating = true;

        // Cancel any ongoing animation
        if (currentAnimation) {
          currentAnimation.pause();
        }

        const tl = createTimelineOnce();

        // Reset to initial state
        if (tl) {
          (tl as unknown as { currentTime?: number }).currentTime = 0;
        }

        // Animate forward
        currentAnimation = animate(tl, {
          currentTime: (tl as unknown as { duration?: number })?.duration ?? 0,
          duration: DUR_STEP_MS,
          easing: "easeOutCubic",
          complete: () => {
            isAnimating = false;
            currentAnimation = null;
            resolve();
          },
        });
      });
    };

    const playReverse = (): Promise<void> => {
      return new Promise((resolve) => {
        if (isAnimating) {
          resolve();
          return;
        }

        if (!logoYellow || !logoPath || !finalTitle || !finalSubtitle) {
          resolve();
          return;
        }

        isAnimating = true;

        // Cancel any ongoing animation
        if (currentAnimation) {
          currentAnimation.pause();
        }

        const tl = createTimelineOnce();

        // Start from end state
        if (tl) {
          (tl as unknown as { currentTime?: number }).currentTime = (tl as unknown as { duration?: number }).duration;
        }

        // Animate reverse
        currentAnimation = animate(tl, {
          currentTime: 0,
          duration: DUR_STEP_MS,
          easing: "easeOutCubic",
          complete: () => {
            isAnimating = false;
            currentAnimation = null;
            resolve();
          },
        });
      });
    };

    const seekTo = (progress: number): void => {
      if (!logoYellow || !logoPath || !finalTitle || !finalSubtitle) return;

      const tl = createTimelineOnce();
      const clampedProgress = Math.max(0, Math.min(1, progress));
      if (tl) {
        (tl as unknown as { currentTime?: number }).currentTime = clampedProgress * ((tl as unknown as { duration?: number })?.duration ?? 0);
      }
    };

    const isCurrentlyAnimating = (): boolean => {
      return isAnimating;
    };

    const destroy = (): void => {
      if (currentAnimation) {
        currentAnimation.pause();
        currentAnimation = null;
      }
      timeline = null;
      isAnimating = false;
    };

    return {
      playForward,
      playReverse,
      seekTo,
      isAnimating: isCurrentlyAnimating,
      destroy,
    };
  }
}