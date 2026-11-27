import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';
import { ReporteService } from '../../services/reporte.service';
import { ReporteEmergencia, TipoReporte } from '../../interfaces/reporte.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent, type BadgeTone } from '../../shared/status-badge/status-badge';
import { FilterPillsComponent } from '../../shared/filter-pills/filter-pills';
import { ProgressTrackComponent } from '../../shared/progress-track/progress-track';
import { DialogComponent } from '../../shared/dialog/dialog';

@Component({
  selector: 'app-inicio-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    StatusBadgeComponent,
    FilterPillsComponent,
    ProgressTrackComponent,
    DialogComponent
  ],
  templateUrl: './inicio-catalogo.html',
  styleUrl: './inicio-catalogo.css'
})
export class InicioCatalogoComponent {
  public mascotaService = inject(MascotaService);
  public reporteService = inject(ReporteService);

  // Filtros adicionales de Figma
  rangoEdad = signal('TODOS');
  tamanoFiltro = signal('TODOS');

  // Reportes de la red de alerta rápida
  filtroReporte = signal<'TODOS' | TipoReporte>('TODOS');

  readonly opcionesReporte = [
    { label: 'Todos los reportes', value: 'TODOS' },
    { label: 'Pérdidas', value: 'PERDIDA' },
    { label: 'Hallazgos', value: 'HALLAZGO' },
    { label: 'Hogar temporal', value: 'HOGAR_TEMPORAL_URGENTE' }
  ] as const;

  readonly reportesActivos = computed(() => this.reporteService.reportes().filter(r => r.activo));

  readonly reportesFiltrados = computed(() => {
    const filtro = this.filtroReporte();
    const reportes = this.reportesActivos();
    return filtro === 'TODOS' ? reportes : reportes.filter(r => r.tipo === filtro);
  });

  readonly reporteDestacado = computed<ReporteEmergencia | undefined>(() => {
    const activos = this.reportesActivos();
    if (!activos.length) return undefined;

    return [...activos].sort((a, b) => (b.creadoEn ?? 0) - (a.creadoEn ?? 0))[0];
  });

  readonly opcionesEspecie = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Perros', value: 'Perro' },
    { label: 'Gatos', value: 'Gato' }
  ] as const;

  readonly opcionesDistrito = [
    { label: 'Todos los Distritos', value: 'TODOS' },
    { label: 'El Tambo', value: 'El Tambo' },
    { label: 'Huancayo Centro', value: 'Huancayo Centro' },
    { label: 'Chilca', value: 'Chilca' },
    { label: 'Pilcomayo', value: 'Pilcomayo' },
    { label: 'San Jerónimo', value: 'San Jerónimo' }
  ] as const;

  // Modal Hogar Temporal (Figma 129:4181)
  mostrarModalHogarTemporal = signal(false);
  mostrarModalHogarExito = signal(false);
  cargandoHogar = signal(false);
  mascotaHogarNombre = signal('Chaski');

  // Campos para hogar temporal
  diasDisponibles = signal('3 a 4 semanas');
  tipoViviendaHogar = signal('Casa con patio seguro');
  telefonoContactoHogar = signal('964 882 119');

  seleccionarFiltroReporte(valor: string): void {
    if (
      valor === 'TODOS' ||
      valor === 'PERDIDA' ||
      valor === 'HALLAZGO' ||
      valor === 'HOGAR_TEMPORAL_URGENTE'
    ) {
      this.filtroReporte.set(valor);
    }
  }

  etiquetaTipoReporte(tipo: TipoReporte): string {
    switch (tipo) {
      case 'PERDIDA': return 'PÉRDIDA';
      case 'HALLAZGO': return 'HALLAZGO';
      case 'HOGAR_TEMPORAL_URGENTE': return 'HOGAR TEMPORAL URGENTE';
    }
  }

  tonoTipoReporte(tipo: TipoReporte): BadgeTone {
    switch (tipo) {
      case 'PERDIDA': return 'urgent';
      case 'HALLAZGO': return 'teal';
      case 'HOGAR_TEMPORAL_URGENTE': return 'ochre';
    }
  }

  nombreReporte(nombre: string | undefined): string {
    return nombre?.trim() || 'Mascota sin nombre';
  }

  etiquetaAlerta(tipo: TipoReporte): string {
    switch (tipo) {
      case 'PERDIDA': return 'ALERTA CRÍTICA HUANCAYO';
      case 'HALLAZGO': return 'HALLAZGO RECIENTE · HUANCAYO';
      case 'HOGAR_TEMPORAL_URGENTE': return 'HOGAR TEMPORAL URGENTE';
    }
  }

  textoAlerta(reporte: ReporteEmergencia): string {
    const nombre = this.nombreReporte(reporte.nombreMascota).toUpperCase();
    const especie = reporte.especie === 'Perro'
      ? 'PERRITO'
      : reporte.especie === 'Gato'
        ? 'GATITO'
        : 'MASCOTA';
    const color = reporte.colorPrincipal?.trim();
    const descriptor = color ? `${especie} ${color.toUpperCase()}` : especie;
    const lugar = `${reporte.direccionOReferencia.trim().replace(/\.$/, '')} (${reporte.distrito})`.toUpperCase();

    switch (reporte.tipo) {
      case 'PERDIDA':
        return `SE BUSCA ${descriptor} "${nombre}" EXTRAVIADO — ${lugar}.`;
      case 'HALLAZGO':
        return `SE ENCONTRÓ ${descriptor} "${nombre}" — ${lugar}.`;
      case 'HOGAR_TEMPORAL_URGENTE':
        return `SE NECESITA HOGAR TEMPORAL PARA ${descriptor} "${nombre}" — ${lugar}.`;
    }
  }

  enlaceTelefono(telefono: string): string {
    return `tel:${telefono.replace(/\s/g, '')}`;
  }

  cambiarEspecie(especie: string): void {
    this.mascotaService.filtroEspecie.set(especie);
  }

  cambiarDistrito(distrito: string): void {
    this.mascotaService.filtroDistrito.set(distrito);
  }

  abrirHogarTemporal(nombreMascota: string = 'Chaski'): void {
    this.mascotaHogarNombre.set(nombreMascota);
    this.mostrarModalHogarTemporal.set(true);
  }

  cerrarModalHogar(): void {
    this.mostrarModalHogarTemporal.set(false);
  }

  enviarPostulacionHogar(): void {
    this.cargandoHogar.set(true);
    setTimeout(() => {
      this.cargandoHogar.set(false);
      this.mostrarModalHogarTemporal.set(false);
      this.mostrarModalHogarExito.set(true);
    }, 450);
  }

  cerrarExitoHogar(): void {
    this.mostrarModalHogarExito.set(false);
  }
}
