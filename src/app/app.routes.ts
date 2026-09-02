import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clientes/clientes-list/clientes-list').then((m) => m.ClientesList),
      },
      {
        path: 'clientes/:id',
        loadComponent: () =>
          import('./features/clientes/cliente-detalle/cliente-detalle').then(
            (m) => m.ClienteDetalle,
          ),
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./features/catalogo/catalogo-list').then((m) => m.CatalogoList),
      },
      {
        path: 'tramites',
        loadComponent: () => import('./features/tramites/tramites-list').then((m) => m.TramitesList),
      },
      {
        path: 'pagos',
        loadComponent: () => import('./features/pagos/pagos').then((m) => m.Pagos),
      },
      {
        path: 'alertas',
        loadComponent: () => import('./features/alertas/alertas').then((m) => m.Alertas),
      },
      {
        path: 'gastos',
        loadComponent: () => import('./features/gastos/gastos').then((m) => m.Gastos),
      },
      {
        path: 'corte-caja',
        loadComponent: () => import('./features/corte-caja/corte-caja').then((m) => m.CorteCajaPage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
