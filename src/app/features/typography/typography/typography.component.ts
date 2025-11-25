import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import timeGridPlugin from '@fullcalendar/timegrid';     
import dayGridPlugin from '@fullcalendar/daygrid';         
import { MatDialog } from '@angular/material/dialog';
import { ReservaModalComponent } from 'src/app/features/icons/reserva-modal/reserva-modal.component'; 
import { ReservaService } from 'src/app/core/services/reserva.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css'],
})
export class TypographyComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      timeGridPlugin,
      dayGridPlugin
    ],
    initialView: 'timeGridWeek', 
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    weekends: true,
    editable: false,  
    selectable: true,  
    businessHours: { 
      daysOfWeek: [ 1, 2, 3, 4, 5 ], 
      startTime: '08:00', 
      endTime: '18:00', 
    },
    slotDuration: '01:00:00', 
    slotLabelInterval: '01:00',
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [] 
  };

  constructor(
    public dialog: MatDialog,
    private reservasService: ReservaService 
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservasService.getAll().subscribe(
      (eventos) => {
        this.calendarOptions.events = eventos;
      },
      (error) => {
        console.error('Error al cargar las reservas:', error);
      }
    );
  }
  
  // Función para CREAR (Clic en hora vacía)
  handleDateClick(arg: any) {
    const dataParaModal = { 
      modo: 'Crear',
      fecha: arg.date 
    };

    // --- ¡CONSOLE LOG AÑADIDO! ---
    console.log('Abriendo modal (handleDateClick):', dataParaModal);
    // ---

    const dialogRef = this.dialog.open(ReservaModalComponent, {
      width: '600px',
      data: dataParaModal // Pasamos los datos
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarReservas(); 
      }
    });
  }

  // Función para EDITAR (Clic en reserva existente)
  handleEventClick(clickInfo: any) {
    const dataParaModal = {
      modo: 'Editar',
      reservaId: clickInfo.event.id,
      fecha: clickInfo.event.start 
    };

    // --- ¡CONSOLE LOG AÑADIDO! ---
    console.log('Abriendo modal (handleEventClick):', dataParaModal);
    // ---

    const dialogRef = this.dialog.open(ReservaModalComponent, {
      width: '600px',
      data: dataParaModal // Pasamos los datos
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarReservas(); 
      }
    });
  }
}