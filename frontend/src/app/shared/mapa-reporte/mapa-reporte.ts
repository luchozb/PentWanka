import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  viewChild
} from '@angular/core';
import type * as Leaflet from 'leaflet';

const CENTRO_HUANCAYO: [number, number] = [-12.0653, -75.3407];

@Component({
  selector: 'app-mapa-reporte',
  standalone: true,
  templateUrl: './mapa-reporte.html',
  styleUrl: './mapa-reporte.css'
})
export class MapaReporteComponent {
  readonly latitud = input<number | undefined>(undefined);
  readonly longitud = input<number | undefined>(undefined);
  readonly distrito = input('');
  readonly soloLectura = input(false);
  readonly radioKm = input(2);
  readonly altura = input(300);

  readonly ubicacionSeleccionada = output<{ latitud: number; longitud: number }>();

  private readonly lienzo = viewChild<ElementRef<HTMLElement>>('lienzo');
  private readonly destroyRef = inject(DestroyRef);
  private mapa: Leaflet.Map | null = null;
  private capa: Leaflet.LayerGroup | null = null;
  private leaflet: typeof Leaflet | null = null;

  constructor() {
    afterNextRender(() => this.inicializar());

    effect(() => {
      const lat = this.latitud();
      const lng = this.longitud();
      if (this.mapa && this.leaflet && lat != null && lng != null) {
        this.dibujar(lat, lng);
        this.mapa.setView([lat, lng], 14);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.mapa?.remove();
      this.mapa = null;
    });
  }

  private inicializar(): void {
    const L = (globalThis as unknown as { L: typeof Leaflet }).L;
    if (!L) return;

    const elemento = this.lienzo()?.nativeElement;
    if (!elemento) return;

    this.leaflet = L;
    const mapa = L.map(elemento, {
      center: CENTRO_HUANCAYO,
      zoom: 12,
      scrollWheelZoom: !this.soloLectura()
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapa);

    this.capa = L.layerGroup().addTo(mapa);

    if (!this.soloLectura()) {
      mapa.on('click', evento => {
        this.ubicacionSeleccionada.emit({
          latitud: evento.latlng.lat,
          longitud: evento.latlng.lng
        });
      });
    }

    this.mapa = mapa;

    const lat = this.latitud();
    const lng = this.longitud();
    if (lat != null && lng != null) {
      this.dibujar(lat, lng);
      mapa.setView([lat, lng], 14);
    }
  }

  private dibujar(latitud: number, longitud: number): void {
    if (!this.leaflet || !this.capa) return;

    const L = this.leaflet;
    const acento = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || 'teal';
    this.capa.clearLayers();

    L.circle([latitud, longitud], {
      radius: this.radioKm() * 1000,
      color: acento,
      weight: 2,
      fillColor: acento,
      fillOpacity: 0.08
    }).addTo(this.capa);

    L.circleMarker([latitud, longitud], {
      radius: 9,
      color: acento,
      weight: 3,
      fillColor: acento,
      fillOpacity: 0.35
    }).addTo(this.capa);
  }
}
