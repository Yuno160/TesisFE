import { Component, Input, OnInit } from '@angular/core';
import html2canvas from "html2canvas";
import {PatientService} from '../../core/services/patient.service';

@Component({
  selector: 'app-generar-carnet',
  templateUrl: './generar-carnet.component.html',
  styleUrls: ['./generar-carnet.component.css']
})
export class GenerarCarnetComponent  {
  name: string = '';
  imgCreada = false;
  imagenCreada;
  ci : string ='';
  cif :string='';
  porcentaje: string='';
  fecha :string='';
  vence :string='';
  constructor(private pacService: PatientService) { }

/*   ngOnInit(): void {

    this.name = this.pacService.getPatient();
    this.ci = this.pacService.getPaciente().ci;
    this.cif = this.pacService.getPaciente().cod;
    this.porcentaje = this.pacService.getPaciente().porcen;
    this.fecha = this.pacService.getPaciente().fecha;
    this.vence = this.pacService.getPaciente().vence;
  } */

  crearImagen(){



    html2canvas(document.querySelector("#contenido"),{
      allowTaint:true,
      useCORS:true
    }).then(canvas =>{
      this.imagenCreada = canvas.toDataURL();

    });

    this.imgCreada = true;
  }

  subirDatos(){
    
  }

}
