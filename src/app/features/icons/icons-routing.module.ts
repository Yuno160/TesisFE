import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { IconsComponent } from './icons/icons.component';

const routes: Routes = [
  

  {
    path: '',
    component: IconsComponent // <-- Directo al componente, sin Layout
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconsRoutingModule { }
