import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GenerarCarnetComponent} from './generar-carnet.component'
import { SharedModule } from 'src/app/shared/shared.module';
import {GenerarCarnetRoutingModule} from './generar-carnet.routing.module';
@NgModule({
    declarations: [GenerarCarnetComponent],
    imports: [
        CommonModule,
        GenerarCarnetRoutingModule,
        SharedModule
    ]
})
export class GenerarCarnetModule { }