import { TestBed } from '@angular/core/testing';
import { rutaConParametros, testProviders } from '../../testing/test-providers';
import { AlberguesComponent } from './albergues';

describe('AlberguesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlberguesComponent],
      providers: [...testProviders, rutaConParametros({ id: 'alb-1' })]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AlberguesComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
