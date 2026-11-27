import { TestBed } from '@angular/core/testing';
import { testProviders } from '../../testing/test-providers';
import { ObservatorioComponent } from './observatorio';

describe('ObservatorioComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservatorioComponent],
      providers: [...testProviders]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ObservatorioComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
