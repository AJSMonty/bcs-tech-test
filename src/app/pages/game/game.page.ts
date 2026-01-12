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
  landOnLabel = '0';

  private indexForLabel(label: string): number | null {
    const segments = this.state.segments();
    const idx = segments.findIndex((s) => s.label === label);
    return idx >= 0 ? idx : null;
  }

  get fixedIndex(): number | null {
    const idx = this.state.segments().findIndex((s) => s.label === this.landOnLabel);
    return idx >= 0 ? idx : null;
  }

  onSegmentInput(value: number) {
    this.state.setSegmentCount(value);
  }

  onLandOnInput(value: string) {
    this.landOnLabel = value.trim();
  }

  spin(mode: 'random' | 'fixed') {
    this.state.startSpin(mode);

    const segments = this.state.segments();

    let index: number;

    if (mode === 'fixed') {
      const idx = this.indexForLabel(this.landOnLabel);
      index = idx ?? 0;
    } else {
      index = Math.floor(Math.random() * segments.length);
    }

    const rotation = computeTargetRotation({
      segments: segments.length,
      index,
      fullSpins: 6,
      pointerOffsetDeg: 0,
    });

    const el = this.wheelRef.nativeElement;
    const pointer = document.querySelector('.pointer') as HTMLElement | null;
    pointer?.classList.add('pointer--active');

    el.style.transition = 'none';
    void el.offsetWidth;

    el.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.2, 1)';
    el.style.transform = `rotate(${rotation}deg)`;

    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', onEnd);
      pointer?.classList.remove('pointer--active');
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
