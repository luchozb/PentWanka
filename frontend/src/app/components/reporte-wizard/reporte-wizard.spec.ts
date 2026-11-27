import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { MascotaService } from '../../services/mascota.service';
import { ReporteService } from '../../services/reporte.service';
import { rutaConParametros, testProviders } from '../../testing/test-providers';
import { ReporteWizardComponent } from './reporte-wizard';

describe('ReporteWizardComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ReporteWizardComponent],
      providers: [...testProviders]
    }).compileComponents();

    TestBed.inject(AuthService).iniciarSesion({
      id: 'usr-1',
      email: 'vecino.huancayo@wankapets.pe',
      nombreCompleto: 'Daniel Quispe Huamán',
      rol: 'VECINO',
      distrito: 'El Tambo'
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReporteWizardComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should enable adoption mode from query param', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ReporteWizardComponent],
      providers: [...testProviders, rutaConParametros({}, { modo: 'adopcion' })]
    }).compileComponents();

    const fixture = TestBed.createComponent(ReporteWizardComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.esAdopcion()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Publicar Mascota en Adopción');
  });

  it('crea un reporte con el autor de la sesión', () => {
    const fixture = TestBed.createComponent(ReporteWizardComponent);
    fixture.detectChanges();

    fixture.componentInstance.finalizarReporte();

    const creado = TestBed.inject(ReporteService).reportes()[0];
    expect(creado.creadoPor).toBe('usr-1');
    expect(creado.activo).toBe(true);
  });

  it('publica una adopción con el autor de la sesión', () => {
    const fixture = TestBed.createComponent(ReporteWizardComponent);
    fixture.detectChanges();

    fixture.componentInstance.seleccionarTipo('ADOPCION');
    fixture.componentInstance.finalizarReporte();

    const creada = TestBed.inject(MascotaService).mascotas()[0];
    expect(creada.creadoPor).toBe('usr-1');
  });
});
