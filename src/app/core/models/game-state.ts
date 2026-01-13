import { Segment } from './segment';

export type SpinMode = 'random' | 'fixed';

export type Result = {
  segment: Segment;
  index: number;
};
