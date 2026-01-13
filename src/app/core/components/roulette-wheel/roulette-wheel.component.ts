import { Component, Input, computed, signal } from '@angular/core';
import { BuiltSegment, Segment } from '../../models/segment';
import { DEFAULT_LABEL_RADIUS_FACTOR, DEFAULT_RADIUS } from '../../constants/roulette-constants';

@Component({
  standalone: true,
  selector: 'app-roulette-wheel',
  templateUrl: './roulette-wheel.component.html',
  styleUrl: './roulette-wheel.component.scss',
})
export class RouletteWheelComponent {
  private readonly _segments = signal<Segment[]>([]);
  private readonly _radius = signal<number>(DEFAULT_RADIUS);
  private readonly _labelRadiusFactor = signal<number>(DEFAULT_LABEL_RADIUS_FACTOR);
  readonly radiusValue = computed(() => this._radius());

  @Input({ required: true })
  set segments(value: Segment[] | null | undefined) {
    this._segments.set(value ?? []);
  }

  @Input()
  set radius(value: number | null | undefined) {
    this._radius.set(typeof value === 'number' ? value : DEFAULT_RADIUS);
  }

  @Input()
  set labelRadiusFactor(value: number | null | undefined) {
    this._labelRadiusFactor.set(typeof value === 'number' ? value : DEFAULT_LABEL_RADIUS_FACTOR);
  }

  readonly size = computed(() => this._radius() * 2);

  readonly builtWheel = computed<BuiltSegment[]>(() => {
    const builtSegments = this._segments();
    const numberOfBuiltSegmentSlices = builtSegments.length || 1;

    const radius = this._radius();
    const cx = radius;
    const cy = radius;

    const segmentSliceSize = (2 * Math.PI) / numberOfBuiltSegmentSlices;
    const startOffset = -Math.PI / 2;

    return builtSegments.map((segment, index) => {
      const startAngle = startOffset + index * segmentSliceSize;
      const endAngle = startAngle + segmentSliceSize;

      const x0 = cx + radius * Math.cos(startAngle);
      const y0 = cy + radius * Math.sin(startAngle);
      const x1 = cx + radius * Math.cos(endAngle);
      const y1 = cy + radius * Math.sin(endAngle);

      const largeArc = segmentSliceSize > Math.PI ? 1 : 0;

      const segmentSlicePath = [
        `M ${cx} ${cy}`,
        `L ${x0} ${y0}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1}`,
        'Z',
      ].join(' ');

      const midSliceAngle = (startAngle + endAngle) / 2;
      const labelRadius = radius * this._labelRadiusFactor();

      const labelX = cx + labelRadius * Math.cos(midSliceAngle);
      const labelY = cy + labelRadius * Math.sin(midSliceAngle);
      const labelRotate = (midSliceAngle * 180) / Math.PI + 90;

      return {
        id: segment.id,
        label: segment.label,
        segmentSlicePath,
        labelX,
        labelY,
        labelRotate,
        colorClass:
          index === 0 ? 'segment-green' : index % 2 === 0 ? 'segment-red' : 'segment-black',
      };
    });
  });
}
