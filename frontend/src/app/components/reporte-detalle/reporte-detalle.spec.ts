import { TestBed } from '@angular/core/testing';
import { rutaConParametros, testProviders } from '../../testing/test-providers';
import { ReporteDetalleComponent } from './reporte-detalle';

describe('ReporteDetalleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDetalleComponent],
      providers: [...testProviders, rutaConParametros({ id: 'rep-rocky' })]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReporteDetalleComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
