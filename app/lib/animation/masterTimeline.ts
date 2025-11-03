import { STEP } from "../constants/animation";
import { createTimeline } from "animejs";

export type SiteTimelineRefs = {
  // Section wrappers (optional for future expansion)
  hero?: HTMLElement | null;
  payments?: HTMLElement | null;
  euroGroup: HTMLElement | null;
  finalSection?: HTMLElement | null;

  // Euro sprites/texts
  euroSvg: HTMLElement | null;
  lockSvg: HTMLElement | null;
  sadSvg: HTMLElement | null;
  initialText: HTMLElement | null;
  newText: HTMLElement | null;
  sadText: HTMLElement | null;

  // Final
  logoYellow: HTMLElement | null;
  logoPath: SVGPathElement | null;
  finalTitle: HTMLElement | null;
  finalSubtitle: HTMLElement | null;
};

export function createMasterTimeline(refs: SiteTimelineRefs, stepDurationMs = 800) {
  const {
    hero,
    payments,
    euroGroup,
    euroSvg,
    lockSvg,
    sadSvg,
    initialText,
    newText,
    sadText,
    finalSection,
    logoYellow,
    logoPath,
    finalTitle,
    finalSubtitle,
  } = refs;

  const tl = createTimeline({ autoplay: false });

  // Guard: if key refs missing, return empty timeline
  if (!euroGroup || !euroSvg || !lockSvg || !sadSvg || !initialText || !newText || !sadText || !logoYellow || !logoPath || !finalTitle || !finalSubtitle) {
    return { tl, anchors: [] as Array<{ label: string; time: number }> };
  }

  // Initial states
  tl
    .set([lockSvg, sadSvg], { translateX: 200, opacity: 0, duration: 0 })
    .set([newText, sadText], { opacity: 0, duration: 0 })
    .set(logoYellow, {
      opacity: 0,
      width: 20,
      translateX: "-50%",
      translateY: "40vh",
      duration: 0,
    })
    .set([finalTitle, finalSubtitle], { opacity: 0, translateY: 12, duration: 0 });

  // Section wrappers: do not animate opacity to avoid black frames

  // Build anchors progressively without relying on label() support
  const anchors: Array<{ label: string; time: number }> = [];
  let timeCursor = 0;
  anchors.push({ label: "hero-enter", time: timeCursor });

  // Payments enter anchor (no wrapper opacity changes)
  anchors.push({ label: "payments-enter", time: timeCursor });
  // No-op for wrappers; inner elements can animate in their own hooks if needed
  timeCursor += 300;

  // Euro enter anchor (no wrapper opacity changes)
  anchors.push({ label: "euro-enter", time: timeCursor });
  // No-op here; euro sprites/texts animate at euro-0
  timeCursor += 0;

  // Euro 0 — reset to canonical positions for determinism
  anchors.push({ label: "euro-0", time: timeCursor });
  tl
    .add(euroSvg, { translateX: 0, filter: "blur(0px)", opacity: 1, duration: stepDurationMs }, "<")
    .add(lockSvg, { translateX: STEP.enterFromRightTranslateX, opacity: 0, duration: stepDurationMs }, "<")
    .add(sadSvg, { translateX: STEP.enterFromRightTranslateX, opacity: 0, duration: stepDurationMs }, "<")
    .add(initialText, { opacity: 1, duration: stepDurationMs }, "<")
    .add(newText, { opacity: 0, duration: stepDurationMs }, "<")
    .add(sadText, { opacity: 0, duration: stepDurationMs }, "<");
  timeCursor += stepDurationMs;

  // Euro 1 (Lock)
  anchors.push({ label: "euro-1", time: timeCursor });
  tl
    .add(
      euroSvg,
      { translateX: STEP.euroToLockTranslateX, filter: `blur(${STEP.blurLightPx}px)`, opacity: 0.5, duration: stepDurationMs },
      "<"
    )
    .add(lockSvg, { translateX: 0, opacity: 1, duration: stepDurationMs }, "<")
    .add(initialText, { opacity: 0, duration: stepDurationMs }, "<")
    .add(newText, { opacity: 1, duration: stepDurationMs }, "<");
  timeCursor += stepDurationMs;

  // Euro 2 (Sad)
  anchors.push({ label: "euro-2", time: timeCursor });
  tl
    .add(
      euroSvg,
      { translateX: STEP.euroDeepLeftTranslateX, filter: `blur(${STEP.blurHeavyPx}px)`, opacity: 0.3, duration: stepDurationMs },
      "<"
    )
    .add(
      lockSvg,
      { translateX: STEP.lockToSadTranslateX, filter: `blur(${STEP.blurLightPx}px)`, opacity: 0.5, duration: stepDurationMs },
      "<"
    )
    .add(sadSvg, { translateX: 0, opacity: 1, duration: stepDurationMs }, "<")
    .add(newText, { opacity: 0, duration: stepDurationMs }, "<")
    .add(sadText, { opacity: 1, duration: stepDurationMs }, "<");
  timeCursor += stepDurationMs;

  // Final enter
  anchors.push({ label: "final-enter", time: timeCursor });
  tl
    .add(euroGroup, { scale: 0.85, duration: stepDurationMs }, "<")
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
    .add(logoPath, { strokeWidth: [3, 1.2], duration: stepDurationMs }, "<<-=200")
    .add([finalTitle, finalSubtitle], { opacity: [0, 1], translateY: [12, 0], duration: stepDurationMs }, "<");
  timeCursor += stepDurationMs;

  // Final exit state (reverse end)
  tl
    .add([finalTitle, finalSubtitle], { opacity: 0, translateY: 12, duration: 0 }, "<")
    .add(logoPath, { strokeWidth: 3, duration: 0 }, "<")
    .add(logoYellow, { opacity: 0, width: 20, translateX: "-50%", translateY: "40vh", duration: 0 }, "<")
    .add(euroGroup, { scale: 1, duration: 0 }, "<");

  return { tl, anchors };
}


