export type EspecieMascota = 'Perro' | 'Gato' | 'Otro';
export type EstadoMascota = 'Listo para Adopción Inmediata' | 'Hogar Temporal Urgente' | 'En Tratamiento' | 'Adoptado';

export interface Mascota {
  id: string;
  nombre: string;              // ej: "Chaski"
  especie: EspecieMascota;      // Perro, Gato
  raza: string;                // ej: "Mestizo Andino"
  genero: 'Macho' | 'Hembra';
  edadAprox: string;           // ej: "1 año 8 meses"
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  microchip: string;           // ej: "PE-HYO-8821"
  estado: EstadoMascota;
  distrito: string;            // El Tambo, Huancayo Centro, Chilca, Pilcomayo
  descripcion: string;
  evaluacionConductual: string;// ej: "Superada con éxito: sociable con niños y otros canes..."
  vacunasAlDia: boolean;
  esterilizado: boolean;
  desparasitado: boolean;
  imagenUrl: string;
  tiempoEnAdopcion: string;    // ej: "Desde Feb 2024"
  codigoAdopcion: string;      // ej: "#ADOP-2024-088"
  
  // Custodio Oficial (Albergue)
  albergueId: string;
  nombreAlbergue: string;      // "Albergue Huellitas del Mantaro"
  coordinadorAlbergue: string; // "Lic. Valeria Paucarchuco"
  direccionAlbergue: string;   // "Jr. Los Sauces 340, El Tambo • Huancayo"
  telefonoAlbergue: string;    // "964123456"
  horarioVisitas: string;      // "Mar - Dom, 10am - 4pm"
  referenciaAlbergue: string;  // "A 4 cuadras del Parque Bolognesi"
  fechaAdopcion?: string;
  creadoPor?: string;
}

export interface MascotaFormulario {
  nombre: string;
  especie: EspecieMascota;
  raza: string;
  genero: 'Macho' | 'Hembra';
  edadAprox: string;
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  distrito: string;
  descripcion: string;
  evaluacionConductual: string;
  vacunasAlDia: boolean;
  esterilizado: boolean;
  desparasitado: boolean;
  imagenUrl: string;
  albergueId?: string;
  nombreAlbergue: string;
  coordinadorAlbergue: string;
  direccionAlbergue: string;
  telefonoAlbergue: string;
  horarioVisitas: string;
  referenciaAlbergue: string;
  creadoPor?: string;
}
