import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CampanaService } from '../../services/campana.service';
import { AuthService } from '../../services/auth.service';
import { CampanaVeterinaria } from '../../interfaces/campana.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';
import { ProgressTrackComponent } from '../../shared/progress-track/progress-track';
import { DialogComponent } from '../../shared/dialog/dialog';

@Component({
  selector: 'app-campanas',
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
  templateUrl: './campanas.html',
  styleUrl: './campanas.css'
})
export class CampanasComponent {
  public campanaService = inject(CampanaService);
  public authService = inject(AuthService);

  campanaSeleccionada = signal<CampanaVeterinaria | null>(null);
  mostrarModalReserva = signal(false);
  reservaConfirmada = signal(false);

  // Datos para reserva
  nombrePropietario = signal('');
  telefonoPropietario = signal('');
  nombreMascota = signal('');
  especieMascota = signal('Perro');

  constructor() {
    const usuario = this.authService.usuarioActual();
    if (usuario) {
      this.nombrePropietario.set(usuario.nombreCompleto);
      this.telefonoPropietario.set(usuario.telefono || '');
    }
  }

  abrirReserva(campana: CampanaVeterinaria): void {
    this.campanaSeleccionada.set(campana);
    this.mostrarModalReserva.set(true);
    this.reservaConfirmada.set(false);
  }

  cerrarReserva(): void {
    this.mostrarModalReserva.set(false);
    this.campanaSeleccionada.set(null);
  }

  confirmarReserva(): void {
    const c = this.campanaSeleccionada();
    if (!c) return;

    this.campanaService.reservarCupo(c.id);
    this.reservaConfirmada.set(true);
  }
}
