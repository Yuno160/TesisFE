import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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


export const POR: RouteInfo[] =[
  {title: 'No hay problema', value: '.0'},
  {title: 'Ligero', value: '.1'},
  {title: 'Moderado', value: '.2'},
  {title: 'Grave', value: '.3'},
  {title:'Completo', value: '.4'},
  {title:'Sin especificar', value: '.8'}
]




export const SEN:RouteInfo[] = [

  {  title: 'Vista', value:'210'},
  { title: 'Audicion', value:'b230 '},
  {  title: 'Otros',value:'b310'},
  { title: 'Dolor', value:'b410'},


];
export const MEN:RouteInfo[] = [

  {  title: 'Mentales Globales', value:'b114'},
  { title: 'Mentales Especificas', value:'b140 '}

];
export const ROUTES: RouteInfo[] = [

  {  title: 'Funciones Mentales', value:'b110'},
  { title: 'Funciones Sensoriales', value:'b200'},
  {  title: 'Funciones del habla',value:'b310'},
  { title: 'Funciones de sistemas cardiovascular,hematologico,inmunologico y respiratorio', value:'b410'},
  { title: 'Funciones del sistema digestivo',value:'b510'},
];

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.component.html',
  styleUrls: ['./calificar.component.css']
})
export class CalificarComponent implements OnInit {
  menuItems: any=[];
  sens: any=[];
  ment: any=[];
  vistas: any=[];
  agudezas: any=[];
  porcentaje: any=[];
  sensoriales = true;
  mentales = true;
  vis = true;
  agu = true;
  por = true;
  @Output() b = new EventEmitter<string>();
  constructor(private routes:Router) { }

  ngOnInit() {
   this.categoria();
   this.menuItems = ROUTES.filter(menuItem => menuItem);
  this.sens = SEN.filter(sen => sen);
  this.ment = MEN.filter(m => m);
  this.vistas = VIS.filter(vis => vis);
  this.agudezas = AGU.filter(agu => agu);
  this.porcentaje = POR.filter(por => por);
   
  }

  public get showSubtitulo(){
   return localStorage.getItem('subtitulo')
    
    
  }

  public get showCarnet(){
    return localStorage.getItem('carnet');
  }
  public get showName(){
    return localStorage.getItem('nombre');
  }

  categoria (){
    let subtitulo = this.showSubtitulo;
    console.log("ad:"+ subtitulo);
    if( subtitulo == "Corporal Functions"){
      
      console.log(subtitulo)
    }
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

    if(value == "b110"){
      if(this.mentales)
        {
            this.mentales = false;
        }else{
            this.mentales = true;
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
    localStorage.setItem('cif', value); 
    this.por = false;
    

  }

  porcen(value:string){
    console.log(value);
    this.b.emit(value);
    this.routes.navigate(['/generar'])
    localStorage.setItem('porcen', value); 
    

  }
  

}
