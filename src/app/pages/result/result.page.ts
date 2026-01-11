import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  standalone: true,
  selector: 'app-result-page',
  imports: [RouterLink],
  templateUrl: './result.page.html',
})
export class ResultPage {
  readonly state = inject(GameStateService);
}
