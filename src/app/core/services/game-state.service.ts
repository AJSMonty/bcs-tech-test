import { Injectable, computed, signal } from '@angular/core';
import { Segment } from '../models/segment';

export type SpinMode = 'random' | 'fixed';

export type Result = {
  segment: Segment;
  index: number;
};

const EUROPEAN_ORDER: Segment[] = [
  { id: '0', label: '0' },
  { id: '32', label: '32' },
  { id: '15', label: '15' },
  { id: '19', label: '19' },
  { id: '4', label: '4' },
  { id: '21', label: '21' },
  { id: '2', label: '2' },
  { id: '25', label: '25' },
  { id: '17', label: '17' },
  { id: '34', label: '34' },
  { id: '6', label: '6' },
  { id: '27', label: '27' },
  { id: '13', label: '13' },
  { id: '36', label: '36' },
  { id: '11', label: '11' },
  { id: '30', label: '30' },
  { id: '8', label: '8' },
  { id: '23', label: '23' },
  { id: '10', label: '10' },
  { id: '5', label: '5' },
  { id: '24', label: '24' },
  { id: '16', label: '16' },
  { id: '33', label: '33' },
  { id: '1', label: '1' },
  { id: '20', label: '20' },
  { id: '14', label: '14' },
  { id: '31', label: '31' },
  { id: '9', label: '9' },
  { id: '22', label: '22' },
  { id: '18', label: '18' },
  { id: '29', label: '29' },
  { id: '7', label: '7' },
  { id: '28', label: '28' },
  { id: '12', label: '12' },
  { id: '35', label: '35' },
  { id: '3', label: '3' },
  { id: '26', label: '26' },
];

const DEFAULT_SEGMENT_NUMBER = 37;
const MAX_SEGMENT_NUMBER = 37;

@Injectable({ providedIn: 'root' })
export class GameStateService {
  readonly segmentCount = signal<number>(DEFAULT_SEGMENT_NUMBER);

  readonly segments = computed<Segment[]>(() => {
    const n = this.segmentCount();
    const safe = Math.max(2, Math.min(MAX_SEGMENT_NUMBER, Math.floor(n)));

    if (safe === 37) return EUROPEAN_ORDER;
    return [
      { id: '0', label: '0' },
      ...Array.from({ length: safe - 1 }, (_, i) => {
        const value = String(i + 1);
        return { id: value, label: value };
      }),
    ];
  });

  readonly mode = signal<SpinMode | null>(null);
  readonly isSpinning = signal(false);
  readonly result = signal<Result | null>(null);

  readonly hasResult = computed(() => this.result() !== null);
  readonly resultLabel = computed(() => this.result()?.segment.label ?? '');

  setSegmentCount(n: number) {
    if (this.isSpinning()) return;

    const safe = Math.max(2, Math.min(MAX_SEGMENT_NUMBER, Math.floor(n)));
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
    this.segmentCount.set(DEFAULT_SEGMENT_NUMBER);
  }
}
