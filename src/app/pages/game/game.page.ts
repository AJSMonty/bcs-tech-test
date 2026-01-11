import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/services/game-state.service';
import { RouletteWheelComponent } from '../../core/components/roulette-wheel/roulette-wheel.component';

@Component({
  standalone: true,
  selector: 'app-game-page',
  templateUrl: './game.page.html',
  styleUrl: './game.page.scss',
  imports: [RouletteWheelComponent],
})
export class GamePage {
  readonly state = inject(GameStateService);
  private readonly router = inject(Router);

  @ViewChild('wheel', { static: true }) wheelRef!: ElementRef<HTMLElement>;

  onSegmentInput(value: string) {
    this.state.setSegmentCount(Number(value));
  }

  spin(mode: 'random' | 'fixed') {
    this.state.startSpin(mode);

    const segments = this.state.segments();
    const index =
      mode === 'fixed'
        ? Math.min(2, segments.length - 1)
        : Math.floor(Math.random() * segments.length);

    const rotation = computeTargetRotation({
      segments: this.state.segments().length,
      index,
      fullSpins: 6,
      pointerOffsetDeg: 0,
    });

    const el = this.wheelRef.nativeElement;

    el.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.2, 1)';
    this.wheelRef.nativeElement.style.transform = `rotate(${rotation}deg)`;

    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'transform') return;

      el.removeEventListener('transitionend', onEnd);

      setTimeout(() => {
        this.state.setResult(index);
        this.router.navigateByUrl('/result');
      }, 1000);
    };

    el.addEventListener('transitionend', onEnd);
  }
}

function computeTargetRotation(opts: {
  segments: number;
  index: number;
  fullSpins: number;
  pointerOffsetDeg: number;
}) {
  const slice = 360 / opts.segments;
  const targetCenter = opts.index * slice + slice / 2;

  return opts.fullSpins * 360 - targetCenter + opts.pointerOffsetDeg;
}
