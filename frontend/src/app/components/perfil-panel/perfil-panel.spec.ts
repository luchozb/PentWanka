import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { MascotaService } from '../../services/mascota.service';
import { ReporteService } from '../../services/reporte.service';
import { testProviders } from '../../testing/test-providers';
import { PerfilPanelComponent } from './perfil-panel';

describe('PerfilPanelComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [PerfilPanelComponent],
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
    const fixture = TestBed.createComponent(PerfilPanelComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra solo los reportes propios', () => {
    const fixture = TestBed.createComponent(PerfilPanelComponent);
    fixture.detectChanges();

    const ids = fixture.componentInstance.misReportes().map(reporte => reporte.id);
    expect(ids).toContain('rep-rocky');
    expect(ids).not.toContain('rep-1');
  });

  it('incluye las publicaciones del albergue del usuario', () => {
    TestBed.inject(AuthService).iniciarSesion({
      id: 'usr-2',
      email: 'albergue@wankapets.pe',
      nombreCompleto: 'Valeria Paucar',
      rol: 'ALBERGUE',
      distrito: 'El Tambo',
      nombreAlbergue: 'Huellitas del Mantaro',
      albergueId: 'alb-1'
    });

    const fixture = TestBed.createComponent(PerfilPanelComponent);
    fixture.detectChanges();

    const ids = fixture.componentInstance.misAdopciones().map(mascota => mascota.id);
    expect(ids).toContain('mascota-munay');
  });

  it('cierra y reabre un reporte propio', () => {
    const fixture = TestBed.createComponent(PerfilPanelComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const reporte = component.misReportes().find(item => item.id === 'rep-rocky');
    const reporteService = TestBed.inject(ReporteService);
    expect(reporte).toBeDefined();

    component.cerrarReporte(reporte!);
    expect(reporteService.obtenerReportePorId('rep-rocky')?.activo).toBe(false);

    component.reabrirReporte(reporte!);
    expect(reporteService.obtenerReportePorId('rep-rocky')?.activo).toBe(true);
  });

  it('actualiza una adopción propia sin borrar los demás datos', () => {
    const fixture = TestBed.createComponent(PerfilPanelComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const mascotaService = TestBed.inject(MascotaService);
    const mascota = component.misAdopciones().find(item => item.id === 'mascota-chaski');
    expect(mascota).toBeDefined();

    component.editar(mascota!);
    component.editNombre.set('Chaski Actualizado');
    component.guardarEdicion(mascota!);

    const actualizada = mascotaService.obtenerMascotaPorId('mascota-chaski');
    expect(actualizada?.nombre).toBe('Chaski Actualizado');
    expect(actualizada?.microchip).toBe(mascota!.microchip);
  });

  it('elimina una adopción propia después de confirmarla', () => {
    const fixture = TestBed.createComponent(PerfilPanelComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const mascotaService = TestBed.inject(MascotaService);
    const mascota = component.misAdopciones().find(item => item.id === 'mascota-chaski');
    expect(mascota).toBeDefined();

    component.pedirEliminacion('mascota-chaski');
    expect(component.confirmandoEliminacion()).toBe('mascota-chaski');

    component.eliminar(mascota!);
    expect(mascotaService.obtenerMascotaPorId('mascota-chaski')).toBeUndefined();
    expect(component.confirmandoEliminacion()).toBeNull();
  });
});
