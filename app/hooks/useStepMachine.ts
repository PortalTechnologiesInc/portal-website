"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline } from "animejs";
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
    finalTitle?: React.RefObject<HTMLElement | null>;
    finalSubtitle?: React.RefObject<HTMLElement | null>;
  },
  containerRef?: React.RefObject<HTMLElement | null>
) {
  const isAnimating = { current: false } as React.MutableRefObject<boolean>;
  const step4TimelineRef = useRef<ReturnType<typeof createTimeline> | null>(
    null
  );

  // Step transitions and input handlers
  useEffect(() => {
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
      !euroGroup ||
      !logoYellow ||
      !finalTitle ||
      !finalSubtitle ||
      !logoPath
    )
      return;

    // Build Step 4 timeline once
    if (!step4TimelineRef.current) {
      const tl = createTimeline({ autoplay: false });

      tl.add(
        euroGroup,
        { scale: 0.85, opacity: 0, duration: DUR_STEP_MS },
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
          {
            opacity: [0, 1],
            translateY: [12, 0],
            duration: DUR_STEP_MS,
          },
          "<"
        );

      step4TimelineRef.current = tl;
    }

    const checkIfInEuroSection = () => {
      const euroSection = sectionRefs.current[2];
      if (!euroSection) return false;
      const rect = euroSection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Consider "in section" if any part of the section is visible in the viewport
      return rect.top < vh && rect.bottom > 0;
    };

    const animateToLockStep = (targetStep: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      if (targetStep === 1) {
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
        if (euroLockStep.current === 3 && step4TimelineRef.current) {
          // Reverse from Step 4 back to Sad
          const tl = step4TimelineRef.current;
          if (!tl.reversed) tl.reverse();
          tl.play();
          tl.then(() => {
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
        if (euroLockStep.current !== 2 || !step4TimelineRef.current) {
          isAnimating.current = false;
          return;
        }
        // Play Step 4 forward
        const tl = step4TimelineRef.current;
        if (tl.reversed) tl.reverse();
        tl.play();
        tl.then(() => {
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
      if (!checkIfInEuroSection() || isAnimating.current) return;
      touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;
      if (Math.abs(swipeDistance) < 50) return;
      if (swipeDistance > 0 && euroLockStep.current === 0) {
        e.preventDefault();
        animateToLockStep(1);
      } else if (swipeDistance > 0 && euroLockStep.current === 1) {
        e.preventDefault();
        animateToLockStep(2);
      } else if (swipeDistance > 0 && euroLockStep.current === 2) {
        e.preventDefault();
        animateToLockStep(3);
      } else if (swipeDistance < 0 && euroLockStep.current === 1) {
        e.preventDefault();
        animateToLockStep(0);
      } else if (swipeDistance < 0 && euroLockStep.current === 2) {
        e.preventDefault();
        animateToLockStep(1);
      } else if (swipeDistance < 0 && euroLockStep.current === 3) {
        e.preventDefault();
        animateToLockStep(2);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!checkIfInEuroSection() || isAnimating.current) return;
      if (e.deltaY > 0 && euroLockStep.current === 0) {
        e.preventDefault();
        animateToLockStep(1);
      } else if (e.deltaY > 0 && euroLockStep.current === 1) {
        e.preventDefault();
        animateToLockStep(2);
      } else if (e.deltaY > 0 && euroLockStep.current === 2) {
        e.preventDefault();
        animateToLockStep(3);
      } else if (e.deltaY < 0 && euroLockStep.current === 1) {
        e.preventDefault();
        animateToLockStep(0);
      } else if (e.deltaY < 0 && euroLockStep.current === 2) {
        e.preventDefault();
        animateToLockStep(1);
      } else if (e.deltaY < 0 && euroLockStep.current === 3) {
        e.preventDefault();
        animateToLockStep(2);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [
    sectionRefs,
    euroLockStep,
    isAnimating,
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

  // Block scrolling when in lock/sad/final
  useEffect(() => {
    const handlePrevent = (e: Event) => {
      if (
        euroLockStep.current === 1 ||
        euroLockStep.current === 2 ||
        euroLockStep.current === 3
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const scrollContainer =
      containerRef?.current ??
      document.querySelector("div.h-dvh.overflow-y-scroll");
    if (scrollContainer) {
      scrollContainer.addEventListener(
        "scroll",
        handlePrevent as EventListener,
        { passive: false }
      );
      scrollContainer.addEventListener(
        "wheel",
        handlePrevent as EventListener,
        { passive: false }
      );
      scrollContainer.addEventListener(
        "touchmove",
        handlePrevent as EventListener,
        { passive: false }
      );
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener(
          "scroll",
          handlePrevent as EventListener
        );
        scrollContainer.removeEventListener(
          "wheel",
          handlePrevent as EventListener
        );
        scrollContainer.removeEventListener(
          "touchmove",
          handlePrevent as EventListener
        );
      }
    };
  }, [euroLockStep, containerRef?.current]);
}
