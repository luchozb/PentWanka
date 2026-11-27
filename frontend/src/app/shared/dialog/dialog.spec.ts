import { TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog';

describe('DialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DialogComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
