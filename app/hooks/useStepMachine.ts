"use client";

import { useEffect } from "react";
import { animate } from "animejs";
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
  },
  containerRef?: React.RefObject<HTMLElement | null>
) {
  const isAnimating = { current: false } as React.MutableRefObject<boolean>;

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
    if (!euroSvg || !lockSvg || !sadSvg || !initialText || !newText || !sadText)
      return;

    const checkIfInEuroSection = () => {
      const euroSection = sectionRefs.current[2];
      if (!euroSection) return false;
      const rect = euroSection.getBoundingClientRect();
      return Math.abs(rect.top) < STEP.euroSectionTopThresholdPx;
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
      } else if (swipeDistance < 0 && euroLockStep.current === 1) {
        e.preventDefault();
        animateToLockStep(0);
      } else if (swipeDistance < 0 && euroLockStep.current === 2) {
        e.preventDefault();
        animateToLockStep(1);
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
      } else if (e.deltaY < 0 && euroLockStep.current === 1) {
        e.preventDefault();
        animateToLockStep(0);
      } else if (e.deltaY < 0 && euroLockStep.current === 2) {
        e.preventDefault();
        animateToLockStep(1);
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
  ]);

  // Block scrolling when in lock/sad
  useEffect(() => {
    const handlePrevent = (e: Event) => {
      if (euroLockStep.current === 1 || euroLockStep.current === 2) {
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
