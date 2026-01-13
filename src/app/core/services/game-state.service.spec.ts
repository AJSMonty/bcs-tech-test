import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('defaults to 37 segments in European roulette order', () => {
    expect(service.segmentCount()).toBe(37);

    const segs = service.segments();
    expect(segs).toHaveLength(37);

    expect(segs[0].label).toBe('0');
    expect(segs[1].label).toBe('32');
    expect(segs[2].label).toBe('15');
    expect(segs[3].label).toBe('19');
    expect(segs[36].label).toBe('26');
  });

  it('setSegmentCount clamps between 2 and 37 and clears result', () => {
    service.setResult(1);
    expect(service.hasResult()).toBe(true);

    service.setSegmentCount(1);
    expect(service.segmentCount()).toBe(2);
    expect(service.segments()).toHaveLength(2);
    expect(service.hasResult()).toBe(false);

    service.setSegmentCount(999);
    expect(service.segmentCount()).toBe(37);
    expect(service.segments()).toHaveLength(37);
  });

  it('setSegmentCount does nothing while spinning', () => {
    service.startSpin('random');
    expect(service.isSpinning()).toBe(true);

    const before = service.segmentCount();
    service.setSegmentCount(2);

    expect(service.segmentCount()).toBe(before);
  });

  it('startSpin sets mode, isSpinning, and clears result', () => {
    service.setResult(2);
    expect(service.hasResult()).toBe(true);

    service.startSpin('fixed');

    expect(service.mode()).toBe('fixed');
    expect(service.isSpinning()).toBe(true);
    expect(service.hasResult()).toBe(false);
    expect(service.result()).toBeNull();
  });

  it('setResult clamps index, sets result + resultLabel, and stops spinning', () => {
    service.startSpin('random');
    expect(service.isSpinning()).toBe(true);

    const segs = service.segments();
    service.setResult(999);

    expect(service.isSpinning()).toBe(false);
    expect(service.hasResult()).toBe(true);

    const r = service.result();
    expect(r).not.toBeNull();

    expect(r!.index).toBe(segs.length - 1);
    expect(r!.segment.label).toBe(segs[segs.length - 1].label);

    expect(service.resultLabel()).toBe(segs[segs.length - 1].label);
  });

  it('reset restores defaults', () => {
    service.startSpin('fixed');
    service.setResult(3);
    service.setSegmentCount(2);

    service.reset();

    expect(service.mode()).toBeNull();
    expect(service.isSpinning()).toBe(false);
    expect(service.result()).toBeNull();
    expect(service.hasResult()).toBe(false);
    expect(service.segmentCount()).toBe(37);
    expect(service.segments()).toHaveLength(37);
    expect(service.segments()[0].label).toBe('0');
  });
});
