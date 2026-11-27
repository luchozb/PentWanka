import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public readonly menuAbierto = signal(false);
  public readonly perfilAbierto = signal(false);

  cerrarSesion(): void {
    this.perfilAbierto.set(false);
    this.menuAbierto.set(false);
    this.authService.cerrarSesion();
  }
}
