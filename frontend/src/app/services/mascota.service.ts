import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import {
  EstadoMascota,
  Mascota,
  MascotaFormulario
} from '../interfaces/mascota.interface';
import { SolicitudAdopcion } from '../interfaces/adopcion.interface';
import { resolverAlbergueId } from '../shared/utils/albergue';

const CLAVE_ALMACENAMIENTO = 'wankapets.mascotas.v1';

const MASCOTAS_INICIALES: Mascota[] = [
  {
    id: 'mascota-chaski',
    nombre: 'Chaski',
    especie: 'Perro',
    raza: 'Mestizo Andino',
    genero: 'Macho',
    edadAprox: '1 año 8 meses',
    tamano: 'Mediano',
    microchip: 'PE-HYO-8821',
    estado: 'Listo para Adopción Inmediata',
    distrito: 'El Tambo',
    descripcion: 'Chaski fue rescatado cerca de la estación del tren en Chilca. Es muy juguetón, leal y tiene una energía noble. Le encanta correr en campos abiertos y convive armoniosamente con niños y otros perros.',
    evaluacionConductual: 'Evaluación conductual superada con honores. Nivel de reactividad: Muy bajo. Sociable con personas y animales.',
    vacunasAlDia: true,
    esterilizado: true,
    desparasitado: true,
    imagenUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=900',
    tiempoEnAdopcion: 'En adopción desde Feb 2024',
    codigoAdopcion: '#ADOP-2024-088',
    albergueId: 'alb-1',
    nombreAlbergue: 'Albergue Huellitas del Mantaro',
    coordinadorAlbergue: 'Lic. Valeria Paucarchuco',
    direccionAlbergue: 'Jr. Los Sauces 340, El Tambo • Huancayo',
    telefonoAlbergue: '964123456',
    horarioVisitas: 'Mar - Dom, 10am - 4pm',
    referenciaAlbergue: 'A 4 cuadras del Parque Bolognesi',
    creadoPor: 'usr-1'
  },
  {
    id: 'mascota-munay',
    nombre: 'Munay',
    especie: 'Gato',
    raza: 'Criollo Pelicorto',
    genero: 'Hembra',
    edadAprox: '1 año',
    tamano: 'Pequeño',
    microchip: 'PE-HYO-9014',
    estado: 'Listo para Adopción Inmediata',
    distrito: 'Huancayo Centro',
    descripcion: 'Munay es una gatita tranquila, cariñosa y muy limpia. Ronronea con solo escuchar tu voz y está acostumbrada a vivir en departamento.',
    evaluacionConductual: 'Muy dócil, adaptada al rascador y arenero cerrado.',
    vacunasAlDia: true,
    esterilizado: true,
    desparasitado: true,
    imagenUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=900',
    tiempoEnAdopcion: 'En adopción desde Mar 2024',
    codigoAdopcion: '#ADOP-2024-102',
    albergueId: 'alb-1',
    nombreAlbergue: 'Albergue Huellitas del Mantaro',
    coordinadorAlbergue: 'Lic. Valeria Paucarchuco',
    direccionAlbergue: 'Jr. Los Sauces 340, El Tambo • Huancayo',
    telefonoAlbergue: '964123456',
    horarioVisitas: 'Mar - Dom, 10am - 4pm',
    referenciaAlbergue: 'A 4 cuadras del Parque Bolognesi'
  },
  {
    id: 'mascota-kusi',
    nombre: 'Kusi',
    especie: 'Perro',
    raza: 'Mestizo Labrador',
    genero: 'Hembra',
    edadAprox: '2 años',
    tamano: 'Grande',
    microchip: 'PE-HYO-7732',
    estado: 'Hogar Temporal Urgente',
    distrito: 'Chilca',
    descripcion: 'Kusi requiere un hogar temporal urgente mientras culmina su tratamiento cutáneo ya casi resuelto. Es una perrita sumamente agradecida y noble.',
    evaluacionConductual: 'Sociable, camina perfecto con correa.',
    vacunasAlDia: true,
    esterilizado: true,
    desparasitado: true,
    imagenUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=900',
    tiempoEnAdopcion: 'En urgencia desde Mayo 2024',
    codigoAdopcion: '#ADOP-2024-115',
    albergueId: 'alb-2',
    nombreAlbergue: 'Refugio Amigos de 4 Patas Chilca',
    coordinadorAlbergue: 'Dra. Carmen Huamán',
    direccionAlbergue: 'Av. Huancavelica 1420, Chilca',
    telefonoAlbergue: '954789012',
    horarioVisitas: 'Lun - Sáb, 9am - 3pm',
    referenciaAlbergue: 'Cerca a la Plaza Huamanmarca'
  },
  {
    id: 'mascota-inti',
    nombre: 'Inti',
    especie: 'Perro',
    raza: 'Pastor Andino Mestizo',
    genero: 'Macho',
    edadAprox: '8 meses',
    tamano: 'Mediano',
    microchip: 'PE-HYO-6541',
    estado: 'Listo para Adopción Inmediata',
    distrito: 'Pilcomayo',
    descripcion: 'Inti es un cachorro lleno de alegría. Aprende trucos con mucha rapidez y le encanta salir a trotar por las orillas del río Mantaro.',
    evaluacionConductual: 'Cachorro activo con excelente respuesta a estímulos positivos.',
    vacunasAlDia: true,
    esterilizado: false,
    desparasitado: true,
    imagenUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=900',
    tiempoEnAdopcion: 'En adopción desde Abr 2024',
    codigoAdopcion: '#ADOP-2024-121',
    albergueId: 'alb-1',
    nombreAlbergue: 'Albergue Huellitas del Mantaro',
    coordinadorAlbergue: 'Lic. Valeria Paucarchuco',
    direccionAlbergue: 'Jr. Los Sauces 340, El Tambo • Huancayo',
    telefonoAlbergue: '964123456',
    horarioVisitas: 'Mar - Dom, 10am - 4pm',
    referenciaAlbergue: 'A 4 cuadras del Parque Bolognesi'
  }
];

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/mascotas';

  // Se activa a true cuando el backend de adopciones esté disponible.
  private readonly usarBackend = false;

  private readonly _mascotas = signal<Mascota[]>([...MASCOTAS_INICIALES]);

  public readonly mascotas = this._mascotas.asReadonly();
  public readonly cargando = signal(false);
  public readonly error = signal<string | null>(null);

  constructor() {
    // El catálogo prerenderizado usa las mascotas semilla. Las guardadas en
    // localStorage se restauran después de la hidratación, en el navegador.
    afterNextRender(() => this._mascotas.set(this.cargarMascotas()));
  }

  public readonly activas = computed(() => this._mascotas().filter(m => m.estado !== 'Adoptado'));
  public readonly adoptadas = computed(() => this._mascotas().filter(m => m.estado === 'Adoptado'));

  // Filtros reactivos con Signals
  public filtroEspecie = signal<string>('TODOS');
  public filtroDistrito = signal<string>('TODOS');
  public busquedaTexto = signal<string>('');

  public readonly mascotasFiltradas = computed(() => {
    const lista = this.activas();
    const esp = this.filtroEspecie();
    const dist = this.filtroDistrito();
    const txt = this.busquedaTexto().toLowerCase().trim();

    return lista.filter(m => {
      const cumpleEspecie = esp === 'TODOS' || m.especie.toUpperCase() === esp.toUpperCase();
      const cumpleDistrito = dist === 'TODOS' || m.distrito.toUpperCase() === dist.toUpperCase();
      const cumpleTexto = !txt ||
        m.nombre.toLowerCase().includes(txt) ||
        m.descripcion.toLowerCase().includes(txt) ||
        m.distrito.toLowerCase().includes(txt) ||
        m.microchip.toLowerCase().includes(txt);

      return cumpleEspecie && cumpleDistrito && cumpleTexto;
    });
  });

  // Solicitudes registradas
  private readonly _solicitudes = signal<SolicitudAdopcion[]>([]);
  public readonly solicitudes = this._solicitudes.asReadonly();

  listar(): Observable<Mascota[]> {
    this.error.set(null);

    if (!this.usarBackend) {
      return of([...this._mascotas()]);
    }

    this.cargando.set(true);
    return this.http.get<Mascota[]>(this.apiUrl).pipe(
      tap(mascotas => this._mascotas.set(mascotas)),
      catchError(() => {
        this.error.set('No se pudo cargar el catálogo desde el servidor.');
        return of([...this._mascotas()]);
      }),
      finalize(() => this.cargando.set(false))
    );
  }

  crear(formulario: MascotaFormulario, archivo?: File): Observable<Mascota> {
    this.error.set(null);

    if (!this.usarBackend) {
      const ahora = Date.now();
      const creada: Mascota = {
        ...formulario,
        id: `mascota-${ahora}`,
        microchip: `PE-HYO-${String(ahora).slice(-4)}`,
        estado: 'Listo para Adopción Inmediata',
        tiempoEnAdopcion: 'Desde hoy',
        codigoAdopcion: `#ADOP-${new Date().getFullYear()}-${String(ahora).slice(-4)}`,
        albergueId: formulario.albergueId ?? resolverAlbergueId(formulario.nombreAlbergue),
        imagenUrl: formulario.imagenUrl || '/rocky_el_tambo.jpg'
      };
      return this.aplicarLocal(mascotas => [creada, ...mascotas], creada);
    }

    return this.http.post<Mascota>(this.apiUrl, this.aFormData(formulario, archivo)).pipe(
      tap(creada => this._mascotas.update(mascotas => [creada, ...mascotas])),
      catchError(() => {
        this.error.set('No se pudo registrar la mascota. Inténtalo nuevamente.');
        return throwError(() => new Error('Error al crear mascota'));
      })
    );
  }

  actualizar(id: string, formulario: MascotaFormulario): Observable<Mascota> {
    const actual = this.obtenerMascotaPorId(id);
    if (!actual) {
      return throwError(() => new Error('Mascota no encontrada'));
    }

    const actualizada: Mascota = { ...actual, ...formulario };

    if (!this.usarBackend) {
      return this.aplicarLocal(
        mascotas => mascotas.map(m => m.id === id ? actualizada : m),
        actualizada
      );
    }

    return this.http.patch<Mascota>(`${this.apiUrl}/${id}`, this.aFormData(formulario)).pipe(
      tap(mascota => this._mascotas.update(mascotas => mascotas.map(m => m.id === id ? mascota : m))),
      catchError(() => {
        this.error.set('No se pudo actualizar la ficha.');
        return throwError(() => new Error('Error al actualizar mascota'));
      })
    );
  }

  marcarAdoptada(id: string): Observable<Mascota> {
    return this.cambiarEstado(id, 'Adoptado', new Date().toISOString());
  }

  restaurar(id: string): Observable<Mascota> {
    return this.cambiarEstado(id, 'Listo para Adopción Inmediata');
  }

  eliminar(id: string): Observable<void> {
    this.error.set(null);

    if (!this.usarBackend) {
      return this.aplicarLocal(mascotas => mascotas.filter(m => m.id !== id), undefined);
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this._mascotas.update(mascotas => mascotas.filter(m => m.id !== id))),
      catchError(() => {
        this.error.set('No se pudo eliminar la ficha.');
        return throwError(() => new Error('Error al eliminar mascota'));
      })
    );
  }

  obtenerMascotaPorId(id: string): Mascota | undefined {
    return this._mascotas().find(m => m.id === id);
  }

  registrarSolicitud(solicitud: SolicitudAdopcion): void {
    this._solicitudes.update(prev => [solicitud, ...prev]);
  }

  private cambiarEstado(id: string, estado: EstadoMascota, fechaAdopcion?: string): Observable<Mascota> {
    const actual = this.obtenerMascotaPorId(id);
    if (!actual) {
      return throwError(() => new Error('Mascota no encontrada'));
    }

    const actualizada: Mascota = {
      ...actual,
      estado,
      fechaAdopcion: fechaAdopcion ?? undefined
    };

    if (!this.usarBackend) {
      return this.aplicarLocal(
        mascotas => mascotas.map(m => m.id === id ? actualizada : m),
        actualizada
      );
    }

    const cuerpo = { estado, fechaAdopcion: fechaAdopcion ?? null };
    return this.http.patch<Mascota>(`${this.apiUrl}/${id}`, cuerpo).pipe(
      tap(mascota => this._mascotas.update(mascotas => mascotas.map(m => m.id === id ? mascota : m))),
      catchError(() => {
        this.error.set('No se pudo cambiar el estado de la mascota.');
        return throwError(() => new Error('Error al cambiar estado'));
      })
    );
  }

  private aplicarLocal<T>(
    transformar: (mascotas: Mascota[]) => Mascota[],
    resultado: T
  ): Observable<T> {
    const actualizadas = transformar(this._mascotas());
    this._mascotas.set(actualizadas);
    this.guardarMascotas(actualizadas);
    return of(resultado);
  }

  private cargarMascotas(): Mascota[] {
    if (typeof localStorage === 'undefined') return [...MASCOTAS_INICIALES];

    try {
      const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
      if (!guardado) return [...MASCOTAS_INICIALES];

      const parsed: unknown = JSON.parse(guardado);
      if (!Array.isArray(parsed)) return [...MASCOTAS_INICIALES];

      return parsed
        .filter((m): m is Record<string, unknown> => !!m && typeof m === 'object' && typeof m['id'] === 'string')
        .map(m => ({
          ...m,
          vacunasAlDia: m['vacunasAlDia'] !== false,
          esterilizado: m['esterilizado'] !== false,
          desparasitado: m['desparasitado'] !== false
        })) as unknown as Mascota[];
    } catch {
      return [...MASCOTAS_INICIALES];
    }
  }

  private guardarMascotas(mascotas: Mascota[]): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(mascotas));
    } catch {
      // Almacenamiento lleno o no disponible: la sesión sigue funcionando en memoria.
    }
  }

  private aFormData(formulario: MascotaFormulario, archivo?: File): FormData {
    const datos = new FormData();
    Object.entries(formulario).forEach(([clave, valor]) => {
      datos.append(clave, String(valor ?? ''));
    });
    if (archivo) {
      datos.append('imagen', archivo, archivo.name);
    }
    return datos;
  }
}
