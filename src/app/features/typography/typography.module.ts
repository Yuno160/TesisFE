// features/typography/typography.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- ¡¡AÑADE ESTOS DOS!! ---
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

// --- Importaciones de FullCalendar ---
import { FullCalendarModule } from '@fullcalendar/angular';

import { TypographyRoutingModule } from './typography-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TypographyComponent } from './typography/typography.component'; 

// --- Importaciones de Material (para el Modal) ---
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// --- El componente Modal que este módulo usa ---
import { ReservaModalComponent } from 'src/app/features/icons/reserva-modal/reserva-modal.component'; // (La ruta que me diste)

@NgModule({
  declarations: [
    TypographyComponent
  ],
  imports: [
    CommonModule,
    TypographyRoutingModule,
    SharedModule,
    FullCalendarModule,
    
    // --- ¡¡AÑADE ESTOS MÓDULOS AQUÍ!! ---
    FormsModule,
    ReactiveFormsModule,

    // --- Módulos de Material que usa el Modal ---
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReservaModalComponent
  ]
})
export class TypographyModule { }