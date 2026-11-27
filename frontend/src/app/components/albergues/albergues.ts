import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlbergueService } from '../../services/albergue.service';
import { MascotaService } from '../../services/mascota.service';
import { Albergue } from '../../interfaces/albergue.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';
import { ProgressTrackComponent } from '../../shared/progress-track/progress-track';
import { DialogComponent } from '../../shared/dialog/dialog';

@Component({
  selector: 'app-albergues',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    StatusBadgeComponent,
    ProgressTrackComponent,
    DialogComponent
  ],
  templateUrl: './albergues.html',
  styleUrl: './albergues.css'
})
export class AlberguesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public albergueService = inject(AlbergueService);
  public mascotaService = inject(MascotaService);

  albergueActual = signal<Albergue | null>(null);
  mostrarModalDonar = signal(false);

  // Mascotas pertenecientes a este albergue
  mascotasDelAlbergue = computed(() => {
    const a = this.albergueActual();
    if (!a) return this.mascotaService.mascotas().slice(0, 3);
    const filtradas = this.mascotaService.mascotas().filter(m => m.albergueId === a.id);
    return filtradas.length > 0 ? filtradas : this.mascotaService.mascotas().slice(0, 3);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'alb-1';
    const a = this.albergueService.obtenerPorId(id);
    this.albergueActual.set(a || this.albergueService.albergues()[0]);
  }

  abrirDonar(): void {
    this.mostrarModalDonar.set(true);
  }

  cerrarDonar(): void {
    this.mostrarModalDonar.set(false);
  }
}
