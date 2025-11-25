// src/app/features/icons/reserva-modal/reserva-modal.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'; 
import { PatientService } from '../../../core/services/patient.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-modal',
  templateUrl: './reserva-modal.component.html',
  styleUrls: ['./reserva-modal.component.css'],
  standalone: true, 
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, 
    MatProgressSpinnerModule, MatSnackBarModule, MatIconModule
  ]
})
export class ReservaModalComponent implements OnInit {

  searchForm: FormGroup; 
  reservaForm: FormGroup; 

  pacienteEncontrado: any = null;
  isLoading = false;
  pacienteNoEncontrado = false;
  fechaHoraClickeada: Date;
  modo: 'Crear' | 'Editar';
  idReservaActual: string | null = null;
  tituloModal = 'Crear Nueva Reserva';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<ReservaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      modo: 'Crear' | 'Editar', 
      fecha: Date, 
      reservaId?: string 
    },
    private snackBar: MatSnackBar,
    private pacientesService: PatientService, 
    private reservasService: ReservaService
  ) {
    this.modo = data.modo; 
    this.fechaHoraClickeada = data.fecha;

    if (this.modo === 'Editar' && data.reservaId) {
      this.idReservaActual = data.reservaId;
      this.tituloModal = 'Editar Reserva';
    } else {
      this.tituloModal = 'Crear Nueva Reserva';
    }

    // --- ¡ESTA ES LA CORRECCIÓN! ---
    
    // 1. Formulario SÓLO para la búsqueda
    this.searchForm = this.fb.group({
      carnetBusqueda: ['', Validators.required]
    });

    // 2. Formulario SÓLO para guardar la reserva
    this.reservaForm = this.fb.group({
      // ¡Ya no tiene carnetBusqueda!
      id_paciente: [null, Validators.required], 
      observaciones: ['']
    });
    // --- FIN DE LA CORRECCIÓN ---
  }

  ngOnInit(): void {
    if (this.modo === 'Editar' && this.idReservaActual) {
      this.searchForm.get('carnetBusqueda')?.clearValidators();
      this.searchForm.get('carnetBusqueda')?.updateValueAndValidity();
      setTimeout(() => { this.cargarDatosReserva(this.idReservaActual!); }, 0);
    }
  }

  cargarDatosReserva(id: string) {
    this.isLoading = true;
    this.reservasService.getById(id).subscribe(
      (reserva) => {
        this.pacienteEncontrado = { id_paciente: reserva.id_paciente, nombre: reserva.nombre, carnet_identidad: reserva.carnet_identidad };
        this.searchForm.get('carnetBusqueda')?.setValue(reserva.carnet_identidad);
        this.searchForm.disable(); 
        this.reservaForm.get('id_paciente')?.setValue(reserva.id_paciente);
        this.reservaForm.get('observaciones')?.setValue(reserva.observaciones);
        this.isLoading = false;
      }, (error) => { /* ... */ }
    );
  }
  irACrearPaciente() {
    this.dialogRef.close(); // Cerramos el modal actual
    this.router.navigate(['/addpatient']); // Nos vamos a la pantalla de registro
  }

  onBuscarPaciente() {
    // Leemos del 'searchForm'
    const carnet = this.searchForm.get('carnetBusqueda')?.value;
    if (!carnet) return;

    this.isLoading = true;
    this.pacienteNoEncontrado = false;
    this.pacienteEncontrado = null;
    this.reservaForm.get('id_paciente')?.setValue(null); 

    this.pacientesService.buscarPorCarnet(carnet).subscribe(
      (respuesta) => {
        const paciente = respuesta.data; 
        this.pacienteEncontrado = paciente;
        // Escribimos en el 'reservaForm'
        this.reservaForm.get('id_paciente')?.setValue(paciente.id_paciente); // (usando tu corrección )
        this.reservaForm.get('id_paciente')?.updateValueAndValidity();
        this.snackBar.open(`Paciente: ${paciente.nombre}`, 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }, (error) => { 
        this.pacienteEncontrado = null;
        this.pacienteNoEncontrado = true;
        this.reservaForm.get('id_paciente')?.setValue(null);
        this.reservaForm.get('id_paciente')?.updateValueAndValidity();
        this.snackBar.open('Paciente no encontrado.', 'Cerrar', { duration: 4000 });
        this.isLoading = false;
      }
    );
  }

  onGuardarReserva() {
    // Esta validación AHORA SÍ va a funcionar
    if (this.reservaForm.invalid) {
      console.log('Error de validación. Valor id_paciente:', this.reservaForm.get('id_paciente')?.value);
      this.snackBar.open('Formulario inválido. Asegúrese de que el paciente esté seleccionado.', 'Cerrar', { duration: 4000 });
      return;
    }
    
    this.isLoading = true;
    console.log('¡Formulario válido! Guardando reserva...'); // <-- AÑADE ESTE LOG

    const datosReserva = {
      id_paciente: this.reservaForm.get('id_paciente')?.value,
      fecha_hora_inicio: this.fechaHoraClickeada.toISOString(),
      observaciones: this.reservaForm.get('observaciones')?.value
    };

    if (this.modo === 'Crear') {
      this.reservasService.create(datosReserva).subscribe(
        () => { this.snackBar.open('¡Reserva creada!', 'Cerrar', { duration: 3000 }); this.dialogRef.close(true); },
        (error) => { this.isLoading = false; this.snackBar.open('Error al crear la reserva.', 'Cerrar', { duration: 4000 }); }
      );
    } else {
      this.reservasService.update(this.idReservaActual!, datosReserva).subscribe(
        () => { this.snackBar.open('¡Reserva actualizada!', 'Cerrar', { duration: 3000 }); this.dialogRef.close(true); },
        (error) => { this.isLoading = false; this.snackBar.open('Error al actualizar la reserva.', 'Cerrar', { duration: 4000 }); }
      );
    }
  }

  onEliminarReserva() {
    if (!this.idReservaActual) return;
    const confirmar = confirm('¿Estás segura de que quieres ELIMINAR esta reserva?');
    if (!confirmar) return;

    this.isLoading = true;
    this.reservasService.delete(this.idReservaActual).subscribe(
      () => { this.snackBar.open('Reserva eliminada.', 'Cerrar', { duration: 3000 }); this.dialogRef.close(true); },
      (error) => { this.isLoading = false; this.snackBar.open('Error al eliminar la reserva.', 'Cerrar', { duration: 4000 }); }
    );
  }

  onCancelar() {
    this.dialogRef.close(false);
  }
}