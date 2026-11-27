import { Injectable, signal, computed, inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../interfaces/auth.interface';

const CLAVE_USUARIO = 'wankapets_user';
const CLAVE_SESION_CERRADA = 'wankapets_sesion_cerrada';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signal del usuario en sesión
  private _usuarioActual = signal<Usuario | null>(null);
  public usuarioActual = this._usuarioActual.asReadonly();

  // Signals computados
  public estaAutenticado = computed(() => this._usuarioActual() !== null);
  public esVecino = computed(() => this._usuarioActual()?.rol === 'VECINO');
  public esAlbergue = computed(() => this._usuarioActual()?.rol === 'ALBERGUE');
  public esVeterinaria = computed(() => this._usuarioActual()?.rol === 'VETERINARIA');

  constructor() {
    // La sesión se restaura después de la hidratación para que SSR y navegador
    // rendericen el mismo estado inicial.
    afterNextRender(() => this.restaurarSesion());
  }

  private restaurarSesion(): void {
    const stored = localStorage.getItem(CLAVE_USUARIO);
    if (stored) {
      try {
        const usuario = JSON.parse(stored) as Usuario | null;
        if (usuario) {
          this._usuarioActual.set(usuario);
          return;
        }
      } catch {
        // Sesión corrupta: se descarta y se aplica la lógica demo.
      }
    }

    const sesionCerrada = localStorage.getItem(CLAVE_SESION_CERRADA) === '1';
    if (sesionCerrada) return;

    const demoUser: Usuario = {
      id: 'usr-1',
      email: 'vecino.huancayo@wankapets.pe',
      nombreCompleto: 'Daniel Quispe Huamán',
      rol: 'VECINO',
      telefono: '964882190',
      distrito: 'El Tambo',
      dni: '72384910'
    };
    this._usuarioActual.set(demoUser);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(demoUser));
  }

  iniciarSesion(usuario: Usuario): void {
    this._usuarioActual.set(usuario);
    if (this.isBrowser) {
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
      localStorage.removeItem(CLAVE_SESION_CERRADA);
    }
  }

  cerrarSesion(): void {
    this._usuarioActual.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(CLAVE_USUARIO);
      localStorage.setItem(CLAVE_SESION_CERRADA, '1');
    }
  }

}
