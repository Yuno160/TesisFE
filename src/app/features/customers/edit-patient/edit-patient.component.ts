import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PatientService } from 'src/app/core/services/patient.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  editForm:FormGroup;
  carnetIdentidad:string='';
  titulo: string = 'Editar Paciente';
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private patientService:PatientService, private router:Router){
    this.editForm = this.fb.group({
      nombre:['', Validators.required],
      carnet_identidad:['', Validators.required],
      edad:['', Validators.required],
      telefono:['', Validators.required],
      direccion:['', Validators.required],
      genero:['', Validators.required],
    })
  }

  ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.carnetIdentidad = params['carnet_identidad'];
        this.loadPatient(this.carnetIdentidad);
      })
  }

  loadPatient(carnet:string):void{
    this.patientService.getPatient(carnet).subscribe(patient =>{
      console.log('Patient Loaded', patient);
      this.editForm.patchValue(patient);
    }, error => {
      console.log('Error loading patient',error);
    })
  }

  editarPaciente():void {
    if (this.editForm.valid) {
      const updatedPatient = this.editForm.value;
      console.log('Datos que se enviarán:', updatedPatient);
      this.patientService.editPatient(this.carnetIdentidad, updatedPatient
      ).subscribe(
        (response) => {
          console.log('Paciente actualizado correctamente:', response);
          this.router.navigate(['/customers']); // Redirigir al listado de pacientes
        },
        (error) => {
          console.error('Error al actualizar el paciente:', error);
        }
      );
    }
  }
}