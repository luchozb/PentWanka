import { TestBed } from '@angular/core/testing';
import { rutaConParametros, testProviders } from '../../testing/test-providers';
import { MascotaDetalleComponent } from './mascota-detalle';

describe('MascotaDetalleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaDetalleComponent],
      providers: [...testProviders, rutaConParametros({ id: 'mascota-chaski' })]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MascotaDetalleComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
