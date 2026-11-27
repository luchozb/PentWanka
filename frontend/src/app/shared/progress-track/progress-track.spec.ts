import { TestBed } from '@angular/core/testing';
import { ProgressTrackComponent } from './progress-track';

describe('ProgressTrackComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTrackComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProgressTrackComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
