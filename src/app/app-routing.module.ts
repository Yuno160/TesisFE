import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';

const appRoutes: Routes = [
  
 {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },

  {
    path: '',
    component: LayoutComponent, // <-- ¡AQUÍ ESTÁ LA CLAVE!
    canActivate: [AuthGuard],   // Protegemos todo el grupo
    children: [
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'addpatient',
    loadChildren: () => import('./features/customers/add-patient/add-patient.module').then(m => m.AddPatientModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'editpatient/:carnet_identidad',
    loadChildren: () => import('./features/customers/edit-patient/edit-patient.module').then(m => m.EditPatientModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'users',
    loadChildren: () => import('./features/usuarios--routing/usuario/usuario.module').then(m => m.UsuarioModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'calify',
    loadChildren: () => import('./features/users/user-list/calificar/calificar.module').then(m => m.CalificarModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'generar',
    loadChildren: () => import('./features/generar-carnet/generar-carnet.module').then(m => m.GenerarCarnetModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'icons',
    loadChildren: () => import('./features/icons/icons.module').then(m => m.IconsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'typography',
    loadChildren: () => import('./features/typography/typography.module').then(m => m.TypographyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule),
    canActivate: [AuthGuard]
  },
 {
    path: 'calificacion', // El PREFIJO
    loadChildren: () => import('./features/calificacion/calificacion.module').then(m => m.CalificacionModule),
    canActivate: [AuthGuard]
  }
   ]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
