export interface SolicitudAdopcion {
  codigoSeguimiento: string;   // ej: "#ADOP-2024-088"
  mascotaId: string;
  nombreMascota: string;
  postulanteNombre: string;
  postulanteDni: string;
  postulanteTelefono: string;
  postulanteDistrito: string;
  tipoVivienda: 'Casa propia' | 'Departamento' | 'Alquilada (con permiso)';
  tieneOtrasMascotas: boolean;
  experienciaPrevia: string;
  motivoAdopcion: string;
  fechaRegistro: string;
  estado: 'En Revisión Oficial' | 'Aprobada' | 'En Custodia';
}
