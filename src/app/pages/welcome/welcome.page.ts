import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouletteWheelComponent } from '../../core/components/roulette-wheel/roulette-wheel.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-welcome.page',
  imports: [RouterLink, RouletteWheelComponent],
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.scss',
})
export class WelcomePage {
  state = inject(GameStateService);
}
