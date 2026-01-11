import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { GameStateService } from '../services/game-state.service';

export const hasResultGuard: CanActivateFn = () => {
  const state = inject(GameStateService);
  const router = inject(Router);

  if (!state.hasResult()) {
    return router.parseUrl('/');
  }
  return true;
};
