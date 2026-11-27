import { Injectable, signal } from '@angular/core';
import { Albergue } from '../interfaces/albergue.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbergueService {
  private _albergues = signal<Albergue[]>([
    {
      id: 'alb-1',
      nombre: 'Albergue Huellitas del Mantaro',
      coordinadora: 'Lic. Valeria Paucar',
      distrito: 'El Tambo, Huancayo',
      direccion: 'Jr. Los Sauces 340 (a 4 cuadras del Parque Bolognesi)',
      registroMunicipal: 'Reg. Municipal #2023-ALB',
      anioFundacion: '2021',
      mision: 'Fundado en 2021, Huellitas del Mantaro es un refugio sin fines de lucro dedicado al rescate, rehabilitación física y reinserción de animales en situación de abandono extremo en la provincia de Huancayo y comunidades del Valle del Mantaro.',
      animalesAlbergados: 42,
      limiteCapacidad: 45,
      porcentajeOcupacion: 93,
      telefonoWhatsapp: '51964123456',
      enlaceMapa: 'https://maps.google.com/?q=El+Tambo+Huancayo',
      metodosDonacion: {
        yapePlin: '964 123 456 (A nombre de Valeria Paucar - Huellitas)',
        bcpCuenta: '355-98234120-0-88',
        bcpCci: '002-355-0098234120088-14',
        contactoAlimentos: 'Coordinar entrega de sacos de alimento balanceado al 964123456'
      }
    },
    {
      id: 'alb-2',
      nombre: 'Refugio Amigos de 4 Patas Chilca',
      coordinadora: 'Dra. Carmen Huamán',
      distrito: 'Chilca, Huancayo',
      direccion: 'Av. Huancavelica 1420 (Cuartel 9), Chilca',
      registroMunicipal: 'Reg. Comunal #CH-2022-09',
      anioFundacion: '2020',
      mision: 'Rescate de canes seniles y en estado crítico en la zona sur de Huancayo.',
      animalesAlbergados: 28,
      limiteCapacidad: 30,
      porcentajeOcupacion: 93,
      telefonoWhatsapp: '51954789012',
      enlaceMapa: 'https://maps.google.com/?q=Chilca+Huancayo',
      metodosDonacion: {
        yapePlin: '954 789 012 (A nombre de Carmen Huamán)',
        bcpCuenta: '355-77219012-0-45',
        bcpCci: '002-355-0077219012045-20',
        contactoAlimentos: 'Recepción de mantas y alimento de Lun a Sáb en refugio'
      }
    }
  ]);

  public albergues = this._albergues.asReadonly();

  obtenerPorId(id: string): Albergue | undefined {
    return this._albergues().find(a => a.id === id);
  }
}
