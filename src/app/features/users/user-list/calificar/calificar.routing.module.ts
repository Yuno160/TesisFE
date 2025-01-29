import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { CalificarComponent } from './calificar.component';

const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      children: [
        { path: '', component: CalificarComponent },
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CalificarRoutingModule { }