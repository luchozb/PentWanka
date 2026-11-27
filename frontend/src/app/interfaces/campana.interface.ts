export interface CampanaVeterinaria {
  id: string;
  titulo: string;              // "Gran Jornada Masiva de Esterilización Canina y Felina a Costo Social"
  tipo: 'Esterilización Quirúrgica' | 'Vacunación Antirrábica' | 'Desparasitación Masiva';
  fecha: string;               // "25 MAYO 2024"
  diaSemana: string;           // "SÁBADO"
  horario: string;             // "8:00 AM - 3:00 PM"
  distrito: string;            // "El Tambo"
  lugar: string;               // "Loza Deportiva Cáceres, El Tambo, Huancayo"
  organizador: string;         // "Red de Veterinarias de Junín & Albergue Huellitas del Mantaro"
  costoSocial: string;         // "S/. 35.00 (Incluye analgésico y cono isabelino)"
  requisitos: string[];        // ["Ayuno de 8 horas", "Manta abrigadora", "Bozal preventivo en caso reactivo"]
  respaldoCMVP: string;        // "Procedimientos realizados por médicos colegiados CMVP Junín"
  cuposTotales: number;
  cuposOcupados: number;
}
