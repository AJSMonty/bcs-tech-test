import { TestBed } from '@angular/core/testing';

import { GameStateService } from './game-state.service';

describe('GameState', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
