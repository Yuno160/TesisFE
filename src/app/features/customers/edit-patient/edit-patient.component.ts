import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/core/models/Patient';
import { PatientService } from 'src/app/core/services/patient.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  editForm: FormGroup;
  carnetIdentidad: string = '';
  titulo: string = 'Editar Paciente';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      carnet_identidad: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      genero: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.carnetIdentidad = params['carnet_identidad'];
      this.loadPatient(this.carnetIdentidad);
    });
  }

loadPatient(carnet: string): void {
  this.loading = true;
  this.errorMessage = '';
  
  this.patientService.getPacienteByCarnet(carnet).subscribe({
    next: (response: any) => {
      // Verifica primero si la respuesta tiene éxito y contiene datos
      if (response.success && response.data) {
        const patient = response.data;
        
        // Asigna los valores al formulario
        this.editForm.patchValue({
          nombre: patient.nombre,
          carnet_identidad: patient.carnet_identidad,
          edad: patient.edad,
          telefono: patient.telefono,
          direccion: patient.direccion,
          genero: patient.genero
        });
      } else {
        this.errorMessage = 'No se encontraron datos del paciente';
      }
      this.loading = false;
    },
    error: (error) => {
      console.error('Error cargando paciente:', error);
      this.errorMessage = error.error?.message || 'Error al cargar los datos del paciente';
      this.loading = false;
    }
  });
}

  editarPaciente(): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      this.errorMessage = 'Complete todos los campos requeridos correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const updatedPatient = this.editForm.value;

    this.patientService.editPatient(this.carnetIdentidad, updatedPatient).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Paciente actualizado correctamente';
          setTimeout(() => {
            this.router.navigate(['/customers']);
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Error al actualizar el paciente';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al actualizar el paciente:', error);
        this.errorMessage = error.error?.message || error.message || 'Error del servidor al actualizar';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}