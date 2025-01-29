import { Component, OnInit,Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { NotificationService } from 'src/app/core/services/notification.service';
// import * as Chartist from 'chartist';
import {PatientService} from '../../../core/services/patient.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import html2canvas from "html2canvas";
import { Router, RouterLink } from '@angular/router';
import { Patient } from 'src/app/core/models/Patient';
import { pairwise } from 'rxjs';

export interface DialogData {
  carnet: string;
  nombre: string;
  cif: string;
  porcentaje:string;
  fecha:string;
  vence:string;
}
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})


export class UserListComponent implements OnInit {
  form!: UntypedFormGroup;
  isDisplayed = true;
  nombre: string = '' ;
  id: string = '' ;
  direccion: string = '' ;
  
  porcentaje: string = '' ;
  telefono:number = 0 ;
  edad:number = 0 ;
  carnet:string = '' ;
  codCif:string = '' ;
  fecha: string = '' ;
  vence: string = '' ;
  isShow =true;
  patient:string='';
  subtitulo:string;

  constructor(private pacService: PatientService,public router: Router, public dialog: MatDialog) { }
  //newPaciente = new Patient(this.id,this.nombre, this.carnet, this.telefono, this.direccion, this.edad,this.cif);
  
  fcorop =['mentales','sensoriales','vozyhabla','cardiovascular'];
  ngOnInit(){
    
  }
  public get showCarnet(){
    return localStorage.getItem('carnet');
  }
  public get showName(){
    return localStorage.getItem('nombre');
  }
  funciones(){
    this.subtitulo = "Corporal Functions";
    localStorage.setItem('subtitulo', this.subtitulo);
    

  }
  estructura(){
    this.subtitulo = "Estructural Functions";
    localStorage.setItem('subtitulo', this.subtitulo);
  }

  registrar( ){
    /* console.log(this.codCif);
    let pacientito = new Patient();
    pacientito.nombre = this.nombre;
    pacientito.direccion = this.direccion;
    pacientito.carnet = this.carnet;
    pacientito.edad = this.edad;
    pacientito.telefono = this.telefono;
    pacientito.codCif = this.codCif;
    this.pacService.savePatient(pacientito).subscribe(data =>{
      console.log('El paciente fue calificado correctamente');

    },error =>{
      console.log(error);
    })
    this.router.navigate(['carnet']); */
  }
  registrarcal(newcal:string){
    console.log("CIF:" + newcal);
    this.codCif = newcal;

  }

  openDialog(): void {
    this.registrar();
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      panelClass: 'my-class',
      data: {nombre: this.nombre, carnet: this.carnet, cif:this.codCif}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });

    
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'generar-carnet.html',
})
export class DialogOverviewExampleDialog {
  imagenCreada: string | undefined;
  imgCreada = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  crearImagen(){



    html2canvas(document.getElementById('contenido')!, {
      // Opciones
      allowTaint: true,
      useCORS: false,
      // Calidad del PDF
      scale: 1
   }).then(function(canvas) {
   var img = canvas.toDataURL("image/png");

  });
  
  
  }


}

