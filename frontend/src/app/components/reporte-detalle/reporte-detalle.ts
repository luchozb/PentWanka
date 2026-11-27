import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ReporteService } from '../../services/reporte.service';
import { ReporteEmergencia, TipoReporte } from '../../interfaces/reporte.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent, type BadgeTone } from '../../shared/status-badge/status-badge';
import { MapaReporteComponent } from '../../shared/mapa-reporte/mapa-reporte';
import { DialogComponent } from '../../shared/dialog/dialog';

@Component({
  selector: 'app-reporte-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    StatusBadgeComponent,
    MapaReporteComponent,
    DialogComponent
  ],
  templateUrl: './reporte-detalle.html',
  styleUrl: './reporte-detalle.css'
})
export class ReporteDetalleComponent {
  private readonly route = inject(ActivatedRoute);
  public readonly reporteService = inject(ReporteService);

  private readonly id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' }
  );

  readonly reporte = computed(() => this.reporteService.obtenerReportePorId(this.id()));
  readonly confirmarCierre = signal(false);

  etiquetaTipo(tipo: TipoReporte): string {
    switch (tipo) {
      case 'PERDIDA': return 'PÉRDIDA';
      case 'HALLAZGO': return 'HALLAZGO';
      case 'HOGAR_TEMPORAL_URGENTE': return 'HOGAR TEMPORAL URGENTE';
    }
  }

  tonoTipo(tipo: TipoReporte): BadgeTone {
    switch (tipo) {
      case 'PERDIDA': return 'urgent';
      case 'HALLAZGO': return 'teal';
      case 'HOGAR_TEMPORAL_URGENTE': return 'ochre';
    }
  }

  nombreMascota(reporte: ReporteEmergencia): string {
    return reporte.nombreMascota?.trim() || 'Mascota sin nombre';
  }

  enlaceTelefono(telefono: string): string {
    return `tel:${telefono.replace(/\s/g, '')}`;
  }

  enlaceWhatsapp(telefono: string): string {
    return `https://wa.me/51${telefono.replace(/\D/g, '')}`;
  }

  marcarEncontrado(): void {
    const reporte = this.reporte();
    if (reporte) this.reporteService.desactivarReporte(reporte.id);
    this.confirmarCierre.set(false);
  }
}
