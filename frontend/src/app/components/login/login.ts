import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/auth.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent, StatusBadgeComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('vecino.huancayo@wankapets.pe');
  password = signal('Huancayo2025#');
  recordarSesion = signal(true);
  errorMensaje = signal<string | null>(null);
  cargando = signal(false);

  iniciarSesion(): void {
    this.cargando.set(true);
    this.errorMensaje.set(null);

    setTimeout(() => {
      if (!this.email() || !this.password()) {
        this.errorMensaje.set('Por favor completa todos los campos.');
        this.cargando.set(false);
        return;
      }

      const usuario: Usuario = {
        id: 'usr-' + Date.now(),
        email: this.email(),
        nombreCompleto: 'Daniel Quispe Huamán',
        rol: 'VECINO',
        telefono: '964882190',
        distrito: 'El Tambo',
        dni: '72384910'
      };

      this.authService.iniciarSesion(usuario);
      this.cargando.set(false);
      this.router.navigate(['/inicio']);
    }, 400);
  }

  iniciarConGoogle(): void {
    this.cargando.set(true);
    setTimeout(() => {
      const googleUser: Usuario = {
        id: 'usr-google',
        email: 'vecino.activo@gmail.com',
        nombreCompleto: 'Usuario Google Wanka',
        rol: 'VECINO',
        distrito: 'Huancayo Centro',
        dni: '71902345'
      };
      this.authService.iniciarSesion(googleUser);
      this.cargando.set(false);
      this.router.navigate(['/inicio']);
    }, 500);
  }
}
