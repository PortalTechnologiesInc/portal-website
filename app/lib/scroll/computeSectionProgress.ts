export function computeSectionProgress(
  from: HTMLElement,
  to: HTMLElement
): number {
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  const totalDistance = fromRect.height + toRect.height;
  const scrolledDistance = Math.abs(fromRect.top);
  if (totalDistance <= 0) return 0;
  const raw = scrolledDistance / totalDistance;
  return Math.min(Math.max(raw, 0), 1);
}
