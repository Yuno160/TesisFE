import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPatientComponent } from './add-patient.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPatientRoutingModule } from './add-patient.routing.module';

@NgModule({
    declarations: [AddPatientComponent],
    imports: [
        CommonModule,
        AddPatientRoutingModule,
        SharedModule
    ]
})
export class AddPatientModule { }
