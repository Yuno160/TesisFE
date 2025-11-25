import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { EditPatientComponent } from './edit-patient.component';

const routes: Routes = [
 
  {
        path: '',
        component: EditPatientComponent // <-- Directo al componente, sin Layout
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPatientRoutingModule { }