
import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
declare interface RouteInfo {

  title: string;
  value: string;


}

export const VIS:RouteInfo[] =[
  {title:'Agudeza Visual', value: 'b210'},
  {title: 'Funciones de E. Adyacentes al ojo', value:'215'},
  {title: 'Sensaciones A. con el ojo', value:'b220'}
]

export const AGU: RouteInfo[] =[
  {title: 'Binocular Larga Distancia', value: 'b21000'},
  {title: 'Monocular Larga Distancia', value: 'b21001'},
  {title: 'Binocular Corta Distancia', value: 'b21003'},
  {title:'Monocular Corta Distancia', value: 'b21004'}
]

export const SEN:RouteInfo[] = [

  {  title: 'Vista', value:'210'},
  { title: 'Audicion', value:'b230 '},
  {  title: 'Otros',value:'b310'},
  { title: 'Dolor', value:'b410'},


];
export const ROUTES: RouteInfo[] = [

  {  title: 'Funciones Mentales', value:'b110'},
  { title: 'Funciones Sensoriales', value:'b200'},
  {  title: 'Funciones del habla',value:'b310'},
  { title: 'Funciones de sistemas cardiovascular,hematologico,inmunologico y respiratorio', value:'b410'},
  { title: 'Funciones del sistema digestivo',value:'b510'},


];


@Component({
  selector: 'app-corporales',
  templateUrl: './corporales.component.html',
  styleUrls: ['./corporales.component.css']
})
export class CorporalesComponent implements OnInit {
  menuItems: any=[];
  sens: any=[];
  vistas: any=[];
  agudezas: any=[];
  sensoriales = true;
  vis = true;
  agu = true;

  @Output() b = new EventEmitter<string>();
  constructor() { }

  ngOnInit(){
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.sens = SEN.filter(sen => sen);
    this.vistas = VIS.filter(vis => vis);
    this.agudezas = AGU.filter(agu => agu);
  }

  funciones(value:string){
    console.log(value);
    if(value == "b200"){
      if(this.sensoriales)
        {
            this.sensoriales = false;
        }else{
            this.sensoriales = true;
        }
    }
  }

  vista(value:string){
    console.log(value);
    if(value == '210'){
      this.vis = false;
    }else{
      this.vis=true;
    }
  }

  agudeza(value:string){
    console.log(value);
    if(value == 'b210'){
      this.agu = false;
    }else{
      this.agu = true;
    }
  }
  bino(value:string){
    console.log(value);
    this.b.emit(value);

  }

}
