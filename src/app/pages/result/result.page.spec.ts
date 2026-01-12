import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultPage } from './result.page';
import { provideRouter } from '@angular/router';

describe('ResultPage', () => {
  let component: ResultPage;
  let fixture: ComponentFixture<ResultPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
