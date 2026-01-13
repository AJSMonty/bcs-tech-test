export type Segment = { id: string; label: string };

export type BuiltSegment = {
  id: string;
  label: string;
  segmentSlicePath: string;
  labelX: number;
  labelY: number;
  labelRotate: number;
  colorClass: string;
};
