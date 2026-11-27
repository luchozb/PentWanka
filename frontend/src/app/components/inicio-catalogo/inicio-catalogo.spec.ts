import { TestBed } from '@angular/core/testing';
import { testProviders } from '../../testing/test-providers';
import { InicioCatalogoComponent } from './inicio-catalogo';

describe('InicioCatalogoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioCatalogoComponent],
      providers: [...testProviders]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(InicioCatalogoComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose the adoption anchor', () => {
    const fixture = TestBed.createComponent(InicioCatalogoComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#adopciones')).toBeTruthy();
  });
});
