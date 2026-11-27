import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./components/inicio-catalogo/inicio-catalogo').then(m => m.InicioCatalogoComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro').then(m => m.RegistroComponent)
  },
  {
    path: 'mascota/:id',
    loadComponent: () => import('./components/mascota-detalle/mascota-detalle').then(m => m.MascotaDetalleComponent)
  },
  {
    path: 'reportes/nuevo',
    loadComponent: () => import('./components/reporte-wizard/reporte-wizard').then(m => m.ReporteWizardComponent)
  },
  {
    path: 'reportes/:id',
    loadComponent: () => import('./components/reporte-detalle/reporte-detalle').then(m => m.ReporteDetalleComponent)
  },
  {
    path: 'campanas',
    loadComponent: () => import('./components/campanas/campanas').then(m => m.CampanasComponent)
  },
  {
    path: 'albergues/:id',
    loadComponent: () => import('./components/albergues/albergues').then(m => m.AlberguesComponent)
  },
  {
    path: 'albergues',
    redirectTo: 'albergues/alb-1',
    pathMatch: 'full'
  },
  {
    path: 'observatorio',
    loadComponent: () => import('./components/observatorio/observatorio').then(m => m.ObservatorioComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./components/perfil-panel/perfil-panel').then(m => m.PerfilPanelComponent)
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
