import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';

import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

const routes: Routes = [
  
  {
    path: '',
    component: DashboardHomeComponent // <-- Directo al componente, sin Layout
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
