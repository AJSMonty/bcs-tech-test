import { Routes } from '@angular/router';
import { hasResultGuard } from './core/guards/has-result-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.page').then((m) => m.GamePage),
  },
  {
    path: 'result',
    canActivate: [hasResultGuard],
    loadComponent: () => import('./pages/result/result.page').then((m) => m.ResultPage),
  },
];
