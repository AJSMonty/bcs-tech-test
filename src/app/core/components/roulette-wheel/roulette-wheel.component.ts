import { Component, Input, computed, signal } from '@angular/core';
import { Segment } from '../../models/segment';

type BuiltSegment = {
  id: string;
  label: string;
  pathD: string;
  labelX: number;
  labelY: number;
  labelRotate: number;
  colorClass: string;
};

@Component({
  standalone: true,
  selector: 'app-roulette-wheel',
  templateUrl: './roulette-wheel.component.html',
  styleUrl: './roulette-wheel.component.scss',
})
export class RouletteWheelComponent {
  private readonly _segments = signal<Segment[]>([]);
  private readonly _radius = signal<number>(160);
  private readonly _labelRadiusFactor = signal<number>(0.85);
  readonly radiusValue = computed(() => this._radius());

  @Input({ required: true })
  set segments(value: Segment[] | null | undefined) {
    this._segments.set(value ?? []);
  }

  @Input()
  set radius(value: number | null | undefined) {
    this._radius.set(typeof value === 'number' ? value : 160);
  }

  @Input()
  set labelRadiusFactor(value: number | null | undefined) {
    this._labelRadiusFactor.set(typeof value === 'number' ? value : 0.85);
  }

  @Input() rotationDeg = 0;

  readonly size = computed(() => this._radius() * 2);

  readonly built = computed<BuiltSegment[]>(() => {
    const segs = this._segments();
    const n = segs.length || 1;

    const r = this._radius();
    const cx = r;
    const cy = r;

    const slice = (2 * Math.PI) / n;
    const startOffset = -Math.PI / 2;

    return segs.map((s, i) => {
      const a0 = startOffset + i * slice;
      const a1 = a0 + slice;

      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);

      const largeArc = slice > Math.PI ? 1 : 0;

      const pathD = [
        `M ${cx} ${cy}`,
        `L ${x0} ${y0}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1}`,
        'Z',
      ].join(' ');

      const mid = (a0 + a1) / 2;
      const lr = r * this._labelRadiusFactor();

      const labelX = cx + lr * Math.cos(mid);
      const labelY = cy + lr * Math.sin(mid);
      const labelRotate = (mid * 180) / Math.PI + 90;

      return {
        id: s.id,
        label: s.label,
        pathD,
        labelX,
        labelY,
        labelRotate,
        colorClass: i === 0 ? 'segment--green' : i % 2 === 0 ? 'segment--red' : 'segment--black',
      };
    });
  });
}
