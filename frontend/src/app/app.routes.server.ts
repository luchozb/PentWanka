import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'mascota/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'albergues/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'reportes/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'perfil',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
