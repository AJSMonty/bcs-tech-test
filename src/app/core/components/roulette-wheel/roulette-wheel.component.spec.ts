import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouletteWheelComponent } from './roulette-wheel.component';

describe('RouletteWheel', () => {
  let component: RouletteWheelComponent;
  let fixture: ComponentFixture<RouletteWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouletteWheelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouletteWheelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
