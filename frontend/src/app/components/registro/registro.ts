import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RolUsuario, Usuario } from '../../interfaces/auth.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';
import { resolverAlbergueId } from '../../shared/utils/albergue';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent, StatusBadgeComponent],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Rol seleccionado
  rolSeleccionado = signal<RolUsuario>('VECINO');

  // Configuración de tema por rol: un único acento del sistema de diseño
  temaActual = computed(() => {
    switch (this.rolSeleccionado()) {
      case 'VECINO':
        return {
          colorPrincipal: 'var(--accent)',
          colorHover: 'var(--accent-deep)',
          fondoSuave: 'var(--accent-soft)',
          textoBadge: 'Formulario de Vecino: Validación ciudadana con DNI para el Valle del Mantaro.',
          textoBoton: 'Completar Registro de Vecino'
        };
      case 'ALBERGUE':
        return {
          colorPrincipal: 'var(--accent)',
          colorHover: 'var(--accent-deep)',
          fondoSuave: 'var(--accent-soft)',
          textoBadge: 'Formulario de Albergue: Al registrarte se vinculará tu acceso con la INTERFAZ 6: Gestión de Refugios.',
          textoBoton: 'Completar Registro de Albergue'
        };
      case 'VETERINARIA':
        return {
          colorPrincipal: 'var(--accent)',
          colorHover: 'var(--accent-deep)',
          fondoSuave: 'var(--accent-soft)',
          textoBadge: 'Formulario de Veterinaria: Validación obligatoria mediante Colegio Médico Veterinario del Perú (CMVP).',
          textoBoton: 'Completar Registro de Veterinaria'
        };
      default:
        return {
          colorPrincipal: 'var(--accent)',
          colorHover: 'var(--accent-deep)',
          fondoSuave: 'var(--accent-soft)',
          textoBadge: 'Registro Comunitario',
          textoBoton: 'Completar Registro'
        };
    }
  });

  // Campos comunes
  email = signal('');
  password = signal('');
  nombreCompleto = signal('');
  telefono = signal('');
  distrito = signal('El Tambo');

  // Campos Vecino
  dni = signal('');

  // Campos Albergue
  nombreAlbergue = signal('');
  rucoRegistro = signal('');
  capacidad = signal(45);
  direccionAlbergue = signal('');

  // Campos Veterinaria
  nombreVeterinaria = signal('');
  cmvp = signal('');

  // Estados UI
  cargando = signal(false);
  errorMensaje = signal<string | null>(null);

  seleccionarRol(rol: RolUsuario): void {
    this.rolSeleccionado.set(rol);
    this.errorMensaje.set(null);
  }

  registrar(): void {
    this.cargando.set(true);
    this.errorMensaje.set(null);

    if (!this.email() || !this.password() || !this.nombreCompleto()) {
      this.errorMensaje.set('Por favor completa los campos principales de acceso.');
      this.cargando.set(false);
      return;
    }

    if (this.rolSeleccionado() === 'VECINO') {
      if (!this.dni() || this.dni().length !== 8) {
        this.errorMensaje.set('El DNI debe contener exactamente 8 dígitos numéricos.');
        this.cargando.set(false);
        return;
      }
    } else if (this.rolSeleccionado() === 'ALBERGUE') {
      if (!this.nombreAlbergue()) {
        this.errorMensaje.set('Por favor ingresa el nombre del albergue o asociación.');
        this.cargando.set(false);
        return;
      }
    } else if (this.rolSeleccionado() === 'VETERINARIA') {
      if (!this.cmvp()) {
        this.errorMensaje.set('El número de Colegiatura CMVP es obligatorio para veterinarias.');
        this.cargando.set(false);
        return;
      }
    }

    setTimeout(() => {
      const nuevoUsuario: Usuario = {
        id: 'usr-' + Date.now(),
        email: this.email(),
        nombreCompleto: this.nombreCompleto(),
        rol: this.rolSeleccionado(),
        telefono: this.telefono(),
        distrito: this.distrito(),
        dni: this.rolSeleccionado() === 'VECINO' ? this.dni() : undefined,
        nombreAlbergue: this.rolSeleccionado() === 'ALBERGUE' ? this.nombreAlbergue() : undefined,
        albergueId: this.rolSeleccionado() === 'ALBERGUE' ? resolverAlbergueId(this.nombreAlbergue()) : undefined,
        rucoRegistro: this.rolSeleccionado() === 'ALBERGUE' ? this.rucoRegistro() : undefined,
        nombreVeterinaria: this.rolSeleccionado() === 'VETERINARIA' ? this.nombreVeterinaria() : undefined,
        cmvp: this.rolSeleccionado() === 'VETERINARIA' ? this.cmvp() : undefined
      };

      this.authService.iniciarSesion(nuevoUsuario);
      this.cargando.set(false);
      this.router.navigate(['/inicio']);
    }, 400);
  }
}
