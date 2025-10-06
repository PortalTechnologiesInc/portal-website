import { createTimeline } from "animejs";

type FinalRefs = {
  euroGroup: HTMLElement | null;
  logoYellow: HTMLElement | null;
  logoPath: SVGPathElement | null;
  finalTitle: HTMLElement | null;
  finalSubtitle: HTMLElement | null;
};

export function createLogoRevealAnimationController(
  refs: FinalRefs,
  stepDurationMs: number
) {
  let timeline: ReturnType<typeof createTimeline> | null = null;
  let animating = false;

  const ensure = () => {
    if (timeline) return timeline;
    const { euroGroup, logoYellow, logoPath, finalTitle, finalSubtitle } = refs;
    if (
      !euroGroup ||
      !logoYellow ||
      !logoPath ||
      !finalTitle ||
      !finalSubtitle
    ) {
      return null;
    }
    const tl = createTimeline({ autoplay: false });
    tl.add(
      euroGroup,
      { scale: 0.85, opacity: 0, duration: stepDurationMs },
      "<<"
    )
      .add(
        logoYellow,
        {
          translateX: ["-50%", "-50%"],
          translateY: ["40vh", "-50%"],
          opacity: [0, 1],
          duration: stepDurationMs,
        },
        "-=300"
      )
      .add(logoYellow, { width: [20, 950], duration: stepDurationMs }, "<")
      .add(
        logoPath,
        { strokeWidth: [3, 1.2], duration: stepDurationMs },
        "<<-=200"
      )
      .add(
        [finalTitle, finalSubtitle],
        { opacity: [0, 1], translateY: [12, 0], duration: stepDurationMs },
        "<"
      );
    timeline = tl;
    return timeline;
  };

  const getDuration = () => {
    const tl = ensure();
    const d =
      (tl as unknown as { duration?: number } | null)?.duration ??
      stepDurationMs * 3;
    return d;
  };

  const playAndWait = (forward: boolean): Promise<void> => {
    const tl = ensure();
    if (!tl) return Promise.resolve();
    try {
      (tl as unknown as { pause?: () => void }).pause?.();
      if (forward) {
        (tl as unknown as { currentTime?: number }).currentTime = 0;
        if ((tl as unknown as { reversed?: boolean }).reversed)
          (tl as unknown as { reverse?: () => void }).reverse?.();
      } else {
        const dur = getDuration();
        (tl as unknown as { currentTime?: number }).currentTime = dur;
        if (!(tl as unknown as { reversed?: boolean }).reversed)
          (tl as unknown as { reverse?: () => void }).reverse?.();
      }
    } catch {}
    animating = true;
    tl.play();
    const any = tl as unknown as {
      then?: (cb: () => void) => void;
      finished?: Promise<void>;
    };
    if (typeof any.then === "function") {
      return new Promise<void>((resolve) => {
        any.then(() => {
          animating = false;
          resolve();
        });
      });
    }
    if (any.finished && typeof any.finished.then === "function") {
      return any.finished.then(() => {
        animating = false;
      });
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        animating = false;
        resolve();
      }, getDuration() + 50);
    });
  };

  return {
    ensure,
    playForward: () => playAndWait(true),
    playReverse: () => playAndWait(false),
    isAnimating: () => animating,
  };
}
