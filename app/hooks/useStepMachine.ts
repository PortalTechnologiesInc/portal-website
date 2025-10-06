"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, onScroll } from "animejs";
import { createLogoRevealAnimationController } from "../lib/animation/logoRevealController";
import { DUR_STEP_MS, EASING_DEFAULT, STEP } from "../lib/constants/animation";

export function useStepMachine(
  sectionRefs: React.MutableRefObject<Array<HTMLElement | null>>,
  euroLockStep: React.MutableRefObject<number>,
  refs?: {
    euro?: React.RefObject<HTMLElement | null>;
    lock?: React.RefObject<HTMLElement | null>;
    sad?: React.RefObject<HTMLElement | null>;
    initialText?: React.RefObject<HTMLElement | null>;
    newText?: React.RefObject<HTMLElement | null>;
    sadText?: React.RefObject<HTMLElement | null>;
    euroGroup?: React.RefObject<HTMLElement | null>;
    logoYellow?: React.RefObject<HTMLElement | null>;
    logoPath?: React.RefObject<SVGPathElement | null>;
    debug?: React.RefObject<HTMLDivElement | null>;
    finalTitle?: React.RefObject<HTMLElement | null>;
    finalSubtitle?: React.RefObject<HTMLElement | null>;
  },
  containerRef?: React.RefObject<HTMLElement | null>
) {
  const USE_OBSERVERS_GLOBAL = true;
  const isAnimating = { current: false } as React.MutableRefObject<boolean>;
  const step4TimelineRef = useRef<ReturnType<typeof createTimeline> | null>(
    null
  );
  const finalControllerRef = useRef<ReturnType<
    typeof createLogoRevealAnimationController
  > | null>(null);
  const isScrollingRef = useRef(false);
  const scrollSettleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const euroSnapEnteredAtRef = useRef<number>(0);
  const stepCooldownUntilRef = useRef<number>(0);
  const scrubTimelineRef = useRef<ReturnType<typeof createTimeline> | null>(
    null
  );
  const suppressFinalAutoEnterUntilRef = useRef<number>(0);
  const snapDisabledRef = useRef<boolean>(false);
  const euroProgressRef = useRef<number>(0);
  const lastEuroTimeRef = useRef<number>(0);
  const euroSnapAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const euroStepAnimatingRef = useRef<boolean>(false);
  const finalProgressRef = useRef<number>(0);
  const finalAnimatingRef = useRef<boolean>(false);

  // Step transitions and input handlers
  useEffect(() => {
    const USE_OBSERVERS = USE_OBSERVERS_GLOBAL;
    let touchStartY = 0;
    let touchEndY = 0;

    const euroSvg = refs?.euro?.current ?? null;
    const lockSvg = refs?.lock?.current ?? null;
    const sadSvg = refs?.sad?.current ?? null;
    const initialText = refs?.initialText?.current ?? null;
    const newText = refs?.newText?.current ?? null;
    const sadText = refs?.sadText?.current ?? null;
    const euroGroup = refs?.euroGroup?.current ?? null;
    const logoYellow = refs?.logoYellow?.current ?? null;
    const finalTitle = refs?.finalTitle?.current ?? null;
    const finalSubtitle = refs?.finalSubtitle?.current ?? null;
    const logoPath = refs?.logoPath?.current ?? null;
    if (
      !euroSvg ||
      !lockSvg ||
      !sadSvg ||
      !initialText ||
      !newText ||
      !sadText ||
      !euroGroup
    )
      return;

    // Build Page 3 scrub timeline once (Euro→Lock→Sad smooth)
    if (!scrubTimelineRef.current) {
      const tl = createTimeline({ autoplay: false });
      // Segment lengths (tune feel here)
      const seg = 800;
      // Ensure starting states are applied immediately
      tl.set(euroSvg, {
        translateX: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: 0,
      });
      tl.set(lockSvg, { translateX: 200, opacity: 0, duration: 0 });
      tl.set(sadSvg, { translateX: 200, opacity: 0, duration: 0 });
      tl.set(initialText, { opacity: 1, duration: 0 });
      tl.set(newText, { opacity: 0, duration: 0 });
      tl.set(sadText, { opacity: 0, duration: 0 });

      // Phase 1: Euro→Lock (0..seg)
      tl.add(
        euroSvg,
        {
          translateX: STEP.euroToLockTranslateX,
          filter: `blur(${STEP.blurLightPx}px)`,
          opacity: 0.5,
          duration: seg,
        },
        0
      )
        .add(lockSvg, { translateX: 0, opacity: 1, duration: seg }, 0)
        .add(initialText, { opacity: [1, 0], duration: seg }, 0)
        .add(newText, { opacity: [0, 1], duration: seg }, 0);

      // Phase 2: Lock→Sad (seg..total)
      tl.add(
        euroSvg,
        {
          translateX: STEP.euroDeepLeftTranslateX,
          filter: `blur(${STEP.blurHeavyPx}px)`,
          opacity: 0.3,
          duration: seg,
        },
        seg
      )
        .add(
          lockSvg,
          {
            translateX: STEP.lockToSadTranslateX,
            filter: `blur(${STEP.blurLightPx}px)`,
            opacity: 0.5,
            duration: seg,
          },
          seg
        )
        .add(sadSvg, { translateX: 0, opacity: 1, duration: seg }, seg)
        .add(newText, { opacity: [1, 0], duration: seg }, seg)
        .add(sadText, { opacity: [0, 1], duration: seg }, seg);

      scrubTimelineRef.current = tl;
    }

    // Build Logo Reveal controller once
    if (
      !finalControllerRef.current &&
      euroGroup &&
      logoYellow &&
      logoPath &&
      finalTitle &&
      finalSubtitle
    ) {
      finalControllerRef.current = createLogoRevealAnimationController(
        { euroGroup, logoYellow, logoPath, finalTitle, finalSubtitle },
        DUR_STEP_MS
      );
    }

    const checkIfInEuroSection = () => {
      const euroSection = sectionRefs.current[2];
      if (!euroSection) return false;
      const rect = euroSection.getBoundingClientRect();
      const snap = Math.abs(rect.top) < STEP.euroSectionTopThresholdPx;
      if (snap && euroSnapEnteredAtRef.current === 0) {
        euroSnapEnteredAtRef.current = Date.now();
      } else if (!snap) {
        euroSnapEnteredAtRef.current = 0;
      }
      return snap;
    };

    const euroSnapSettled = () => {
      return (
        euroSnapEnteredAtRef.current > 0 &&
        Date.now() - euroSnapEnteredAtRef.current > 120
      );
    };

    const checkIfInFinalSection = () => {
      const finalSection = sectionRefs.current[3];
      if (!finalSection) return false;
      const rect = finalSection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh && rect.bottom > 0;
    };

    const setDebug = (_: string) => {};

    const animateToLockStep = (targetStep: number) => {
      const finalAnimating = !!finalControllerRef.current?.isAnimating?.();
      const isReverseFromFinal =
        targetStep === 2 &&
        (euroLockStep.current === 3 || finalAnimating) &&
        !!finalControllerRef.current;
      if (isAnimating.current && !isReverseFromFinal) return;
      isAnimating.current = true;
      // Cooldown to swallow fast swipes that would skip steps
      stepCooldownUntilRef.current = Date.now() + 300;

      if (targetStep === 1) {
        setDebug("Step: Lock (1)");
        if (euroLockStep.current === 2) {
          animate(sadSvg, {
            translateX: 200,
            opacity: 0,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(lockSvg, {
            translateX: 0,
            filter: "blur(0px)",
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(euroSvg, {
            translateX: STEP.euroToLockTranslateX,
            filter: "blur(10px)",
            opacity: 0.5,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(sadText, {
            opacity: 0,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(newText, {
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
        } else {
          animate(euroSvg, {
            translateX: STEP.euroToLockTranslateX,
            filter: "blur(10px)",
            opacity: 0.5,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(lockSvg, {
            translateX: 0,
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(initialText, {
            opacity: 0,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(newText, {
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
        }
      } else if (targetStep === 2) {
        setDebug("Step: Sad (2)");
        if (euroLockStep.current === 3 && finalControllerRef.current) {
          // Reverse from Step 4 back to Sad
          // Suppress auto re-entering Final while the user is reversing
          suppressFinalAutoEnterUntilRef.current =
            Date.now() + (DUR_STEP_MS + 800);
          finalControllerRef.current.playReverse().then(() => {
            // Ensure euroGroup becomes visible again after reversing from final
            try {
              if (euroGroup) {
                (euroGroup as unknown as { style?: CSSStyleDeclaration }).style &&
                  ((euroGroup as unknown as { style: CSSStyleDeclaration }).style.opacity = "1");
              }
            } catch {}
            isAnimating.current = false;
            euroLockStep.current = 2;
          });
          return;
        }
        animate(euroSvg, {
          translateX: STEP.euroDeepLeftTranslateX,
          filter: `blur(${STEP.blurHeavyPx}px)`,
          opacity: 0.3,
          duration: DUR_STEP_MS,
          easing: EASING_DEFAULT,
        });
        animate(lockSvg, {
          translateX: STEP.lockToSadTranslateX,
          filter: `blur(${STEP.blurLightPx}px)`,
          opacity: 0.5,
          duration: DUR_STEP_MS,
          easing: EASING_DEFAULT,
        });
        animate(sadSvg, {
          translateX: 0,
          opacity: 1,
          duration: DUR_STEP_MS,
          easing: EASING_DEFAULT,
        });
        animate(newText, {
          opacity: 0,
          duration: DUR_STEP_MS,
          easing: EASING_DEFAULT,
        });
        animate(sadText, {
          opacity: 1,
          duration: DUR_STEP_MS,
          easing: EASING_DEFAULT,
        });
      } else if (targetStep === 0) {
        setDebug("Step: Euro (0)");
        if (euroLockStep.current === 2) {
          animate(sadSvg, {
            translateX: STEP.enterFromRightTranslateX,
            opacity: 0,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(euroSvg, {
            translateX: 0,
            filter: "blur(0px)",
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(sadText, {
            opacity: 0,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(initialText, {
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
        } else {
          animate(lockSvg, {
            translateX: STEP.enterFromRightTranslateX,
            opacity: 0,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(euroSvg, {
            translateX: 0,
            filter: "blur(0px)",
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(newText, {
            opacity: 0,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
          animate(initialText, {
            opacity: 1,
            duration: DUR_STEP_MS,
            easing: EASING_DEFAULT,
          });
        }
      } else if (targetStep === 3) {
        setDebug("Step: Final (3)");
        if (euroLockStep.current !== 2) {
          isAnimating.current = false;
          return;
        }
        // Ensure timeline exists (lazy-build if needed)
        if (
          !step4TimelineRef.current &&
          logoYellow &&
          logoPath &&
          finalTitle &&
          finalSubtitle
        ) {
          const tl = createTimeline({ autoplay: false });
          tl.add(
            euroGroup,
            { scale: 0.85, duration: DUR_STEP_MS },
            "<<"
          )
            .add(
              logoYellow,
              {
                translateX: ["-50%", "-50%"],
                translateY: ["40vh", "-50%"],
                opacity: [0, 1],
                duration: DUR_STEP_MS,
              },
              "-=300"
            )
            .add(logoYellow, { width: [20, 950], duration: DUR_STEP_MS }, "<")
            .add(
              logoPath,
              { strokeWidth: [3, 1.2], duration: DUR_STEP_MS },
              "<<-=200"
            )
            .add(
              [finalTitle, finalSubtitle],
              { opacity: [0, 1], translateY: [12, 0], duration: DUR_STEP_MS },
              "<"
            );
          step4TimelineRef.current = tl;
        }
        if (!finalControllerRef.current) {
          isAnimating.current = false;
          return;
        }
        // Play Step 4 forward via controller (set step to 3 only after completion)
        finalControllerRef.current.playForward().then(() => {
          isAnimating.current = false;
          euroLockStep.current = 3;
        });
        return;
      }

      setTimeout(() => {
        isAnimating.current = false;
        euroLockStep.current = targetStep;
      }, DUR_STEP_MS + 50);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;
      if (Math.abs(swipeDistance) < 50) return;
      // In Final: reverse on upward swipe (finger up), block downward
      if (checkIfInFinalSection() || euroLockStep.current === 3) {
        if (swipeDistance > 0 && euroLockStep.current === 3) {
          e.preventDefault();
          animateToLockStep(2);
        } else if (swipeDistance < 0 && euroLockStep.current === 3) {
          e.preventDefault();
        }
        return;
      }
      if (isAnimating.current) return;
      if (Date.now() < stepCooldownUntilRef.current) {
        e.preventDefault();
        return;
      }
      // In Euro section: require snap-settle before handling first input
      if (checkIfInEuroSection()) {
        if (!euroSnapSettled() && Math.abs(swipeDistance) < 80) {
          e.preventDefault();
          return;
        }
        if (Date.now() < stepCooldownUntilRef.current) {
          e.preventDefault();
          return;
        }
        if (swipeDistance > 0) {
          // Swipe up (scroll down): advance steps
          if (euroLockStep.current < 2) {
            e.preventDefault();
            animateToLockStep(euroLockStep.current + 1);
          }
          // if at Sad (2): allow natural scroll into page 4 (no preventDefault)
        } else {
          // Swipe down (scroll up): reverse steps
          if (euroLockStep.current > 0) {
            e.preventDefault();
            animateToLockStep(euroLockStep.current - 1);
          }
          // if at Euro (0): allow natural scroll back to page 2
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) return;
      if (Date.now() < stepCooldownUntilRef.current) {
        e.preventDefault();
        return;
      }
      // In Final: always reverse first on upward wheel; block downward
      if (checkIfInFinalSection() || euroLockStep.current === 3) {
        if (e.deltaY < 0 && euroLockStep.current === 3) {
          e.preventDefault();
          animateToLockStep(2);
        } else if (e.deltaY > 0 && euroLockStep.current === 3) {
          e.preventDefault();
        }
        return;
      }
      if (!checkIfInEuroSection()) return;
      if (!euroSnapSettled()) {
        e.preventDefault();
        return;
      }
      if (Date.now() < stepCooldownUntilRef.current) {
        e.preventDefault();
        return;
      }
      if (e.deltaY > 0) {
        // Downward: advance steps until Sad, then release
        if (euroLockStep.current < 2) {
          e.preventDefault();
          animateToLockStep(euroLockStep.current + 1);
        }
      } else if (e.deltaY < 0) {
        // Upward: reverse steps until Euro, then release
        if (euroLockStep.current > 0) {
          e.preventDefault();
          animateToLockStep(euroLockStep.current - 1);
        }
      }
    };

    if (!USE_OBSERVERS) {
      // disabled in observer mode
    } else {
      // no document-level listeners in observer mode
    }

    // Track scroll settling on the scroll container to avoid accidental triggers during snap
    const scrollContainer =
      containerRef?.current ??
      (document.querySelector(
        "div.h-dvh.overflow-y-scroll"
      ) as HTMLElement | null);
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (euroSnapAnimRef.current) {
        try {
          (
            euroSnapAnimRef.current as unknown as { pause?: () => void }
          ).pause?.();
        } catch {}
        euroSnapAnimRef.current = null;
      }
      if (scrollSettleTimeoutRef.current)
        clearTimeout(scrollSettleTimeoutRef.current);
      scrollSettleTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        // Smooth snap inside Euro section after settle
        const tl = scrubTimelineRef.current;
        if (tl && euroProgressRef.current > 0 && euroProgressRef.current < 1) {
          const dur = (tl as unknown as { duration?: number }).duration ?? 0;
          const anchors = [0, dur * 0.5, dur];
          const currentT = lastEuroTimeRef.current;
          let nearest = anchors[0];
          let best = Math.abs(currentT - anchors[0]);
          for (let i = 1; i < anchors.length; i++) {
            const d = Math.abs(currentT - anchors[i]);
            if (d < best) {
              best = d;
              nearest = anchors[i];
            }
          }
          const carrier = { ct: currentT } as { ct: number };
          euroSnapAnimRef.current = animate(carrier, {
            ct: nearest,
            duration: 300,
            easing: EASING_DEFAULT,
            update: () => {
              (tl as unknown as { currentTime?: number }).currentTime =
                carrier.ct;
              lastEuroTimeRef.current = carrier.ct;
              const tNorm = dur > 0 ? carrier.ct / dur : 0;
              euroLockStep.current = tNorm < 0.33 ? 0 : tNorm < 0.66 ? 1 : 2;
            },
            autoplay: true,
          });
        }
      }, 200);
    };
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      } as AddEventListenerOptions);
    }

    // Anime.js Scroll Observers
    let euroObserver: { revert?: () => void } | null = null;
    let finalObserver: { revert?: () => void } | null = null;
    if (USE_OBSERVERS && scrollContainer) {
      const euroSection = sectionRefs.current[2] as HTMLElement | null;
      const finalSection = sectionRefs.current[3] as HTMLElement | null;
      if (euroSection && scrubTimelineRef.current) {
        const scrubTl = scrubTimelineRef.current;
        euroObserver = onScroll({
          container: scrollContainer,
          target: euroSection,
          axis: "y",
          enter: 0,
          leave: 1,
          onEnterForward: () => {
            if (!snapDisabledRef.current) {
              (scrollContainer as HTMLElement).style.scrollSnapType = "none";
              snapDisabledRef.current = true;
            }
          },
          onLeaveForward: () => {
            (scrollContainer as HTMLElement).style.scrollSnapType =
              "y mandatory";
            snapDisabledRef.current = false;
          },
          onLeaveBackward: () => {
            (scrollContainer as HTMLElement).style.scrollSnapType =
              "y mandatory";
            snapDisabledRef.current = false;
          },
          onUpdate: (obs: { progress: number }) => {
            // Ensure sprites container remains visible when scrubbing Euro section
            try {
              if (euroGroup) {
                (euroGroup as unknown as { style?: CSSStyleDeclaration }).style &&
                  ((euroGroup as unknown as { style: CSSStyleDeclaration }).style.opacity = "1");
              }
            } catch {}
            const p = Math.min(Math.max(obs.progress, 0), 1);
            euroProgressRef.current = p;
            // No reverse here to avoid conflicts; handled by final section observer
            const dur = (scrubTl as unknown as { duration: number }).duration;

            // Simple direct mapping: scroll progress directly maps to timeline
            const targetTime = p * dur;

            // Direct timeline scrubbing
            (scrubTl as unknown as { currentTime?: number }).currentTime =
              targetTime;
            lastEuroTimeRef.current = targetTime;

            // Update step based on timeline position
            const tNorm = dur > 0 ? targetTime / dur : 0;
            if (tNorm < 0.33) {
              euroLockStep.current = 0; // Euro
            } else if (tNorm < 0.66) {
              euroLockStep.current = 1; // Lock
            } else {
              euroLockStep.current = 2; // Sad
            }

            // Temporarily disable scroll snapping while within Euro section until dwell is almost done
            if (p < 0.98) {
              if (!snapDisabledRef.current) {
                (scrollContainer as HTMLElement).style.scrollSnapType = "none";
                snapDisabledRef.current = true;
              }
            } else if (snapDisabledRef.current) {
              (scrollContainer as HTMLElement).style.scrollSnapType =
                "y mandatory";
              snapDisabledRef.current = false;
            }
          },
        });
      }
      if (finalSection) {
        // Use IntersectionObserver for simpler final section detection
        const finalSectionObserver = new IntersectionObserver(
          (entries) => {
            if (!finalControllerRef.current || finalAnimatingRef.current)
              return;

            const entry = entries[0];
            const fsEl = sectionRefs.current[3] as HTMLElement | null;
            if (entry.isIntersecting && entry.intersectionRatio >= 1) {
              // Final section is fully visible - prepare and trigger animation
              if (euroLockStep.current !== 3) {
                try {
                  if (fsEl) {
                    (fsEl as unknown as { style?: CSSStyleDeclaration }).style &&
                      ((fsEl as unknown as { style: CSSStyleDeclaration }).style.opacity = "1");
                  }
                  // Reset final elements to initial hidden state
                  if (logoYellow) {
                    const style = (logoYellow as unknown as { style?: CSSStyleDeclaration }).style;
                    if (style) {
                      style.opacity = "0";
                      style.width = "20px";
                      style.transform = "translate(-50%, 40vh)";
                    }
                  }
                  if (finalTitle) {
                    const st = (finalTitle as unknown as { style?: CSSStyleDeclaration }).style;
                    if (st) st.opacity = "0";
                  }
                  if (finalSubtitle) {
                    const st = (finalSubtitle as unknown as { style?: CSSStyleDeclaration }).style;
                    if (st) st.opacity = "0";
                  }
                } catch {}
                finalAnimatingRef.current = true;
                finalControllerRef.current
                  .playForward()
                  .then(() => {
                    euroLockStep.current = 3;
                  })
                  .finally(() => {
                    finalAnimatingRef.current = false;
                  });
              }
            } else if (entry.intersectionRatio < 1 && euroLockStep.current === 3) {
              // Final section not fully visible - reverse animation
              finalAnimatingRef.current = true;
              finalControllerRef.current
                .playReverse()
                .then(() => {
                  // Ensure euroGroup is visible when returning to step 3 sprites
                  try {
                    if (euroGroup) {
                      (euroGroup as unknown as { style?: CSSStyleDeclaration }).style &&
                        ((euroGroup as unknown as { style: CSSStyleDeclaration }).style.opacity = "1");
                    }
                    if (fsEl) {
                      (fsEl as unknown as { style?: CSSStyleDeclaration }).style &&
                        ((fsEl as unknown as { style: CSSStyleDeclaration }).style.opacity = "0");
                    }
                  } catch {}
                  euroLockStep.current = 2;
                })
                .finally(() => {
                  finalAnimatingRef.current = false;
                });
            }
          },
          {
            root: scrollContainer,
            threshold: [0, 0.3, 0.7, 1],
          }
        );

        finalSectionObserver.observe(finalSection);

        // Cleanup
        return () => {
          finalSectionObserver.disconnect();
        };
      }
    }

    // Fallback visibility sync for Final when observers are disabled
    // Observer mode: drop auto section sync
    return () => {
      if (!USE_OBSERVERS) {
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("wheel", handleWheel);
      }
      if (scrollContainer)
        scrollContainer.removeEventListener(
          "scroll",
          handleScroll as EventListener
        );
      try {
        (euroObserver as unknown as { revert?: () => void } | null)?.revert?.();
      } catch {}
      try {
        (finalObserver as unknown as { revert?: () => void } | null)?.revert?.();
      } catch {}
      // Restore snap type if we disabled it
      if (snapDisabledRef.current && scrollContainer) {
        (scrollContainer as HTMLElement).style.scrollSnapType = "y mandatory";
        snapDisabledRef.current = false;
      }
      // no section sync listeners in observer mode
      if (scrollSettleTimeoutRef.current)
        clearTimeout(scrollSettleTimeoutRef.current);
    };
  }, [
    sectionRefs,
    euroLockStep,
    isAnimating,
    containerRef?.current,
    refs?.euro?.current,
    refs?.lock?.current,
    refs?.sad?.current,
    refs?.initialText?.current,
    refs?.newText?.current,
    refs?.sadText?.current,
    refs?.euroGroup?.current,
    refs?.logoYellow?.current,
    refs?.logoPath?.current,
    refs?.finalTitle?.current,
    refs?.finalSubtitle?.current,
  ]);

  // Page 3 directional lock (disabled in observer mode)
  useEffect(() => {
    if (USE_OBSERVERS_GLOBAL) return;
    const lastTouchY = { current: 0 } as React.MutableRefObject<number>;

    const isInEuroSection = () => {
      const euroSection = sectionRefs.current[2];
      if (!euroSection) return false;
      const rect = euroSection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh && rect.bottom > 0;
    };

    const handleWheelBlock = (e: WheelEvent) => {
      // Hard stop: while transitioning, swallow all
      if (isAnimating.current || Date.now() < stepCooldownUntilRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (euroLockStep.current === 3) {
        // Allow upward wheel (deltaY < 0) to propagate so reverse handler can run
        if (e.deltaY < 0) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (isInEuroSection()) {
        if (e.deltaY > 0 && euroLockStep.current < 2) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (e.deltaY < 0 && euroLockStep.current > 0) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0]?.clientY ?? 0;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating.current || Date.now() < stepCooldownUntilRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const y = e.touches[0]?.clientY ?? lastTouchY.current;
      const dy = lastTouchY.current - y; // >0 = finger moved up (scroll down), <0 = finger moved down (scroll up)
      lastTouchY.current = y;
      if (euroLockStep.current === 3) {
        // Allow upward swipe (dy > 0) to propagate so touchend can reverse to page 3
        if (dy > 0) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (isInEuroSection()) {
        // Block native scroll: swipe up (dy > 0) until Sad; swipe down (dy < 0) until Euro
        if (dy > 0 && euroLockStep.current < 2) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (dy < 0 && euroLockStep.current > 0) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    };

    const scrollContainer =
      (containerRef?.current as HTMLElement | null) ??
      (document.querySelector(
        "div.h-dvh.overflow-y-scroll"
      ) as HTMLElement | null);

    if (scrollContainer) {
      scrollContainer.addEventListener(
        "wheel",
        handleWheelBlock as EventListener,
        { passive: false } as AddEventListenerOptions
      );
      scrollContainer.addEventListener(
        "touchstart",
        handleTouchStart as EventListener,
        { passive: true } as AddEventListenerOptions
      );
      scrollContainer.addEventListener(
        "touchmove",
        handleTouchMove as EventListener,
        { passive: false } as AddEventListenerOptions
      );
    }

    // no document-level listeners in observer mode

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener(
          "wheel",
          handleWheelBlock as EventListener
        );
        scrollContainer.removeEventListener(
          "touchstart",
          handleTouchStart as EventListener
        );
        scrollContainer.removeEventListener(
          "touchmove",
          handleTouchMove as EventListener
        );
      }
      // no document-level listeners to remove in observer mode
    };
  }, [euroLockStep, containerRef?.current, sectionRefs, isAnimating.current]);
}
