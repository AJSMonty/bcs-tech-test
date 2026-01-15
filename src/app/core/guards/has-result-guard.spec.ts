import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { hasResultGuard } from './has-result-guard';
import { GameStateService } from '../services/game-state.service';

describe('hasResultGuard', () => {
  let router: { parseUrl: ReturnType<typeof vi.fn> };
  let state: { hasResult: ReturnType<typeof vi.fn> };

  const route = {} as ActivatedRouteSnapshot;
  const routerState = {} as RouterStateSnapshot;

  const runGuard = () => TestBed.runInInjectionContext(() => hasResultGuard(route, routerState));

  beforeEach(() => {
    const urlTree = {} as UrlTree;

    router = {
      parseUrl: vi.fn().mockReturnValue(urlTree),
    };

    state = {
      hasResult: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: GameStateService, useValue: state },
      ],
    });
  });

  it('returns UrlTree to / when there is no result', () => {
    state.hasResult.mockReturnValue(false);

    const res = runGuard();

    expect(router.parseUrl).toHaveBeenCalledWith('/');
    expect(res).toBe(router.parseUrl.mock.results[0].value);
  });

  it('returns true when there is a result', () => {
    state.hasResult.mockReturnValue(true);

    const res = runGuard();

    expect(router.parseUrl).not.toHaveBeenCalled();
    expect(res).toBe(true);
  });
});
