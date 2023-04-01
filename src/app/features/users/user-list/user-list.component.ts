import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { NotificationService } from 'src/app/core/services/notification.service';
// import * as Chartist from 'chartist';
import {PatientService} from '../../../core/services/patient.service';
import {Patient} from '../../../core/models/Patient';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent  {
  form!: UntypedFormGroup;
  isDisplayed = true;
  name: string = '' ;
  id: string = '' ;
  last:string = '' ;
  adress: string = '' ;
  porcentaje: string = '' ;
  telefono:number = 0 ;
  edad:number = 0 ;
  ci:string = '' ;
  cif:string = '' ;
  fecha: string = '' ;
  vence: string = '' ;
  isShow =true;
  constructor(private pacService: PatientService,public router: Router) { }
  newPaciente = new Patient(this.id,this.name, this.ci, this.telefono, this.adress, this.edad,this.cif);
  
  fcorop =['mentales','sensoriales','vozyhabla','cardiovascular'];
 

  funciones(){
    if(this.isDisplayed)
        {
            this.isDisplayed = false;
        }else{
            this.isDisplayed = true;
        }

  }

  registrar(name: string , last: string , adress: string , ci: string ){
    this.name = name;
    this.last = last;
    this.adress = adress;
    this.ci = ci;


    console.log(this.ci);
    console.log(this.cif);
    if(this.isShow){
      this.isShow = false;
    }else{
      this.isShow = true;
    }

    console.log("-----");
    console.log(this.name);
    console.log(this.last);
    console.log(this.adress);
    console.log(this.ci);
    console.log(this.cif);
    this.porcentaje = "50%";
    this.fecha = "10/06/21";
    this.vence = "10/06/25";
    this.newPaciente.nombre = this.name;
    this.newPaciente.direccion = this.adress;
    this.newPaciente.carnet = this.ci;
    this.newPaciente.cif = this.cif;

    this.pacService.savePatient(this.newPaciente);
    this.router.navigate(['carnet']);
  }
  registrarcal(newcal:string){
    console.log("CIF:" + newcal);
    this.cif = newcal;

  }

  generar(){






  }



}

