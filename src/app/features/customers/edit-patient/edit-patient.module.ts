import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {EditPatientComponent} from './edit-patient.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {EditPatientRoutingModule} from './edit-patient.routing.module'

@NgModule({
  declarations: [EditPatientComponent],
  imports: [
    CommonModule,
    EditPatientRoutingModule,
    SharedModule
  ]
})
export class EditPatientModule { }
