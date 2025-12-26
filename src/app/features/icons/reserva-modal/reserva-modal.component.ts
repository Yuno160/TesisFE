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
import { CrewsService } from '../../../core/services/crews.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  listaCrews: any[] = [];
  
  // fechaHoraClickeada: Date; // Ya no la usaremos directamente para guardar, solo para inicializar
  
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
    private reservasService: ReservaService,
    private crewService: CrewsService
  ) {
    this.modo = data.modo; 

    if (this.modo === 'Editar' && data.reservaId) {
      this.idReservaActual = data.reservaId;
      this.tituloModal = 'Editar Reserva';
    } else {
      this.tituloModal = 'Crear Nueva Reserva';
    }

    // 1. Formulario de Búsqueda
    this.searchForm = this.fb.group({
      carnetBusqueda: ['', Validators.required]
    });

    // 2. Formulario de Reserva (Ahora incluye la fecha)
    this.reservaForm = this.fb.group({
      id_paciente: [null, Validators.required], 
      // Inicializamos con la fecha formateada para el input
      fechaHora: [this.formatDateForInput(data.fecha), Validators.required], 
      observaciones: [''],
      id_crew_manual: [null] 
    });
  }

  

  ngOnInit(): void {
    this.cargarCrews();
    if (this.modo === 'Editar' && this.idReservaActual) {
      this.searchForm.get('carnetBusqueda')?.clearValidators();
      this.searchForm.get('carnetBusqueda')?.updateValueAndValidity();
      setTimeout(() => { this.cargarDatosReserva(this.idReservaActual!); }, 0);
    }
  }
  cargarCrews() {
    this.crewService.getAllActive().subscribe(data => {
      this.listaCrews = data;
    }, err => console.error("Error cargando crews", err));
  }

  // Helper para convertir Date a string "YYYY-MM-DDTHH:mm"
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  cargarDatosReserva(id: string) {
    this.isLoading = true;
    this.reservasService.getById(id).subscribe(
      (reserva) => {
        this.pacienteEncontrado = { 
            id_paciente: reserva.id_paciente, 
            nombre: reserva.nombre, 
            carnet_identidad: reserva.carnet_identidad 
        };
        
        // Llenamos el buscador (aunque esté readonly)
        this.searchForm.get('carnetBusqueda')?.setValue(reserva.carnet_identidad);
        this.searchForm.disable(); 
        
        // Llenamos el formulario de reserva
        this.reservaForm.patchValue({
            id_paciente: reserva.id_paciente,
            observaciones: reserva.observaciones,
            // Convertimos la fecha que viene de BD (string o Date) al formato del input
            fechaHora: this.formatDateForInput(new Date(reserva.fecha_hora_inicio))
        });

        this.isLoading = false;
      }, (error) => { this.isLoading = false; }
    );
  }

  irACrearPaciente() {
    this.dialogRef.close(); 
    this.router.navigate(['/addpatient']); 
  }

  onBuscarPaciente() {
    const carnet = this.searchForm.get('carnetBusqueda')?.value;
    if (!carnet) return;

    this.isLoading = true;
    this.pacienteNoEncontrado = false;
    this.pacienteEncontrado = null;
    this.reservaForm.get('id_paciente')?.setValue(null); 

    this.pacientesService.buscarPorCarnet(carnet).subscribe(
      (respuesta) => {
        const paciente = respuesta.data || respuesta; // Ajuste por si viene envuelto en data
        this.pacienteEncontrado = paciente;
        
        this.reservaForm.get('id_paciente')?.setValue(paciente.id_paciente); 
        this.snackBar.open(`Paciente: ${paciente.nombre}`, 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }, (error) => { 
        this.pacienteEncontrado = null;
        this.pacienteNoEncontrado = true;
        this.reservaForm.get('id_paciente')?.setValue(null);
        this.snackBar.open('Paciente no encontrado.', 'Cerrar', { duration: 4000 });
        this.isLoading = false;
      }
    );
  }

  onGuardarReserva() {
  if (this.reservaForm.invalid) return;

  this.isLoading = true; // Activamos el spinner

  // Preparamos los datos
  const datosReserva = {
      id_paciente: this.reservaForm.get('id_paciente')?.value,
      fecha_hora_inicio: this.reservaForm.get('fechaHora')?.value,
      observaciones: this.reservaForm.get('observaciones')?.value,
      id_crew_manual: this.reservaForm.get('id_crew_manual')?.value
  };

  // DECISIÓN: ¿Estamos Creando o Editando?
  let peticionObservable;

  if (this.modo === 'Crear') {
      peticionObservable = this.reservasService.create(datosReserva);
  } else {
      // Si estamos editando, necesitamos el ID de la reserva
      const idReserva = this.data.reservaId; 
      peticionObservable = this.reservasService.update(idReserva, datosReserva);
  }

  // --- EJECUTAMOS LA PETICIÓN ---
  peticionObservable.subscribe({
    next: (respuesta) => {
      // ✅ ÉXITO (Código 200 o 201)
      this.isLoading = false;
      
      Swal.fire({
        icon: 'success',
        title: '¡Listo!',
        text: 'La cita ha sido agendada correctamente.',
        confirmButtonColor: '#3085d6',
        timer: 2000 // Se cierra solo en 2 seg
      });

      this.dialogRef.close(true); // Cerramos el modal y decimos "true" para recargar calendario
    },
    error: (err) => {
      // ❌ ERROR (Código 400, 404, 409, 500)
      this.isLoading = false;
      console.error("Error al guardar:", err);

      // AQUÍ OBTENEMOS EL MENSAJE DEL BACKEND
      // El backend manda: res.status(400).json({ message: 'Texto del error' })
      // Angular lo recibe en: err.error.message
      
      const mensajeBackend = err.error?.message || 'Ocurrió un error inesperado en el servidor.';

      Swal.fire({
        icon: 'error',
        title: 'No se pudo agendar',
        text: mensajeBackend, // <--- AQUÍ MOSTRAMOS TU MENSAJE PERSONALIZADO
        confirmButtonColor: '#d33'
      });
    }
  });
}

  onEliminarReserva() {
    if (!this.idReservaActual) return;
    const confirmar = confirm('¿Estás segura de que quieres ELIMINAR esta reserva?');
    if (!confirmar) return;

    this.isLoading = true;
    this.reservasService.delete(this.idReservaActual).subscribe(
      () => { 
          this.snackBar.open('Reserva eliminada.', 'Cerrar', { duration: 3000 }); 
          this.dialogRef.close(true); 
      },
      (error) => { 
          this.isLoading = false; 
          this.snackBar.open('Error al eliminar.', 'Cerrar', { duration: 4000 }); 
      }
    );
  }

  onCancelar() {
    this.dialogRef.close(false);
  }
}