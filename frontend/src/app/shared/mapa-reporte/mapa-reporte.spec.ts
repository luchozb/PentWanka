import { TestBed } from '@angular/core/testing';
import { MapaReporteComponent } from './mapa-reporte';

describe('MapaReporteComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaReporteComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MapaReporteComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
