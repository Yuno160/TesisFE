import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalificarComponent } from './calificar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalificarRoutingModule } from './calificar.routing.module';
@NgModule({
    declarations: [CalificarComponent],
    imports: [
        CommonModule,
        CalificarRoutingModule,
        SharedModule
    ]
})
export class CalificarModule { }