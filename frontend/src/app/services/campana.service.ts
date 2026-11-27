import { Injectable, signal } from '@angular/core';
import { CampanaVeterinaria } from '../interfaces/campana.interface';

@Injectable({
  providedIn: 'root'
})
export class CampanaService {
  private _campanas = signal<CampanaVeterinaria[]>([
    {
      id: 'camp-1',
      titulo: 'Gran Jornada Masiva de Esterilización Canina y Felina a Costo Social',
      tipo: 'Esterilización Quirúrgica',
      fecha: '25 MAYO 2024',
      diaSemana: 'SÁBADO',
      horario: '8:00 AM - 3:00 PM',
      distrito: 'El Tambo',
      lugar: 'Loza Deportiva Cáceres, El Tambo, Huancayo',
      organizador: 'Red de Veterinarias de Junín & Albergue Huellitas del Mantaro',
      costoSocial: 'S/. 35.00 (Incluye analgésico y cono isabelino)',
      requisitos: [
        'Ayuno sólido y líquido estricto de 8 horas.',
        'Llevar manta abrigadora para la fase de recuperación térmica.',
        'Bozal preventivo y correa segura si tu mascota es reactiva.'
      ],
      respaldoCMVP: 'Procedimientos realizados por médicos cirujanos colegiados CMVP Junín',
      cuposTotales: 60,
      cuposOcupados: 48
    },
    {
      id: 'camp-2',
      titulo: 'Campaña Gratuita de Vacunación Antirrábica y Desparasitación',
      tipo: 'Vacunación Antirrábica',
      fecha: '02 JUNIO 2024',
      diaSemana: 'DOMINGO',
      horario: '9:00 AM - 1:00 PM',
      distrito: 'Chilca',
      lugar: 'Parque Los Héroes, Chilca',
      organizador: 'Municipalidad Distrital de Chilca & CMVP Junín',
      costoSocial: 'Gratuito / Costo Cero',
      requisitos: [
        'Mascota mayor a 3 meses de edad en aparente buen estado de salud.',
        'Presentar DNI del dueño residente en el Valle del Mantaro.'
      ],
      respaldoCMVP: 'Avalado por la Dirección Regional de Salud Junín y CMVP',
      cuposTotales: 150,
      cuposOcupados: 82
    },
    {
      id: 'camp-3',
      titulo: 'Triaje Médico Preventivo, Desparasitación Interna y Pipetas Antipulgas',
      tipo: 'Desparasitación Masiva',
      fecha: '09 JUNIO 2024',
      diaSemana: 'DOMINGO',
      horario: '9:00 AM - 2:00 PM',
      distrito: 'Huancayo Centro',
      lugar: 'Frontis de la Plaza Huamanmarca, Huancayo',
      organizador: 'Clínica Veterinaria Mantaro Vet & Albergues Unidos',
      costoSocial: 'S/. 10.00 (Recaudación pro-albergues)',
      requisitos: [
        'Atención por orden de llegada con cupos preferenciales para rescatistas.'
      ],
      respaldoCMVP: 'Médicos Veterinarios Colegiados CMVP',
      cuposTotales: 80,
      cuposOcupados: 35
    }
  ]);

  public campanas = this._campanas.asReadonly();

  reservarCupo(campanaId: string): boolean {
    let exito = false;
    this._campanas.update(list => {
      return list.map(c => {
        if (c.id === campanaId && c.cuposOcupados < c.cuposTotales) {
          exito = true;
          return { ...c, cuposOcupados: c.cuposOcupados + 1 };
        }
        return c;
      });
    });
    return exito;
  }
}
