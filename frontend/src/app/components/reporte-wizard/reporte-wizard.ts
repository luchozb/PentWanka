import { Component, signal, computed, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { MascotaService } from '../../services/mascota.service';
import { AuthService } from '../../services/auth.service';
import { TipoReporte } from '../../interfaces/reporte.interface';
import { MascotaFormulario } from '../../interfaces/mascota.interface';
import { PageHeaderComponent } from '../../shared/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';
import { FilterPillsComponent, type FilterOption } from '../../shared/filter-pills/filter-pills';
import { ProgressTrackComponent } from '../../shared/progress-track/progress-track';
import { DialogComponent } from '../../shared/dialog/dialog';
import { MapaReporteComponent } from '../../shared/mapa-reporte/mapa-reporte';
import { resolverAlbergueId } from '../../shared/utils/albergue';
import * as QRCodeModule from 'qrcode-generator';
import { map } from 'rxjs';

type GeneradorQr = (tipo: 0, correccion: 'M') => {
  addData(data: string): void;
  make(): void;
  getModuleCount(): number;
  createDataURL(cellSize?: number, margin?: number): string;
};

const crearGeneradorQr: GeneradorQr =
  (QRCodeModule as unknown as { default?: GeneradorQr }).default ??
  (QRCodeModule as unknown as GeneradorQr);

type MotivoPublicacion = TipoReporte | 'ADOPCION';

@Component({
  selector: 'app-reporte-wizard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    StatusBadgeComponent,
    FilterPillsComponent,
    ProgressTrackComponent,
    DialogComponent,
    MapaReporteComponent
  ],
  templateUrl: './reporte-wizard.html',
  styleUrl: './reporte-wizard.css'
})
export class ReporteWizardComponent {
  private reporteService = inject(ReporteService);
  private mascotaService = inject(MascotaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private albergueIdActual(): string | undefined {
    const usuario = this.authService.usuarioActual();
    if (usuario?.rol !== 'ALBERGUE') return undefined;
    return usuario.albergueId ?? resolverAlbergueId(usuario.nombreAlbergue);
  }

  // Paso actual (1 a 4). El wizard es navegable libremente desde el stepper.
  pasoActual = signal<number>(1);

  // Paso 1: Situación. "ADOPCION" publica en el catálogo, no en la red de alerta.
  tipoReporte = signal<MotivoPublicacion>('PERDIDA');
  fechaSuceso = signal('Hoy, 14:30 hrs');

  // Paso 2: Rasgos y Datos (valores por defecto de Rocky como en Figma 107:4618)
  nombreMascota = signal('ROCKY');
  especie = signal<'Perro' | 'Gato' | 'Otro'>('Perro');
  colorPrincipal = signal('Mestizo pelaje caramelo');
  tamano = signal<'Pequeño' | 'Mediano' | 'Grande'>('Mediano');
  genero = signal<'Macho' | 'Hembra'>('Macho');
  llevaCollar = signal(true);
  rasgosDistintivos = signal('Collar rojo de lona con placa sin número. Mancha blanca en el pecho en forma de diamante. Cojera leve al trotar.');

  // Paso 3: Ubicación y Foto
  distrito = signal('El Tambo');
  direccionOReferencia = signal('Visto por última vez en Calle Real cdra 8, cerca al Parque Huamanmarca.');
  fotoUrl = signal('/rocky_el_tambo.jpg');
  fotoNombre = signal('rocky_el_tambo.jpg');
  latitud = signal<number | undefined>(undefined);
  longitud = signal<number | undefined>(undefined);

  // Paso 4: Contacto Directo
  nombreContacto = signal('Carlos Mendoza');
  telefonoContacto = signal('964 882 119');
  emailContacto = signal('carlos.mendoza.wanka@gmail.com');
  mantenerNumeroVisible = signal(true);

  // Paso 4 alternativo: datos del tutor / albergue cuando se publica en adopción
  nombreAlbergue = signal('Albergue Huellitas del Mantaro');
  coordinadorAlbergue = signal('Carlos Mendoza');
  direccionAlbergue = signal('Jr. Los Sauces 340, El Tambo • Huancayo');
  telefonoAlbergue = signal('964 882 119');
  horarioVisitas = signal('Mar - Dom, 10am - 4pm');
  referenciaAlbergue = signal('A 4 cuadras del Parque Bolognesi');
  razaAdopcion = signal('Mestizo Andino');
  edadAdopcion = signal('1 año 8 meses');
  descripcionAdopcion = signal('Mestizo andino rescatado en El Tambo. Sociable, juguetón y acostumbrado a convivir con niños y otros perros.');
  evaluacionAdopcion = signal('Evaluación conductual superada: sociable con personas y otros animales.');
  vacunasAlDia = signal(true);
  esterilizado = signal(true);
  desparasitado = signal(true);

  // Estados UI
  alertaExitosa = signal(false);
  errorMensaje = signal<string | null>(null);
  qrUrl = signal('');
  ultimoReporteId = signal('');
  ultimaMascotaId = signal('');

  readonly esAdopcion = computed(() => this.tipoReporte() === 'ADOPCION');

  private readonly modoParam = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('modo'))),
    { initialValue: null }
  );

  constructor() {
    // Reactivo: funciona también si el usuario ya estaba en /reportes/nuevo y
    // hace clic en "Publicar en adopción" (Angular reutiliza el componente).
    effect(() => {
      if (this.modoParam() === 'adopcion') {
        this.tipoReporte.set('ADOPCION');
      }
    });
  }

  // Distritos disponibles (Figma)
  distritosDisponibles = ['El Tambo', 'Chilca', 'Huancayo Centro', 'San Jerónimo'];

  // Selectores del wizard (mismos valores, ahora con app-filter-pills)
  opcionesTipo: FilterOption[] = [
    { label: 'PÉRDIDA', value: 'PERDIDA' },
    { label: 'HALLAZGO', value: 'HALLAZGO' },
    { label: 'HOGAR TEMPORAL', value: 'HOGAR_TEMPORAL_URGENTE' },
    { label: 'DAR EN ADOPCIÓN', value: 'ADOPCION' }
  ];

  opcionesEspecie: FilterOption[] = [
    { label: 'Perro', value: 'Perro' },
    { label: 'Gato', value: 'Gato' },
    { label: 'Otro', value: 'Otro' }
  ];

  opcionesDistrito: FilterOption[] = this.distritosDisponibles.map(dist => ({ label: dist, value: dist }));

  // Progreso del wizard: porcentajes originales 12 / 40 / 72 / 100
  progresoWizard = computed(() => {
    switch (this.pasoActual()) {
      case 1: return 12;
      case 2: return 40;
      case 3: return 72;
      default: return 100;
    }
  });

  tonoProgreso = computed<'urgent' | 'warning' | 'accent'>(() => {
    switch (this.tipoReporte()) {
      case 'PERDIDA': return 'urgent';
      case 'HOGAR_TEMPORAL_URGENTE': return 'warning';
      default: return 'accent';
    }
  });

  // Afiche en tiempo real computado según caso (Figma 107:4908, 111:6477, 112:6885)
  tituloAfiche = computed(() => {
    switch (this.tipoReporte()) {
      case 'PERDIDA':
        return 'ALERTA HUANCAYO: SE BUSCA';
      case 'HALLAZGO':
        return 'ANIMAL ENCONTRADO / A SALVO';
      case 'HOGAR_TEMPORAL_URGENTE':
        return 'HOGAR TEMPORAL URGENTE';
      case 'ADOPCION':
        return 'EN ADOPCIÓN RESPONSABLE';
    }
  });

  subtituloAfiche = computed(() => {
    switch (this.tipoReporte()) {
      case 'PERDIDA':
        return 'Red Comunitaria de Búsqueda Valle del Mantaro';
      case 'HALLAZGO':
        return 'Buscando a su familia en El Tambo y Huancayo';
      case 'HOGAR_TEMPORAL_URGENTE':
        return 'Campaña Solidaria WankaPets Huancayo';
      case 'ADOPCION':
        return 'Catálogo WankaPets · Valle del Mantaro';
    }
  });

  colorAfiche = computed(() => {
    switch (this.tipoReporte()) {
      case 'PERDIDA':
        return 'var(--urgent)';
      case 'HALLAZGO':
        return 'var(--accent)';
      case 'HOGAR_TEMPORAL_URGENTE':
        return 'var(--warning)';
      case 'ADOPCION':
        return 'var(--success)';
    }
  });

  readonly tituloPagina = computed(() =>
    this.esAdopcion() ? 'Publicar Mascota en Adopción' : 'Reportar Mascota en Huancayo'
  );

  readonly descripcionPagina = computed(() =>
    this.esAdopcion()
      ? 'Publica la ficha de un animal rescatado y aparece de inmediato en “Encuentra a tu compañero ideal” del inicio.'
      : 'Tu reporte se difunde inmediatamente a más de 12 albergues aliados, comisarías, unidades de serenazgo distrital y brigadas de rescate animal en todo el Valle del Mantaro.'
  );

  readonly etiquetaProgreso = computed(() =>
    this.esAdopcion() ? 'Progreso de la publicación' : 'Progreso del reporte'
  );

  readonly etiquetaPaso4 = computed(() => (this.esAdopcion() ? 'Tutor' : 'Contacto'));

  readonly tituloPaso2 = computed(() =>
    this.esAdopcion() ? 'Datos de la mascota en adopción' : 'Rasgos y Datos de la Mascota'
  );

  readonly descripcionPaso2 = computed(() =>
    this.esAdopcion()
      ? 'Cuenta su historia con claridad: ayuda a que una familia del Valle del Mantaro decida con confianza.'
      : 'Cuanta mayor exactitud brindes, más rápido lo reconocerán en El Tambo, Chilca o Huancayo.'
  );

  readonly tituloPaso3 = computed(() =>
    this.esAdopcion() ? 'Ubicación y Fotografía' : 'Ubicación y Fotografía'
  );

  readonly descripcionPaso3 = computed(() =>
    this.esAdopcion()
      ? 'Indica dónde fue rescatada y sube la foto más clara para su ficha de adopción.'
      : 'Indica el cuadrante geográfico de Huancayo y sube la foto más clara disponible.'
  );

  readonly etiquetaMapa = computed(() =>
    this.esAdopcion() ? 'Zona de origen / punto de encuentro' : 'Perímetro de Búsqueda en el Mapa'
  );

  readonly tituloPaso4 = computed(() =>
    this.esAdopcion() ? 'Datos del Tutor o Albergue' : 'Tus Datos de Contacto Directo'
  );

  readonly descripcionPaso4 = computed(() =>
    this.esAdopcion()
      ? 'Estos datos aparecerán en la ficha para coordinar visitas y adopción responsable.'
      : 'Este número se publicará en el afiche para que quien lo vea se comunique al instante.'
  );

  readonly textoBotonPublicar = computed(() =>
    this.esAdopcion() ? 'Publicar en Adopciones' : 'Publicar y Difundir Reporte'
  );

  readonly tituloExito = computed(() =>
    this.esAdopcion() ? '¡Mascota publicada en adopción!' : '¡Alerta Difundida con Éxito!'
  );

  readonly referenciaExito = computed(() =>
    this.esAdopcion()
      ? `Ficha ${this.ultimaMascotaId()} creada`
      : `Expediente ${this.ultimoReporteId()} Emitido`
  );

  readonly textoExito = computed(() =>
    this.esAdopcion()
      ? 'La mascota ya está visible en “Encuentra a tu compañero ideal” del inicio. Las familias pueden ver su ficha y coordinar una visita.'
      : 'Tu reporte ya está activo en la red del Valle del Mantaro. Se ha notificado a veterinarias y brigadas comunitarias.'
  );

  readonly iconoExito = computed(() => (this.esAdopcion() ? 'bi-house-heart' : 'bi-broadcast'));

  readonly textoWhatsapp = computed(() =>
    this.esAdopcion()
      ? `EN ADOPCIÓN WankaPets Huancayo: ${this.nombreMascota()} en ${this.distrito()}. Contacto: ${this.telefonoAlbergue()}`
      : `ALERTA WankaPets Huancayo: Mascota ${this.nombreMascota()} extraviada en ${this.distrito()}. Contacto: ${this.telefonoContacto()}`
  );

  readonly whatsappUrl = computed(() => `https://wa.me/?text=${encodeURIComponent(this.textoWhatsapp())}`);

  seleccionarDistrito(dist: string): void {
    this.distrito.set(dist);
  }

  avanzarPaso(): void {
    this.errorMensaje.set(null);
    if (this.pasoActual() < 4) {
      this.pasoActual.update(p => p + 1);
    }
  }

  retrocederPaso(): void {
    if (this.pasoActual() > 1) {
      this.pasoActual.update(p => p - 1);
    }
  }

  irAlPaso(n: number): void {
    this.pasoActual.set(n);
  }

  seleccionarTipo(t: MotivoPublicacion): void {
    this.tipoReporte.set(t);
    this.ultimoReporteId.set('');
    this.ultimaMascotaId.set('');
    this.errorMensaje.set(null);
  }

  seleccionarTipoDesdePill(valor: string): void {
    this.seleccionarTipo(valor as MotivoPublicacion);
  }

  seleccionarEspecie(valor: string): void {
    if (valor === 'Perro' || valor === 'Gato' || valor === 'Otro') {
      this.especie.set(valor);
    }
  }

  // Manejo de carga de imagen
  async onArchivoSeleccionado(event: Event): Promise<void> {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    this.errorMensaje.set(null);

    if (!archivo.type.startsWith('image/')) {
      this.errorMensaje.set('Selecciona un archivo de imagen válido.');
      return;
    }

    if (archivo.size > 8 * 1024 * 1024) {
      this.errorMensaje.set('La imagen supera los 8 MB. Elige una foto más ligera.');
      return;
    }

    try {
      this.fotoUrl.set(await this.redimensionarImagen(archivo));
      this.fotoNombre.set(archivo.name);
    } catch {
      this.errorMensaje.set('No se pudo procesar la imagen. Intenta con otra foto.');
    }
  }

  private redimensionarImagen(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
      lector.onload = () => {
        const imagen = new Image();
        imagen.onerror = () => reject(new Error('No se pudo decodificar la imagen'));
        imagen.onload = () => {
          // Recorte central 4:3 con sesgo hacia la cara antes de escalar.
          // Así una foto panorámica o muy alta no se ve recortada de forma
          // agresiva dentro de las fichas.
          const relacion = 4 / 3;
          let sx = 0;
          let sy = 0;
          let ancho = imagen.width;
          let alto = imagen.height;

          if (ancho / alto > relacion) {
            ancho = alto * relacion;
            sx = (imagen.width - ancho) / 2;
          } else {
            alto = ancho / relacion;
            sy = (imagen.height - alto) * 0.35;
          }

          const maximo = 1200;
          const escala = Math.min(1, maximo / Math.max(ancho, alto));
          const lienzo = document.createElement('canvas');
          lienzo.width = Math.round(ancho * escala);
          lienzo.height = Math.round(alto * escala);
          const contexto = lienzo.getContext('2d');
          if (!contexto) {
            reject(new Error('Canvas no disponible'));
            return;
          }
          contexto.drawImage(imagen, sx, sy, ancho, alto, 0, 0, lienzo.width, lienzo.height);
          resolve(lienzo.toDataURL('image/jpeg', 0.82));
        };
        imagen.src = lector.result as string;
      };
      lector.readAsDataURL(archivo);
    });
  }

  seleccionarUbicacion(coordenadas: { latitud: number; longitud: number }): void {
    this.latitud.set(coordenadas.latitud);
    this.longitud.set(coordenadas.longitud);
  }

  usarFotoRespaldo(): void {
    this.fotoUrl.set('/rocky_el_tambo.jpg');
    this.fotoNombre.set('rocky_el_tambo.jpg');
  }

  alternarFotoMuestra(): void {
    if (this.fotoUrl() === '/rocky_el_tambo.jpg') {
      this.fotoUrl.set('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=900');
      this.fotoNombre.set('foto_alternativa_huancayo.jpg');
    } else {
      this.fotoUrl.set('/rocky_el_tambo.jpg');
      this.fotoNombre.set('rocky_el_tambo.jpg');
    }
  }

  finalizarReporte(): void {
    this.errorMensaje.set(null);

    if (this.esAdopcion()) {
      this.publicarAdopcion();
      return;
    }

    const creado = this.reporteService.agregarReporte({
      tipo: this.tipoReporte() as TipoReporte,
      nombreMascota: this.nombreMascota(),
      especie: this.especie(),
      genero: this.genero(),
      rasgosDistintivos: this.rasgosDistintivos(),
      colorPrincipal: this.colorPrincipal(),
      tamano: this.tamano(),
      llevaCollar: this.llevaCollar(),
      distrito: this.distrito(),
      direccionOReferencia: this.direccionOReferencia(),
      fechaSuceso: this.fechaSuceso(),
      nombreContacto: this.nombreContacto(),
      telefonoContacto: this.telefonoContacto(),
      emailContacto: this.emailContacto(),
      mantenerNumeroVisible: this.mantenerNumeroVisible(),
      latitud: this.latitud(),
      longitud: this.longitud(),
      imagenUrl: this.fotoUrl(),
      creadoPor: this.authService.usuarioActual()?.id,
      albergueId: this.albergueIdActual()
    });

    this.ultimoReporteId.set(creado.id);
    this.generarQr(creado.id);
    this.alertaExitosa.set(true);
  }

  private publicarAdopcion(): void {
    const formulario: MascotaFormulario = {
      nombre: this.nombreMascota().trim() || 'Mascota sin nombre',
      especie: this.especie(),
      raza: this.razaAdopcion().trim() || this.colorPrincipal(),
      genero: this.genero(),
      edadAprox: this.edadAdopcion().trim() || 'No especificada',
      tamano: this.tamano(),
      distrito: this.distrito(),
      descripcion: this.descripcionAdopcion().trim() || this.rasgosDistintivos(),
      evaluacionConductual: this.evaluacionAdopcion().trim() || this.rasgosDistintivos(),
      vacunasAlDia: this.vacunasAlDia(),
      esterilizado: this.esterilizado(),
      desparasitado: this.desparasitado(),
      imagenUrl: this.fotoUrl(),
      creadoPor: this.authService.usuarioActual()?.id,
      albergueId: this.albergueIdActual() ?? resolverAlbergueId(this.nombreAlbergue()),
      nombreAlbergue: this.nombreAlbergue(),
      coordinadorAlbergue: this.coordinadorAlbergue().trim() || this.nombreContacto(),
      direccionAlbergue: this.direccionAlbergue(),
      telefonoAlbergue: this.telefonoAlbergue().trim() || this.telefonoContacto(),
      horarioVisitas: this.horarioVisitas(),
      referenciaAlbergue: this.referenciaAlbergue().trim() || this.direccionOReferencia()
    };

    this.mascotaService.crear(formulario).subscribe({
      next: mascota => {
        this.ultimaMascotaId.set(mascota.id);
        this.alertaExitosa.set(true);
      },
      error: () => {
        this.errorMensaje.set('No se pudo publicar la mascota en adopción. Inténtalo nuevamente.');
      }
    });
  }

  private generarQr(id: string): void {
    try {
      const origen = typeof window !== 'undefined' ? window.location.origin : '';
      const qr = crearGeneradorQr(0, 'M');
      qr.addData(`${origen}/reportes/${id}`);
      qr.make();

      const tamanoCelda = Math.max(1, Math.floor(240 / qr.getModuleCount()));
      this.qrUrl.set(qr.createDataURL(tamanoCelda, 1));
    } catch {
      this.qrUrl.set('');
    }
  }

  irAlCatalogo(): void {
    this.alertaExitosa.set(false);
    this.router.navigate(['/inicio'], { fragment: 'adopciones' });
  }

  cerrarExito(): void {
    this.alertaExitosa.set(false);
    this.router.navigate(['/inicio']);
  }
}
