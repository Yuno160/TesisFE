import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import html2canvas from "html2canvas";
import { ReservaService } from '../../../core/services/reserva.service';
import { Reserva } from '../../../core/models/Reserva';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/services/notification.service';
import { GlobalService } from '../../../core/services/global.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'carnet', 'telefono', 'direccion', 'fecha', 'hora'];

  constructor(private _reservaService: ReservaService,
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private csvService : GlobalService    ) { }
  name = new FormControl();
  ci = new FormControl();
  phone = new FormControl();
  adress = new FormControl();
  date = new FormControl();
  time = new FormControl();
  imgCreada = false;
  listReserva: Reserva[] = [];

  ngOnInit(): void {
    this.titleService.setTitle('angular-material-template - Bookings');
    this.logger.log('Bookings loaded');
    this.notificationService.openSnackBar('Bookings loaded');
    this.obtenerReserva();
  }


  obtenerReserva(){
    this._reservaService.getReserva().subscribe(data =>{
      console.log(data);
      this.listReserva = data;
    },error => {
      console.log(error);
    })
  }

  eliminarReserva(id:any){
    this._reservaService.eliminarReserva(id).subscribe(data =>{
    this.obtenerReserva();
    }, error => {
      console.log(error);
    })
  }

  downloadCsv(){
    console.log("lista pacientes" )
    console.log(this.listReserva)
    this.csvService.cvsDownload(this.displayedColumns, this.listReserva);
  }


}
