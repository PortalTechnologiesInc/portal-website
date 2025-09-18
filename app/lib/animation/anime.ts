import { animate } from "animejs";

type AnimateTargets = Parameters<typeof animate>[0];
type AnimateParams = Parameters<typeof animate>[1];

export function buildPausedAnimation(
  targets: AnimateTargets,
  params: AnimateParams
) {
  return animate(targets, { ...params, autoplay: false });
}
