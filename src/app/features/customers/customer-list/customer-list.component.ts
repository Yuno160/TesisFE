import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PatientService } from '../../../core/services/patient.service';
import { GlobalService } from '../../../core/services/global.service';
import { Patient } from '../../../core/models/Patient';
import { Router } from '@angular/router'


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
    private csvService : GlobalService,
    private router: Router
  ) { }

  listPatients : Patient[]=[];

  ngOnInit() {
    this.titleService.setTitle('CIFSIS');
    this.logger.log('Patients loaded');
    this.notificationService.openSnackBar('Patients loaded');
    this.obtenerPacientes();

  }


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
        this._PatientService.deletePatient(carnet_identidad).subscribe({
            next: (response) => {
                if (response.isConflict) {
                    // Mostrar alerta con detalles de dependencias
                    const dependencias = Object.entries(response.dependencies)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                    
                    if (confirm(
                        `No se puede eliminar. El paciente tiene:\n${dependencias}\n\n¿Deseas archivar el paciente en lugar de eliminarlo?`
                    )) {
                      alert('Paciente archivado correctamente.');
                        //this.archivarPaciente(carnet_identidad); // Implementa este método
                    }
                } else {
                    alert('Paciente eliminado correctamente.');
                    this.obtenerPacientes();
                }
            },
            error: (error) => {
                console.error('Error:', error);
                alert(error.status === 409 
                    ? 'El paciente tiene registros asociados (ver consola para detalles)'
                    : 'Error inesperado al eliminar');
            }
        });
    }
}

calificarPaciente(idPaciente: number): void {
    console.log('Navegando a calificar paciente con ID:', idPaciente);
    // Navega a la ruta que definiremos para la calificación, pasando el ID
    this.router.navigate(['/calificacion/crear', idPaciente]);
  }

  // 4. Añade el método verEvaluacion
  verEvaluacion(idPaciente: number): void {
   console.log('Navegando a VER calificación con ID:', idPaciente);
  // Esto navegará a '/calificacion/ver/16'
  this.router.navigate(['/calificacion/ver', idPaciente]);}


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
