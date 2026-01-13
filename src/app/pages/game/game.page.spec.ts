import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GamePage } from './game.page';
import { GameStateService } from '../../core/services/game-state.service';

describe('GamePage (Vitest)', () => {
  let fixture: ComponentFixture<GamePage>;
  let component: GamePage;

  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let state: {
    segments: ReturnType<typeof vi.fn>;
    startSpin: ReturnType<typeof vi.fn>;
    isSpinning: ReturnType<typeof vi.fn>;
    segmentCount: ReturnType<typeof vi.fn>;
    setResult: ReturnType<typeof vi.fn>;
    setSegmentCount: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    router = {
      navigateByUrl: vi.fn(),
    };

    state = {
      segments: vi.fn().mockReturnValue([
        { id: '0', label: '0', color: 'green' },
        { id: '32', label: '32', color: 'red' },
        { id: '15', label: '15', color: 'black' },
        { id: '19', label: '19', color: 'red' },
      ]),
      startSpin: vi.fn(),
      isSpinning: vi.fn().mockReturnValue(false),
      segmentCount: vi.fn().mockReturnValue(37),
      setResult: vi.fn(),
      setSegmentCount: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [GamePage],
      providers: [
        { provide: Router, useValue: router },
        { provide: GameStateService, useValue: state },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePage);
    component = fixture.componentInstance;

    const pointer = document.createElement('div');
    pointer.className = 'pointer';
    document.body.appendChild(pointer);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    document.querySelector('.pointer')?.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onLandOnInput trims whitespace', () => {
    component.onLandOnInput('  32  ');
    expect(component.landOnLabel).toBe('32');
  });

  it('fixedIndex returns index for landOnLabel, or null if missing', () => {
    component.landOnLabel = '15';
    expect(component.fixedIndex).toBe(2);

    component.landOnLabel = '999';
    expect(component.fixedIndex).toBeNull();
  });

  it('spin(fixed) lands on correct index and navigates after transition end + 1s', () => {
    vi.useFakeTimers();

    component.landOnLabel = '15';
    component.spin('fixed');

    expect(state.startSpin).toHaveBeenCalledWith('fixed');

    const pointer = document.querySelector('.pointer') as HTMLElement;
    expect(pointer.classList.contains('pointer-active')).toBe(true);

    const wheelEl = component.wheelRef.nativeElement;

    const ev = new Event('transitionend') as any;
    Object.defineProperty(ev, 'propertyName', { value: 'transform' });

    wheelEl.dispatchEvent(ev);

    vi.advanceTimersByTime(1000);

    expect(state.setResult).toHaveBeenCalledWith(2);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/result');
    expect(pointer.classList.contains('pointer-active')).toBe(false);
  });

  it('spin(random) uses crypto RNG deterministically in test', () => {
    vi.useFakeTimers();

    const cryptoObj = globalThis.crypto as Crypto;

    const spy = vi
      .spyOn(cryptoObj, 'getRandomValues')
      .mockImplementation(<T extends ArrayBufferView>(arr: T) => {
        (arr as unknown as Uint32Array)[0] = 3;
        return arr;
      });

    component.spin('random');

    const wheelEl = component.wheelRef.nativeElement;
    const ev = new Event('transitionend') as any;
    Object.defineProperty(ev, 'propertyName', { value: 'transform' });
    wheelEl.dispatchEvent(ev);

    vi.advanceTimersByTime(1000);

    expect(state.setResult).toHaveBeenCalledWith(3);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/result');

    spy.mockRestore();
  });

  it('ignores transitionend events that are not for transform', () => {
    vi.useFakeTimers();

    component.spin('fixed');

    const wheelEl = component.wheelRef.nativeElement;

    const ev = new Event('transitionend') as any;
    Object.defineProperty(ev, 'propertyName', { value: 'opacity' });

    wheelEl.dispatchEvent(ev);
    vi.advanceTimersByTime(1500);

    expect(state.setResult).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
