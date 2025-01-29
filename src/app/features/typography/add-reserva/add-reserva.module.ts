import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddReservaComponent } from './add-reserva.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {AddReservaRoutingModule } from './add-reserva.routing.module';

@NgModule({
    declarations: [AddReservaComponent],
    imports: [
        CommonModule,
        AddReservaRoutingModule,
        SharedModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
    ]
})
export class AddReservaModule { }
