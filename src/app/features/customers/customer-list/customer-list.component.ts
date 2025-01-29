import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/services/notification.service';

import html2canvas from "html2canvas";
import { PatientService } from '../../../core/services/patient.service';
import { GlobalService } from '../../../core/services/global.service';
import { Patient } from '../../../core/models/Patient';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  displayedColumns: string[] = ['nombre', 'carnet', 'telefono', 'direccion', 'edad', 'cif'];

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private _PatientService: PatientService,
    private csvService : GlobalService
  ) { }

  listPatients : Patient[]=[];

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Patients');
    this.logger.log('Patients loaded');
    this.notificationService.openSnackBar('Patients loaded');
    this.obtenerPacientes();

  }

  /* agregarPaciente(){
    html2canvas(document.querySelector("#contenido"),{
      allowTaint:true,
      useCORS:true
    }).then(canvas =>{
      this.imagenCreada = canvas.toDataURL();

    });

    this.imgCreada = true;
  } */

  obtenerPacientes (){
    this._PatientService.getPatients().subscribe(data =>{
      console.log(data);
      this.listPatients = data;
    }, error =>{
      console.log(error);
    })
  }

  eliminarPaciente(carnet_identidad: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
        this._PatientService.deletePatient(carnet_identidad).subscribe(
            (response) => {
                console.log('Paciente eliminado:', response);
                alert('Paciente eliminado correctamente.');
                this.obtenerPacientes(); // Actualizar la lista de pacientes
            },
            (error) => {
                console.error('Error al eliminar el paciente:', error);
                alert('Hubo un error al eliminar el paciente.');
            }
        );
    }
}


  downloadCsv(){
    console.log("lista pacientes" )
    console.log(this.listPatients)
    this.csvService.cvsDownload(this.displayedColumns, this.listPatients);
  }

  guardarCarnet(carnet:string, nombre:string){

    console.log("carnet:"+carnet);
    localStorage.setItem('carnet', carnet);  
    console.log("nombre:"+nombre);
    localStorage.setItem('nombre', nombre); 

  }
}
