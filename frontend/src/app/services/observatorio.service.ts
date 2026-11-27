import { Injectable, computed, signal } from '@angular/core';

export interface DistritoObservatorio {
  readonly id: string;
  readonly nombre: string;
  readonly porcentaje: number;
  readonly casos: number;
  readonly zonas: string;
  readonly cobertura: string;
  readonly tono: 'accent' | 'urgent' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ObservatorioService {
  private readonly _distritos = signal<readonly DistritoObservatorio[]>([
    {
      id: 'el-tambo',
      nombre: 'El Tambo',
      porcentaje: 48,
      casos: 682,
      zonas: 'Parque Bolognesi, Ciudad Universitaria, Pio Pata, Julio Sumar.',
      cobertura: 'Cobertura activa con 8 veterinarias aliadas',
      tono: 'accent'
    },
    {
      id: 'chilca',
      nombre: 'Chilca',
      porcentaje: 32,
      casos: 454,
      zonas: 'Azapampa, Auray, Cuartel 9, Parque Los Héroes.',
      cobertura: 'Enlace con 2 refugios comunales y triaje',
      tono: 'urgent'
    },
    {
      id: 'huancayo-centro',
      nombre: 'Huancayo Centro',
      porcentaje: 20,
      casos: 284,
      zonas: 'Plaza Huamanmarca, Cajas Chico, Ocopilla, Torre Torre.',
      cobertura: 'Campañas de rescate y esterilización continua',
      tono: 'warning'
    }
  ]);

  readonly distritos = this._distritos.asReadonly();
  readonly totalCasos = computed(() => this._distritos().reduce((total, d) => total + d.casos, 0));
}
