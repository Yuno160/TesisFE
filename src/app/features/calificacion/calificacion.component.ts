

import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms'; // Asegúrate de tener FormArray
import { CifNode } from '../../core/models/Cif-code';
// ... (Tus otros imports: ActivatedRoute, PacienteService, etc.)
// --- PASOS NUEVOS ---
import { ActivatedRoute, Router } from '@angular/router'; // Para leer la URL y navegar
import { PatientService } from '../../core/services/patient.service'; // Debes tener este servicio
import { CalificacionService } from '../../core/services/calificacion.service'; // Y este
import { Patient } from '../../core/models/Patient'; // Y este modelo
import { ReservaService } from 'src/app/core/services/reserva.service';
import { C } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit {

  calificacionForm: FormGroup;
  public searchTerm: string = '';
  reservaId: string | null = null;
  
  // --- PASO NUEVO: Variable para guardar el paciente ---
  public paciente: Patient;
  public isLoading: boolean = true; // Para mostrar un 'cargando'
  public errorMessage: string = ''; // Para mostrar errores

  constructor(
    private fb: FormBuilder,
    // --- PASOS NUEVOS ---
    private route: ActivatedRoute, // Para leer el ID de la URL
    private router: Router, // Para navegar al final
    private pacienteService: PatientService, // Para cargar datos del paciente
    private calificacionService: CalificacionService, // Para guardar la calificación
    private cdr: ChangeDetectorRef,
    private reservaService: ReservaService,
  ) {

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.reservaId = navigation.extras.state['reservaId'];
    }
   }

  ngOnInit(): void {
     console.log("ReservaID", this.reservaId);
    this.calificacionForm = this.fb.group({
      pacienteId: [null, Validators.required], // Importante: el ID irá aquí
      observaciones: [''],
      cifCodes: this.fb.array([]) 
    });

    // 2. Cargar los datos del paciente desde la URL
    this.loadPacienteData();
  }

    loadPacienteData(): void {
    const pacienteId = this.route.snapshot.paramMap.get('id');

    if (!pacienteId) {
      this.errorMessage = 'No se proporcionó un ID de paciente.';
      this.isLoading = false;
      return;
    }

  
 // Llamamos al servicio (el que usa /id/:id)
    this.pacienteService.getPacienteById(pacienteId).subscribe({
      next: (data) => {
        this.paciente = data;
        
        // ¡Crítico! Ponemos el ID del paciente en el formulario
        this.calificacionForm.patchValue({
          pacienteId: this.paciente.id_paciente // O 'id', según tu modelo de Paciente
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener paciente:', err);
        this.errorMessage = 'Error al cargar los datos del paciente. ' + (err.error?.message || '');
        this.isLoading = false;
      }
    });
  }

  // ... (onTreeSelectionChange y onSearchTermChange no cambian) ...
  onTreeSelectionChange(selectedNodes: CifNode[]): void {
    
    // Obtenemos la referencia al FormArray
    const cifCodesArray = this.calificacionForm.get('cifCodes') as FormArray;

    // 1. Limpiamos el array
    cifCodesArray.clear();

    // 2. Volvemos a llenar el array con los objetos que espera el servicio
    //    (El servicio de guardar espera {codigo, descripcion})
    selectedNodes.forEach(node => {
      cifCodesArray.push(this.fb.control({ 
        codigo: node.codigo, 
        descripcion: node.descripcion 
      }));
    });
  }
  onSearchTermChange(): void {
    // ...
  }

  // ... (removeSelectedCode no cambia) ...
  removeSelectedCode(codigoToRemove: string): void {
    const cifCodesArray = this.calificacionForm.get('cifCodes') as FormArray;
    
    // Encontramos el índice del control que contiene el código a eliminar
    const index = cifCodesArray.controls.findIndex(control => 
      (control.value as CifNode).codigo === codigoToRemove
    );

    if (index !== -1) {
      cifCodesArray.removeAt(index);
      
      // NOTA: Esto solo quita la píldora.
      // No desmarca el checkbox en el árbol (eso requeriría más lógica).
    }
  }

  // --- PASO NUEVO: Implementar el guardado ---
  guardarCalificacion(): void {
    if (this.calificacionForm.invalid) {
      console.error('Formulario inválido.');
      // Marcar campos como "tocados" para mostrar errores
      this.calificacionForm.markAllAsTouched();
      return;
    }

    console.log('Enviando al Back-End:', this.calificacionForm.value);
    
    this.calificacionService.guardar(this.calificacionForm.value).subscribe({
      next: (respuesta) => {
        console.log('¡Guardado con éxito!', respuesta);
        if (respuesta) {
          console.log("ReservaID", this.reservaId);
            this.reservaService.marcarComoCompletada(this.reservaId).subscribe(() => {
                console.log('Reserva cerrada');
                
                // 3. Volver al Dashboard (o generar carnet)
                this.router.navigate(['/dashboard']);
            });
        } else {
            // Si no venía de una reserva (ej. entró directo), solo navega
            this.router.navigate(['/dashboard']);
        }
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        // Mostrar un mensaje de error
        this.errorMessage = 'Error al guardar. ' + (err.error?.message || '');
      }
    });
  }

  onSugerenciasExperto(sugerencias: CifNode[]): void {
 console.log('¡Sugerencias recibidas del asistente!', sugerencias);
 console.log('CALIFICACION (PADRE): ¡RECIBIENDO sugerencias!', sugerencias);
 console.log('Reservaa ID:', this.reservaId)

    // 1. Obtenemos la referencia al FormArray (igual que en onTreeSelectionChange)
    const cifCodesArray = this.calificacionForm.get('cifCodes') as FormArray;

    // 2. Limpiamos la lista actual
    cifCodesArray.clear();

    // 3. Llenamos el FormArray con las NUEVAS sugerencias
    sugerencias.forEach(node => {
      cifCodesArray.push(this.fb.control({ 
        codigo: node.codigo, 
        // La descripción puede venir vacía desde el BE, 
        // pero la incluimos por si acaso.
        descripcion: node.descripcion || '' 
      }));
    });

    this.cdr.detectChanges();
  }

  get cifCodesArray(): FormArray {
    return this.calificacionForm.get('cifCodes') as FormArray;
  }
}