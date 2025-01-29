import { NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsRoutingModule } from './icons-routing.module';
import { IconsComponent } from './icons/icons.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [IconsComponent],
  imports: [
    CommonModule,
    SharedModule,
    IconsRoutingModule,
    ChartModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class IconsModule { }
