export type TipoReporte = 'PERDIDA' | 'HALLAZGO' | 'HOGAR_TEMPORAL_URGENTE';

export interface ReporteEmergencia {
  id: string;
  tipo: TipoReporte;
  nombreMascota?: string;
  especie: 'Perro' | 'Gato' | 'Otro';
  genero?: 'Macho' | 'Hembra';
  rasgosDistintivos: string;
  colorPrincipal: string;
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  llevaCollar: boolean;
  distrito: string;            // Huancayo, El Tambo, Chilca, Pilcomayo
  direccionOReferencia: string;
  fechaSuceso: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto?: string;
  mantenerNumeroVisible: boolean;
  latitud?: number;
  longitud?: number;
  imagenUrl?: string;
  fechaCreacion: string;
  creadoEn?: number;
  activo: boolean;
  creadoPor?: string;
  albergueId?: string;
}
