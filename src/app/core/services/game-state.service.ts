import { Injectable, computed, signal } from '@angular/core';
import { Segment } from '../models/segment';
import {
  DEFAULT_SEGMENT_NUMBER,
  EUROPEAN_ORDER,
  LOWEST_SAFE_RESULT,
  MAX_SEGMENT_NUMBER,
  MIN_SEGMENT_NUMBER,
} from '../constants/roulette-constants';
import { Result, SpinMode } from '../models/game-state';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  readonly segmentCount = signal<number>(DEFAULT_SEGMENT_NUMBER);
  readonly mode = signal<SpinMode | null>(null);
  readonly isSpinning = signal(false);
  readonly result = signal<Result | null>(null);
  readonly hasResult = computed(() => this.result() !== null);
  readonly resultLabel = computed(() => this.result()?.segment.label ?? '');

  clampSegmentNumber(numberOfSegments: number) {
    const safeRange = Math.max(
      MIN_SEGMENT_NUMBER,
      Math.min(MAX_SEGMENT_NUMBER, Math.floor(numberOfSegments))
    );
    return safeRange;
  }

  readonly segments = computed<Segment[]>(() => {
    const numberOfSegments = this.segmentCount();
    const safeRange = this.clampSegmentNumber(numberOfSegments);

    if (safeRange === 37) return EUROPEAN_ORDER;
    return [
      { id: '0', label: '0' },
      ...Array.from({ length: safeRange - 1 }, (_, i) => {
        const value = String(i + 1);
        return { id: value, label: value };
      }),
    ];
  });

  setSegmentCount(n: number) {
    if (this.isSpinning()) return;
    const safeRange = this.clampSegmentNumber(n);
    this.segmentCount.set(safeRange);
    this.result.set(null);
  }

  startSpin(mode: SpinMode) {
    this.mode.set(mode);
    this.isSpinning.set(true);
    this.result.set(null);
  }

  setResult(index: number) {
    const segments = this.segments();
    const safeIndex = Math.max(LOWEST_SAFE_RESULT, Math.min(segments.length - 1, index));
    this.result.set({ segment: segments[safeIndex], index: safeIndex });
    this.isSpinning.set(false);
  }

  reset() {
    this.mode.set(null);
    this.isSpinning.set(false);
    this.result.set(null);
    this.segmentCount.set(DEFAULT_SEGMENT_NUMBER);
  }
}
