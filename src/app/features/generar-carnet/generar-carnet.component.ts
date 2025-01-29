import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
declare var $:any;

declare global {
  interface Navigator {
    msSaveOrOpenBlob: (blobOrBase64: Blob | string, filename: string) => void
  }
}
@Component({
  selector: 'app-generar-carnet',
  templateUrl: './generar-carnet.component.html',
  styleUrls: ['./generar-carnet.component.css']
})
export class GenerarCarnetComponent implements OnInit {
@ViewChild('img',{static:true}) img!: ElementRef;
@ViewChild('parent',{static:true}) parent!: ElementRef;
@ViewChild('micanvas',{static:true}) micanvas!:ElementRef;
nombre=this.showName;
ci= this.showCarnet;
porcentaje = this.showPorcen;
cif = this.showCif;
fechaI
fechaF
nuevocif : string;
nuevoPorcent:any;
qrdata :any;


constructor(public datepipe: DatePipe){
  this.fechaI =this.datepipe.transform((new Date), 'MM/dd/yyyy');
  
  let currentDate = new Date ();
  let fechaIn = new Date (new Date().setFullYear(currentDate.getFullYear()+4))
  this.fechaF = this.datepipe.transform((fechaIn), 'MM/dd/yyyy')
  console.log(this.fechaF)
  this.qrdata = 'Initial QR code data string';

}

ngOnInit():void{
  this.cargar_imagen();
  this.nuevocif = 'this.cif + this.porcentaje';
  console.log(this.nuevocif)
  this.pocentajes();
}

saveAsImage() {
  // fetches base 64 date from image
  const parentElement = this.parent.nativeElement;

  // converts base 64 encoded image to blobData
  let blobData = this.convertBase64ToBlob(parentElement);

  // saves as image
  if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
    window.navigator.msSaveOrOpenBlob(blobData, 'Qrcode');
  } else { // chrome
    const blob = new Blob([blobData], { type: "image/png" });
    const url = window.URL.createObjectURL(blob);
    // window.open(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Qrcode';
    link.click();
  }

}

private convertBase64ToBlob(Base64Image: any) {
  // SPLIT INTO TWO PARTS
  const parts = Base64Image.split(';base64,');
  // HOLD THE CONTENT TYPE
  const imageType = parts[0].split(':')[1];
  // DECODE BASE64 STRING
  const decodedData = window.atob(parts[1]);
  // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
  const uInt8Array = new Uint8Array(decodedData.length);
  // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }
  // RETURN BLOB IMAGE AFTER CONVERSION
  return new Blob([uInt8Array], { type: imageType });
}




public get showName(){
  return localStorage.getItem('nombre');
}

public get showPorcen(){
  return localStorage.getItem('porcen');
}
public get showCarnet(){
  return localStorage.getItem('carnet');
}

public get showCif(){
  return localStorage.getItem('cif');
}

pocentajes(){
  if(this.porcentaje == '.0'){
    this.nuevoPorcent = '0-4%'

  }else if(this.porcentaje == '.1'){
    this.nuevoPorcent = '5-24%'
  } else if(this.porcentaje == '.2'){
    this.nuevoPorcent = '25-49%'
  
  }
  else if(this.porcentaje == '.3'){
    this.nuevoPorcent = '50-95%'
  
  }
  else if(this.porcentaje == '.4'){
    this.nuevoPorcent = '96-100%'
  
  }
  else if(this.porcentaje == '.8'){
    this.nuevoPorcent = 'Sin especificar'
  
  }
}

cargar_imagen(){
  var canvas = this.micanvas.nativeElement;
  var ctx = canvas.getContext("2d");
  var img = this.img.nativeElement;
  var ancho = img.width;
  var alto = img.height;
  ctx.drawImage(img,80,40,ancho,alto);
}
colocar_img(){
  var canvas = this.micanvas.nativeElement;
  var ctx = canvas.getContext("2d");
  ctx.font = "100px, Arial";
  ctx.fillStyle = "black";
  ctx.fillText(this.nombre,500,200)

  var ctx2 = canvas.getContext("2d");
  ctx2.font = "100px, Arial";
  ctx2.fillStyle = "black";
  ctx2.fillText(this.ci,500,250)

  var ctx3 = canvas.getContext("2d");
  ctx3.font = "100px, Arial";
  ctx3.fillStyle = "black";
  ctx3.fillText(this.nuevocif,550, 300)

  var ctx4 = canvas.getContext("2d");
  ctx4.font = "100px, Arial";
  ctx4.fillStyle = "black";
  ctx4.fillText(this.nuevoPorcent,600, 350)

  var ctx5 = canvas.getContext("2d");
  ctx5.font = "100px, Arial";
  ctx5.fillStyle = "black";
  ctx5.fillText(this.fechaI,550, 400)

  var ctx6 = canvas.getContext("2d");
  ctx6.font = "100px, Arial";
  ctx6.fillStyle = "black";
  ctx6.fillText(this.fechaF,550, 450)

/* 
  var canvas = this.micanvas.nativeElement;
  var ctx7 = canvas.getContext("2d");
  var img = this.qr.nativeElement;
  var ancho = img.width;
  var alto = img.height;
  ctx7.drawImage(img,80,40,ancho,alto); */
}

guardar_canvas_local(){
  console.log(this.fechaI);
  this.ngOnInit();
  this.colocar_img()
  var canvas = this.micanvas.nativeElement;
  var imagen = canvas.toDataURL();
  var newImg = imagen.replace(/^data:image\/jpg/,"data:aplication/octet-stream");
  $("#download").attr("download", "image/carnet").attr("href",newImg);
}
}
