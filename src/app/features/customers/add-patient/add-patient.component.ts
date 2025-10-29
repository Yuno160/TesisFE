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
      genero: ['', Validators.required],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarPaciente() {

    const PATIENT: Patient = {
      nombre: this.productoForm.get('nombre')?.value || '',
      carnet_identidad: this.productoForm.get('carnet_identidad')?.value || '',
      edad: this.productoForm.get('edad')?.value ? parseInt(this.productoForm.get('edad')?.value, 10) : null,
      telefono: this.productoForm.get('telefono')?.value || null,
      direccion: this.productoForm.get('direccion')?.value || null,
      genero: this.productoForm.get('genero')?.value || null,
      antecedentes_medicos: this.productoForm.get('antecedentes_medicos')?.value || null,};
    console.log(PATIENT);

   
      this._patientService.savePatient(PATIENT).subscribe(data => {

        this.router.navigate(['/customers']);
      }, error => {
        console.log(error);
        this.productoForm.reset();
      })
    
   

  
  }

  esEditar() {

    if(this.id !== null) {
      this.titulo = 'EDITAR PACIENTE';
      this._patientService.getPacienteByCarnet(this.id).subscribe(data => {
        this.productoForm.setValue({
          nombre: data.nombre,
          carnet_identidad: data.carnet_identidad,
          telefono: data.telefono,
          direccion: data.direccion,
          edad: data.edad
        })
      })
    }
  }

}
