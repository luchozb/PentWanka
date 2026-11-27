import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlbergueService } from '../../services/albergue.service';
import { ObservatorioService } from '../../services/observatorio.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';
import { FilterPillsComponent, FilterOption } from '../../shared/filter-pills/filter-pills';
import { ProgressTrackComponent } from '../../shared/progress-track/progress-track';

@Component({
  selector: 'app-observatorio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    StatusBadgeComponent,
    FilterPillsComponent,
    ProgressTrackComponent
  ],
  templateUrl: './observatorio.html',
  styleUrl: './observatorio.css'
})
export class ObservatorioComponent {
  public albergueService = inject(AlbergueService);
  public readonly observatorioService = inject(ObservatorioService);

  readonly periodos: FilterOption[] = [
    { label: 'Todo el 2024', value: 'ANIO' },
    { label: 'Último Trimestre', value: 'TRIMESTRE' },
    { label: 'Este Mes', value: 'MES' }
  ];

  periodoSeleccionado = signal<'ANIO' | 'TRIMESTRE' | 'MES'>('ANIO');

  seleccionarPeriodo(p: 'ANIO' | 'TRIMESTRE' | 'MES'): void {
    this.periodoSeleccionado.set(p);
  }
}
