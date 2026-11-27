import { TestBed } from '@angular/core/testing';
import { FilterPillsComponent } from './filter-pills';

describe('FilterPillsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPillsComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FilterPillsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
