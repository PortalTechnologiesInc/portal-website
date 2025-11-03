type Anchor = { label: string; time: number };

export function createScrubber(params: {
  container: HTMLElement;
  sections: HTMLElement[];
  timeline: { currentTime: number; duration: number } & { play?: () => void };
  anchors: Anchor[];
  onSnapStart?: () => void;
  onSnapEnd?: () => void;
  reducedMotion?: boolean;
}) {
  const { container, sections, timeline, anchors, onSnapStart, onSnapEnd, reducedMotion } = params;
  const DEBUG = true;
  const log = (...args: unknown[]) => {
    if (DEBUG) console.log("[scrubber]", ...args);
  };
  // Limit logs to Euro section related paths

  const totalHeight = sections.reduce((acc, s) => acc + (s?.offsetHeight ?? 0), 0) || 1;
  // Precompute cumulative starts for sections
  const starts: number[] = [];
  {
    let acc = 0;
    for (let i = 0; i < sections.length; i++) {
      starts.push(acc);
      acc += sections[i]?.offsetHeight ?? 0;
    }
  }
  const tlDuration = (timeline as unknown as { duration?: number }).duration ?? 1;
  const firstAnchorTime = anchors.length ? anchors[0].time : 0;
  const lastAnchorTime = anchors.length ? anchors[anchors.length - 1].time : tlDuration;
  const euroEnterTime = anchors.find((a) => a.label === "euro-enter")?.time ?? firstAnchorTime;
  const finalEnterTime = anchors.find((a) => a.label === "final-enter")?.time ?? lastAnchorTime;

  let settling: ReturnType<typeof setTimeout> | null = null;
  let snapping = false;
  let blocked = false;

  const onScroll = () => {
    if (snapping || blocked) return;
    const scrollTop = container.scrollTop;
    const maxScroll = totalHeight - container.clientHeight;
    const p = Math.min(Math.max(maxScroll > 0 ? scrollTop / maxScroll : 0, 0), 1);
    // Section-local mapping for Euro range (between section 3 and 4)
    // Compute cumulative starts per section
    const starts: number[] = [];
    let acc = 0;
    for (let i = 0; i < sections.length; i++) {
      starts.push(acc);
      acc += sections[i]?.offsetHeight ?? 0;
    }
    const euroIdx = 2; // third section
    const finalIdx = 3; // fourth section
    let t = p * tlDuration;
    if (sections[euroIdx] && sections[finalIdx]) {
      const euroStart = starts[euroIdx];
      const finalStart = starts[finalIdx];
      if (scrollTop >= euroStart && scrollTop <= finalStart) {
        const localP = Math.min(Math.max((scrollTop - euroStart) / Math.max(finalStart - euroStart, 1), 0), 1);
        t = euroEnterTime + localP * Math.max(finalEnterTime - euroEnterTime, 0);
        if (DEBUG) log("map:euro-local", { scrollTop, euroStart, finalStart, localP, t });
      }
    }
    // Constrain scrubbing to the defined anchor range to avoid overshooting
    if (t < firstAnchorTime) t = firstAnchorTime;
    if (t > lastAnchorTime) t = lastAnchorTime;
    (timeline as unknown as { currentTime?: number }).currentTime = t;
    if (settling) clearTimeout(settling);
    settling = setTimeout(() => {
      snapToNearest();
    }, 160);
  };

  const snapToNearest = () => {
    if (!anchors.length) return;
    let ct = (timeline as unknown as { currentTime?: number }).currentTime ?? 0;
    // Clamp to range prior to choosing nearest
    if (ct < firstAnchorTime) ct = firstAnchorTime;
    if (ct > lastAnchorTime) ct = lastAnchorTime;
    // If within Euro segment, only snap to euro-0/1/2 to avoid jumping straight to final-enter
    const withinEuro = ct >= euroEnterTime && ct <= finalEnterTime;
    const candidates = withinEuro
      ? anchors.filter((a) => a.label === "euro-0" || a.label === "euro-1" || a.label === "euro-2")
      : anchors;
    let best = candidates[0] ?? anchors[0];
    let bestDist = Math.abs(ct - (best?.time ?? 0));
    for (let i = 1; i < candidates.length; i++) {
      const d = Math.abs(ct - candidates[i].time);
      if (d < bestDist) {
        bestDist = d;
        best = candidates[i];
      }
    }
    if (withinEuro) log("snapToNearest", { from: ct, to: best, withinEuro });
    snapping = true;
    onSnapStart?.();
    if (reducedMotion) {
      (timeline as unknown as { currentTime?: number }).currentTime = best.time;
      snapping = false;
      onSnapEnd?.();
      return;
    }
    const carrier = { t: ct } as { t: number };
    const start = performance.now();
    const dur = 280;
    const from = ct;
    const to = best.time;
    const step = (now: number) => {
      const k = Math.min((now - start) / dur, 1);
      const eased = k < 0.5 ? 2 * k * k : -1 + (4 - 2 * k) * k;
      carrier.t = from + (to - from) * eased;
      (timeline as unknown as { currentTime?: number }).currentTime = carrier.t;
      if (k < 1) {
        requestAnimationFrame(step);
      } else {
        if (withinEuro) {
          // Align scrollTop to the snapped euro time so mapping stays in sync
          const euroStart = starts[2] ?? 0;
          const finalStart = starts[3] ?? euroStart + 1;
          const localP = Math.min(Math.max((to - euroEnterTime) / Math.max(finalEnterTime - euroEnterTime, 1), 0), 1);
          const desiredTop = euroStart + localP * Math.max(finalStart - euroStart, 1);
          container.scrollTop = desiredTop;
        }
        if (withinEuro) log("snap:complete", { to });
        snapping = false;
        onSnapEnd?.();
      }
    };
    requestAnimationFrame(step);
  };

  container.addEventListener("scroll", onScroll, { passive: true });
  // initial sync
  onScroll();

  return {
    block() {
      blocked = true;
      if (settling) {
        clearTimeout(settling);
        settling = null;
      }
    },
    unblock() {
      blocked = false;
    },
    destroy() {
      container.removeEventListener("scroll", onScroll as EventListener);
      if (settling) clearTimeout(settling);
    },
  };
}


