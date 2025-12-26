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
      (data: any[]) => {
        // 1. LOG DE CONTROL: Para ver en la consola qué llega realmente
        console.log("🔥 DATOS FRESCOS DEL BACKEND:", data);

        // Si no hay datos, no hacemos nada
        if (!data || data.length === 0) {
            console.warn("⚠️ No llegaron reservas o la lista está vacía.");
            return;
        }

        // 2. MAPEO DE DATOS (Traducción BD -> Calendario)
        const eventosFormateados = data.map(reserva => {
            
            // A) REPARACIÓN DE FECHAS
            // MySQL a veces manda "2025-10-20 10:00:00" y JS necesita "2025-10-20T10:00:00"
            let fechaInicio = reserva.fecha_hora_inicio;
            let fechaFin = reserva.fecha_hora_fin;

            if (typeof fechaInicio === 'string' && fechaInicio.includes(' ')) {
                fechaInicio = fechaInicio.replace(' ', 'T');
            }
            if (typeof fechaFin === 'string' && fechaFin.includes(' ')) {
                fechaFin = fechaFin.replace(' ', 'T');
            }

            // B) SELECCIÓN DE COLOR
            // Si viene 'color_crew' lo usamos, si no, ponemos Gris (#808080)
            const colorFinal = reserva.color_crew || '#808080';

            // C) CONSTRUCCIÓN DEL TÍTULO
            // Ejemplo: "Sandra (Equipo 1)"
            const tituloEvento = `${reserva.nombre} (${reserva.nombre_crew || 'Sin Asignar'})`;

            // D) RETORNO DEL OBJETO PARA FULLCALENDAR
            return {
                id: reserva.id.toString(), // El ID debe ser string
                title: tituloEvento,       // Lo que se lee en la cajita
                start: fechaInicio,        // Cuándo empieza
                end: fechaFin,             // Cuándo termina
                
                // Estilos
                backgroundColor: colorFinal,
                borderColor: colorFinal,
                textColor: '#ffffff',      // Letra blanca
                
                // Datos extra (útiles para cuando haces click en la reserva)
                extendedProps: {
                    observaciones: reserva.observaciones,
                    telefono: reserva.telefono,
                    crewId: reserva.id_crew,
                    paciente: reserva.nombre
                }
            };
        });

        // 3. ACTUALIZACIÓN DEL CALENDARIO
        // Creamos una copia del objeto de opciones para forzar a Angular a pintar de nuevo
        this.calendarOptions = {
            ...this.calendarOptions,
            events: eventosFormateados
        };
        
        console.log(`✅ Se cargaron ${eventosFormateados.length} reservas al calendario.`);
      },
      (error) => {
        console.error('❌ Error crítico al cargar reservas:', error);
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