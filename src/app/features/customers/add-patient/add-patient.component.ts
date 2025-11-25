import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/core/models/Patient';
import { PatientService } from 'src/app/core/services/patient.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  productoForm: FormGroup;
  titulo = 'ADD PATIENT';
  id: string | null;

  constructor(private fb: FormBuilder,
              private router: Router,
              private _patientService: PatientService,
              private aRouter: ActivatedRoute) {
    
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      carnet_identidad: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      edad: ['', Validators.required],
      // El campo genero es requerido para que el select no quede vacío
      genero: ['', Validators.required],
      // Añadimos antecedentes aunque no sea requerido, para poder leerlo después
      antecedentes_medicos: [''] 
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarPaciente() {
    // 1. Si el formulario es inválido (ej. falta género), no hacemos nada
    if (this.productoForm.invalid) {
      // Marca todos los campos como "tocados" para que se muestren los errores rojos en el HTML
      this.productoForm.markAllAsTouched(); 
      return;
    }

    const PATIENT: Patient = {
      nombre: this.productoForm.get('nombre')?.value || '',
      carnet_identidad: this.productoForm.get('carnet_identidad')?.value || '',
      // Convertimos la edad a número para evitar problemas en el backend
      edad: Number(this.productoForm.get('edad')?.value), 
      telefono: this.productoForm.get('telefono')?.value || null,
      direccion: this.productoForm.get('direccion')?.value || null,
      // Aquí se captura correctamente el valor seleccionado en el <mat-select>
      genero: this.productoForm.get('genero')?.value || null,
      antecedentes_medicos: this.productoForm.get('antecedentes_medicos')?.value || null,
    };

    console.log('Enviando paciente:', PATIENT);

    if (this.id !== null) {
      // Lógica de EDICIÓN (Si tu servicio tiene un método específico update, úsalo aquí)
      // Si usas savePatient para ambos, está bien:
      this._patientService.savePatient(PATIENT).subscribe(data => {
        this.router.navigate(['/customers']);
      }, error => {
        console.log(error);
        this.productoForm.reset();
      });
    } else {
      // Lógica de CREACIÓN
      this._patientService.savePatient(PATIENT).subscribe(data => {
        this.router.navigate(['/customers']);
      }, error => {
        console.log(error);
        this.productoForm.reset();
      });
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'EDITAR PACIENTE';
      this._patientService.getPacienteByCarnet(this.id).subscribe(data => {
        // Usamos patchValue en lugar de setValue.
        // patchValue es más seguro: si 'data' trae campos extra o le faltan algunos, no explota.
        this.productoForm.patchValue({
          nombre: data.nombre,
          carnet_identidad: data.carnet_identidad,
          telefono: data.telefono,
          direccion: data.direccion,
          edad: data.edad,
          genero: data.genero, // ¡Importante! Esto pre-selecciona la opción en el select
          antecedentes_medicos: data.antecedentes_medicos
        });
      }, error => {
        console.log('Error al obtener paciente para editar:', error);
      });
    }
  }

}