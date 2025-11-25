import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariolistComponent } from '../usuariolist/usuariolist.component';

const routes: Routes = [
  { path: '', component: UsuariolistComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
