import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';

import { CalificacionComponent } from './calificacion.component';
import { VerCalificacionComponent } from '../ver-calificacion/ver-calificacion.component';

const routes: Routes = [
  {
    path: 'crear/:id',
    component: CalificacionComponent
  },
  
  // Y la URL para ver será: /calificacion/ver/16
  {
    path: 'ver/:id',
    component: VerCalificacionComponent
  },
  
  // Opcional: una ruta por defecto si solo van a /calificacion
  {
    path: '',
    redirectTo: '/dashboard', // O a donde quieras
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalificacionRoutingModule { }