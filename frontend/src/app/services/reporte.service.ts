import { Injectable, afterNextRender, signal } from '@angular/core';
import { ReporteEmergencia } from '../interfaces/reporte.interface';

const CLAVE_ALMACENAMIENTO = 'wankapets.reportes.v1';

const REPORTES_INICIALES: ReporteEmergencia[] = [
  {
    id: 'rep-rocky',
    tipo: 'PERDIDA',
    nombreMascota: 'ROCKY',
    especie: 'Perro',
    genero: 'Macho',
    rasgosDistintivos: 'Collar rojo de lona con placa sin número. Mancha blanca en el pecho en forma de diamante. Cojera leve al trotar.',
    colorPrincipal: 'Mestizo pelaje caramelo',
    tamano: 'Mediano',
    llevaCollar: true,
    distrito: 'Chilca',
    direccionOReferencia: 'Visto por última vez cerca al Mercado Mayorista (Chilca)',
    fechaSuceso: 'Ayer, 17:00 hrs',
    nombreContacto: 'Carlos Mendoza',
    telefonoContacto: '964 882 119',
    emailContacto: 'carlos.mendoza.wanka@gmail.com',
    mantenerNumeroVisible: true,
    latitud: -12.0445,
    longitud: -75.2955,
    imagenUrl: '/rocky_el_tambo.jpg',
    fechaCreacion: '26/05/2024',
    activo: true,
    creadoPor: 'usr-1',
    albergueId: 'alb-1'
  },
  {
    id: 'rep-1',
    tipo: 'PERDIDA',
    nombreMascota: 'Bobby',
    especie: 'Perro',
    rasgosDistintivos: 'Orejas caídas, mancha blanca en forma de estrella en el pecho.',
    colorPrincipal: 'Caramelo con blanco',
    tamano: 'Mediano',
    llevaCollar: true,
    distrito: 'El Tambo',
    direccionOReferencia: 'Visto por última vez en Parque Bolognesi a las 5:00 PM',
    fechaSuceso: 'Ayer',
    nombreContacto: 'Sofía Romero',
    telefonoContacto: '954321987',
    mantenerNumeroVisible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=800',
    fechaCreacion: '25/05/2024',
    activo: true
  },
  {
    id: 'rep-2',
    tipo: 'HALLAZGO',
    especie: 'Perro',
    rasgosDistintivos: 'Cachorrón muy desorientado pero dócil, lleva collar rojo sin placa.',
    colorPrincipal: 'Negro con patas cafés',
    tamano: 'Pequeño',
    llevaCollar: true,
    distrito: 'Chilca',
    direccionOReferencia: 'Encontrado en Jr. Áncash c/ Av. Huancavelica',
    fechaSuceso: 'Hoy por la mañana',
    nombreContacto: 'Carlos Méndez',
    telefonoContacto: '964112233',
    mantenerNumeroVisible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=800',
    fechaCreacion: '26/05/2024',
    activo: true
  },
  {
    id: 'rep-3',
    tipo: 'HOGAR_TEMPORAL_URGENTE',
    nombreMascota: 'Pelusa',
    especie: 'Gato',
    rasgosDistintivos: 'Gatita rescatada de una acequia, necesita cobijo por 10 días.',
    colorPrincipal: 'Atigrada gris',
    tamano: 'Pequeño',
    llevaCollar: false,
    distrito: 'Huancayo Centro',
    direccionOReferencia: 'Plaza Huamanmarca',
    fechaSuceso: 'Hace 2 días',
    nombreContacto: 'Red Animalista Junín',
    telefonoContacto: '964998877',
    mantenerNumeroVisible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
    fechaCreacion: '24/05/2024',
    activo: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly _reportes = signal<ReporteEmergencia[]>([...REPORTES_INICIALES]);

  public reportes = this._reportes.asReadonly();

  constructor() {
    // SSR/prerender usa siempre los reportes semilla; el navegador restaura
    // los guardados después de la hidratación.
    afterNextRender(() => this._reportes.set(this.cargarReportes()));
  }

  agregarReporte(nuevo: Omit<ReporteEmergencia, 'id' | 'fechaCreacion' | 'creadoEn' | 'activo'>): ReporteEmergencia {
    const id = `rep-${Date.now()}`;
    const fechaCreacion = new Date().toLocaleDateString('es-PE');
    const creado: ReporteEmergencia = {
      ...nuevo,
      id,
      fechaCreacion,
      creadoEn: Date.now(),
      activo: true
    };

    const actualizados = [creado, ...this._reportes()];
    this._reportes.set(actualizados);
    this.guardarReportes(actualizados);
    return creado;
  }

  desactivarReporte(id: string): void {
    const actualizados = this._reportes().map(r =>
      r.id === id ? { ...r, activo: false } : r
    );
    this._reportes.set(actualizados);
    this.guardarReportes(actualizados);
  }

  reactivarReporte(id: string): void {
    const actualizados = this._reportes().map(r =>
      r.id === id ? { ...r, activo: true } : r
    );
    this._reportes.set(actualizados);
    this.guardarReportes(actualizados);
  }

  obtenerReportePorId(id: string): ReporteEmergencia | undefined {
    return this._reportes().find(r => r.id === id);
  }

  private cargarReportes(): ReporteEmergencia[] {
    if (typeof localStorage === 'undefined') return [...REPORTES_INICIALES];

    try {
      const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
      if (!guardado) return [...REPORTES_INICIALES];

      const parsed: unknown = JSON.parse(guardado);
      if (!Array.isArray(parsed)) return [...REPORTES_INICIALES];

      return parsed
        .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object' && typeof r['id'] === 'string')
        .map(r => ({
          ...r,
          mantenerNumeroVisible: r['mantenerNumeroVisible'] !== false,
          activo: r['activo'] !== false
        })) as unknown as ReporteEmergencia[];
    } catch {
      return [...REPORTES_INICIALES];
    }
  }

  private guardarReportes(reportes: ReporteEmergencia[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(reportes));
    } catch {
      // Si se excede la cuota (fotos grandes), se mantiene el estado en memoria.
    }
  }
}
