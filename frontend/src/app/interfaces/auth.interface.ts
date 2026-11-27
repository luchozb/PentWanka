export type RolUsuario = 'VECINO' | 'ALBERGUE' | 'VETERINARIA';

export interface Usuario {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: RolUsuario;
  telefono?: string;
  distrito: string; // Huancayo, El Tambo, Chilca, Pilcomayo

  // Datos según rol:
  dni?: string;           // Para Vecino (8 dígitos)
  nombreAlbergue?: string; // Para Albergue
  albergueId?: string;     // alb-1 Huellitas del Mantaro / alb-2 4 Patas Chilca
  rucoRegistro?: string;  // RUC o N° Registro Comunal
  nombreVeterinaria?: string; // Para Veterinaria
  cmvp?: string;          // Número de colegiatura CMVP
}

export interface SesionAuth {
  token: string;
  usuario: Usuario;
}
