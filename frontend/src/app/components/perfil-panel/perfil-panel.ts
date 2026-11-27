import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReporteService } from '../../services/reporte.service';
import { MascotaService } from '../../services/mascota.service';
import { Usuario } from '../../interfaces/auth.interface';
import { Mascota, MascotaFormulario } from '../../interfaces/mascota.interface';
import { ReporteEmergencia } from '../../interfaces/reporte.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

type PestanaPanel = 'reportes' | 'adopciones';
type TipoAviso = { texto: string; error: boolean };

@Component({
  selector: 'app-perfil-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent, StatusBadgeComponent],
  templateUrl: './perfil-panel.html',
  styleUrl: './perfil-panel.css'
})
export class PerfilPanelComponent {
  private readonly authService = inject(AuthService);
  private readonly reporteService = inject(ReporteService);
  private readonly mascotaService = inject(MascotaService);

  readonly pestana = signal<PestanaPanel>('reportes');
  readonly aviso = signal<TipoAviso | null>(null);

  readonly editandoId = signal<string | null>(null);
  readonly confirmandoEliminacion = signal<string | null>(null);

  readonly editNombre = signal('');
  readonly editRaza = signal('');
  readonly editEdad = signal('');
  readonly editDistrito = signal('');
  readonly editDescripcion = signal('');
  readonly editTelefono = signal('');

  readonly usuario = computed(() => this.authService.usuarioActual());

  readonly misReportes = computed<ReporteEmergencia[]>(() => {
    const usuario = this.usuario();
    if (!usuario) return [];

    return this.reporteService.reportes()
      .filter(reporte => this.esVisible(reporte.creadoPor, reporte.albergueId, usuario))
      .slice()
      .sort((a, b) => (b.creadoEn ?? 0) - (a.creadoEn ?? 0));
  });

  readonly misAdopciones = computed<Mascota[]>(() => {
    const usuario = this.usuario();
    if (!usuario) return [];

    return this.mascotaService.mascotas()
      .filter(mascota => this.esVisible(mascota.creadoPor, mascota.albergueId, usuario));
  });

  seleccionarPestana(pestana: PestanaPanel): void {
    this.pestana.set(pestana);
    this.cancelarEdicion();
    this.confirmandoEliminacion.set(null);
  }

  cerrarReporte(reporte: ReporteEmergencia): void {
    this.reporteService.desactivarReporte(reporte.id);
    this.mostrarAviso('Reporte cerrado correctamente.');
  }

  reabrirReporte(reporte: ReporteEmergencia): void {
    this.reporteService.reactivarReporte(reporte.id);
    this.mostrarAviso('Reporte reabierto correctamente.');
  }

  editar(mascota: Mascota): void {
    this.editandoId.set(mascota.id);
    this.confirmandoEliminacion.set(null);
    this.editNombre.set(mascota.nombre);
    this.editRaza.set(mascota.raza);
    this.editEdad.set(mascota.edadAprox);
    this.editDistrito.set(mascota.distrito);
    this.editDescripcion.set(mascota.descripcion);
    this.editTelefono.set(mascota.telefonoAlbergue);
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  guardarEdicion(mascota: Mascota): void {
    this.mascotaService.actualizar(mascota.id, this.formularioDesdeEdicion(mascota)).subscribe({
      next: () => {
        this.editandoId.set(null);
        this.mostrarAviso('Ficha actualizada correctamente.');
      },
      error: () => this.mostrarAviso('No se pudo actualizar la ficha.', true)
    });
  }

  cambiarEstado(mascota: Mascota): void {
    if (mascota.estado === 'Adoptado') {
      this.mascotaService.restaurar(mascota.id).subscribe({
        next: () => this.mostrarAviso('Ficha restaurada en adopción.'),
        error: () => this.mostrarAviso('No se pudo restaurar la ficha.', true)
      });
      return;
    }

    this.mascotaService.marcarAdoptada(mascota.id).subscribe({
      next: () => this.mostrarAviso('Mascota marcada como adoptada.'),
      error: () => this.mostrarAviso('No se pudo cambiar el estado.', true)
    });
  }

  pedirEliminacion(id: string): void {
    this.confirmandoEliminacion.set(id);
    this.editandoId.set(null);
  }

  cancelarEliminacion(): void {
    this.confirmandoEliminacion.set(null);
  }

  eliminar(mascota: Mascota): void {
    this.mascotaService.eliminar(mascota.id).subscribe({
      next: () => {
        this.confirmandoEliminacion.set(null);
        this.mostrarAviso('Publicación eliminada.');
      },
      error: () => this.mostrarAviso('No se pudo eliminar la publicación.', true)
    });
  }

  etiquetaTipo(tipo: string): string {
    const etiquetas: Record<string, string> = {
      PERDIDA: 'Pérdida',
      HALLAZGO: 'Hallazgo',
      HOGAR_TEMPORAL_URGENTE: 'Hogar temporal urgente'
    };
    return etiquetas[tipo] ?? tipo;
  }

  tonoMascota(estado: string): 'success' | 'ochre' | 'teal' {
    if (estado === 'Adoptado') return 'success';
    if (estado === 'Hogar Temporal Urgente' || estado === 'En Tratamiento') return 'ochre';
    return 'teal';
  }

  private esVisible(
    creadoPor: string | undefined,
    albergueId: string | undefined,
    usuario: Usuario
  ): boolean {
    if (creadoPor && creadoPor === usuario.id) return true;
    return Boolean(usuario.albergueId && albergueId && usuario.albergueId === albergueId);
  }

  private formularioDesdeEdicion(mascota: Mascota): MascotaFormulario {
    return {
      nombre: this.editNombre().trim() || mascota.nombre,
      especie: mascota.especie,
      raza: this.editRaza().trim() || mascota.raza,
      genero: mascota.genero,
      edadAprox: this.editEdad().trim() || mascota.edadAprox,
      tamano: mascota.tamano,
      distrito: this.editDistrito().trim() || mascota.distrito,
      descripcion: this.editDescripcion().trim() || mascota.descripcion,
      evaluacionConductual: mascota.evaluacionConductual,
      vacunasAlDia: mascota.vacunasAlDia,
      esterilizado: mascota.esterilizado,
      desparasitado: mascota.desparasitado,
      imagenUrl: mascota.imagenUrl,
      albergueId: mascota.albergueId,
      nombreAlbergue: mascota.nombreAlbergue,
      coordinadorAlbergue: mascota.coordinadorAlbergue,
      direccionAlbergue: mascota.direccionAlbergue,
      telefonoAlbergue: this.editTelefono().trim() || mascota.telefonoAlbergue,
      horarioVisitas: mascota.horarioVisitas,
      referenciaAlbergue: mascota.referenciaAlbergue,
      creadoPor: mascota.creadoPor
    };
  }

  private mostrarAviso(texto: string, error = false): void {
    this.aviso.set({ texto, error });
  }
}
