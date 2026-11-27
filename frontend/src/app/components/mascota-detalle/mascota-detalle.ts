import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';
import { AuthService } from '../../services/auth.service';
import { Mascota } from '../../interfaces/mascota.interface';
import { SolicitudAdopcion } from '../../interfaces/adopcion.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';
import { DialogComponent } from '../../shared/dialog/dialog';

@Component({
  selector: 'app-mascota-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    StatusBadgeComponent,
    DialogComponent
  ],
  templateUrl: './mascota-detalle.html',
  styleUrl: './mascota-detalle.css'
})
export class MascotaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public mascotaService = inject(MascotaService);
  public authService = inject(AuthService);

  mascota = signal<Mascota | null>(null);

  // Estados de Modales
  mostrarModalPostulacion = signal(false);
  mostrarModalExito = signal(false);
  mostrarModalHogarTemporal = signal(false);
  mostrarModalHogarExito = signal(false);
  cargandoEnvio = signal(false);

  // Campos de Adopción Definitiva
  motivoAdopcion = signal('Deseo brindarle un hogar amoroso y tengo espacio adecuado en mi casa en El Tambo.');
  tipoVivienda = signal<'Casa propia' | 'Departamento' | 'Alquilada (con permiso)'>('Casa propia');
  tieneOtrasMascotas = signal(false);
  experienciaPrevia = signal('He tenido perros anteriormente y cuento con veterinario de confianza.');
  codigoGenerado = signal('');

  // Campos de Hogar Temporal
  diasDisponibles = signal('3 a 4 semanas');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'mascota-chaski';
    const encontrada = this.mascotaService.obtenerMascotaPorId(id);
    if (encontrada) {
      this.mascota.set(encontrada);
    } else {
      this.mascota.set(this.mascotaService.obtenerMascotaPorId('mascota-chaski') || null);
    }
  }

  abrirModalPostulacion(): void {
    this.mostrarModalPostulacion.set(true);
  }

  cerrarModalPostulacion(): void {
    this.mostrarModalPostulacion.set(false);
  }

  abrirModalHogarTemporal(): void {
    this.mostrarModalHogarTemporal.set(true);
  }

  cerrarModalHogar(): void {
    this.mostrarModalHogarTemporal.set(false);
  }

  enviarPostulacion(): void {
    const m = this.mascota();
    if (!m) return;

    this.cargandoEnvio.set(true);
    const usuario = this.authService.usuarioActual();
    const codigo = m.codigoAdopcion || '#ADOP-2024-088';
    this.codigoGenerado.set(codigo);

    const nuevaSolicitud: SolicitudAdopcion = {
      codigoSeguimiento: codigo,
      mascotaId: m.id,
      nombreMascota: m.nombre,
      postulanteNombre: usuario?.nombreCompleto || 'Vecino del Mantaro',
      postulanteDni: usuario?.dni || '72384910',
      postulanteTelefono: usuario?.telefono || '964882190',
      postulanteDistrito: usuario?.distrito || m.distrito,
      tipoVivienda: this.tipoVivienda(),
      tieneOtrasMascotas: this.tieneOtrasMascotas(),
      experienciaPrevia: this.experienciaPrevia(),
      motivoAdopcion: this.motivoAdopcion(),
      fechaRegistro: new Date().toLocaleDateString('es-PE'),
      estado: 'En Revisión Oficial'
    };

    setTimeout(() => {
      this.mascotaService.registrarSolicitud(nuevaSolicitud);
      this.cargandoEnvio.set(false);
      this.mostrarModalPostulacion.set(false);
      this.mostrarModalExito.set(true);
    }, 450);
  }

  enviarPostulacionHogar(): void {
    this.cargandoEnvio.set(true);
    setTimeout(() => {
      this.cargandoEnvio.set(false);
      this.mostrarModalHogarTemporal.set(false);
      this.mostrarModalHogarExito.set(true);
    }, 450);
  }

  cerrarExito(): void {
    this.mostrarModalExito.set(false);
    this.router.navigate(['/inicio']);
  }

  cerrarExitoHogar(): void {
    this.mostrarModalHogarExito.set(false);
  }
}
