export interface Albergue {
  id: string;
  nombre: string;              // "Albergue Huellitas del Mantaro"
  coordinadora: string;        // "Lic. Valeria Paucar"
  distrito: string;            // "El Tambo, Huancayo"
  direccion: string;           // "Jr. Los Sauces 340 (a 4 cuadras del Parque Bolognesi)"
  registroMunicipal: string;   // "Reg. Municipal #2023-ALB"
  anioFundacion: string;       // "2021"
  mision: string;              // "Dedicado al rescate, rehabilitación física y reinserción..."
  animalesAlbergados: number;  // 42
  limiteCapacidad: number;     // 45
  porcentajeOcupacion: number; // 93
  telefonoWhatsapp: string;
  enlaceMapa: string;
  metodosDonacion: {
    yapePlin: string;
    bcpCuenta: string;
    bcpCci: string;
    contactoAlimentos: string;
  };
}
