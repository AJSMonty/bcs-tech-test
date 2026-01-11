import { Injectable, computed, signal } from '@angular/core';
import { Segment } from '../models/segment';

export type SpinMode = 'random' | 'fixed';

type Result = {
  segment: Segment;
  index: number;
};

@Injectable({ providedIn: 'root' })
export class GameStateService {
  readonly segmentCount = signal<number>(6);

  readonly segments = computed<Segment[]>(() => {
    const n = this.segmentCount();

    const safe = Math.max(2, Math.min(24, Math.floor(n)));

    return Array.from({ length: safe }, (_, i) => ({
      id: String(i),
      label: String(i + 1),
    }));
  });

  readonly mode = signal<SpinMode | null>(null);
  readonly isSpinning = signal(false);
  readonly result = signal<Result | null>(null);

  readonly hasResult = computed(() => this.result() !== null);
  readonly resultLabel = computed(() => this.result()?.segment.label ?? '');

  setSegmentCount(n: number) {
    if (this.isSpinning()) return;

    const safe = Math.max(2, Math.min(24, Math.floor(n)));
    this.segmentCount.set(safe);
    this.result.set(null);
  }

  startSpin(mode: SpinMode) {
    this.mode.set(mode);
    this.isSpinning.set(true);
    this.result.set(null);
  }

  setResult(index: number) {
    const segments = this.segments();
    const safeIndex = Math.max(0, Math.min(segments.length - 1, index));

    this.result.set({ segment: segments[safeIndex], index: safeIndex });
    this.isSpinning.set(false);
  }

  reset() {
    this.mode.set(null);
    this.isSpinning.set(false);
    this.result.set(null);
    this.segmentCount.set(6);
  }
}
