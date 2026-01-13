export function computeTargetRotation(opts: {
  segments: number;
  index: number;
  fullSpins: number;
  pointerOffsetDeg: number;
}) {
  const slice = 360 / opts.segments;
  const targetCenter = opts.index * slice + slice / 2;

  return opts.fullSpins * 360 - targetCenter + opts.pointerOffsetDeg;
}
