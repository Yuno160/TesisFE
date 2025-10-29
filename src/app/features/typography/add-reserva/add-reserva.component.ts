import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva } from 'src/app/core/models/Reserva';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { ThemePalette } from '@angular/material/core';
import { PatientService } from 'src/app/core/services/patient.service';
import { CrewsService } from 'src/app/core/services/crews.service';

@Component({
  selector: 'app-add-reserva',
  templateUrl: './add-reserva.component.html',
  styleUrls: ['./add-reserva.component.css']
})
export class AddReservaComponent implements OnInit {
  @ViewChild('picker') picker: any;

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  carnetIdentidad: string = '';
  patient: any = null;
  errorMessage: string = '';
  reservaForm: FormGroup;
  titulo = 'ADD RESERVA';
  id: string | null;
  selectedDate: Date | null = null; // Fecha seleccionada
  selectedTime: string = ''; // Hora seleccionada en formato 'HH:mm'
  id_paciente: any = null;
  fechaHora:string = '';
  horaSeleccionada: string;
  horasDisponibles: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  crews: any[] = []; // Array que almacenará los crews disponibles
  selectedCrew: number;

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required])
  });
  public dateControl = new FormControl(new Date(2021, 9, 4, 5, 6, 7));
  public dateControlMinMax = new FormControl(new Date());

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _reservaService: ReservaService,
    private aRouter: ActivatedRoute,
    private patientService: PatientService,
    private crewServices: CrewsService
  ) {
    this.reservaForm = this.fb.group({
      id_paciente: ['', Validators.required],
      id_profesional: ['', Validators.required],
      nombre: ['', Validators.required],
      carnet: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fecha_hora: ['', Validators.required],
      estado: ['active', Validators.required] // Estado por defecto en "active"
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
    this.getCrews();
  }
 

  agregarReserva() {
    const RESERVA: Reserva = {
      id_paciente: this.reservaForm.get('id_paciente')?.value,
      id_profesional: this.reservaForm.get('id_profesional')?.value,
      fecha_hora: this.reservaForm.get('fecha_hora')?.value, // Aseguramos que el formato sea correcto para el backend
      estado: this.reservaForm.get('estado')?.value
    };

    console.log(RESERVA);

    if (this.id == null) {
      this._reservaService.guardarReserva(RESERVA).subscribe(data => {
        this.router.navigate(['/typography']);
      }, error => {
        console.log(error);
        this.reservaForm.reset();
      });
    } else {
      this._reservaService.editReserva(this.id, RESERVA).subscribe(data => {
        this.router.navigate(['/typography']);
      }, error => {
        console.log(error);
        this.reservaForm.reset();
      });
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'EDITAR RESERVA';
      this._reservaService.obtenerReserva(this.id).subscribe(data => {
        this.reservaForm.setValue({
          id_paciente: data.id_paciente,
          id_profesional: data.id_profesional,
          nombre: data.nombre,
          carnet: data.carnet,
          telefono: data.telefono,
          direccion: data.direccion,
          fecha_hora: data.fecha_hora, // Ajustamos el nombre del campo
          estado: data.estado
        });
      });
    }
  }

  toggleMinDate(evt: any) {
    if (evt.checked) {
      this._setMinDate();
    } else {
      this.minDate = null;
    }
  }

  toggleMaxDate(evt: any) {
    if (evt.checked) {
      this._setMaxDate();
    } else {
      this.maxDate = null;
    }
  }

  closePicker() {
    this.picker.cancel();
  }

  private _setMinDate() {
    const now = new Date();
    // Asignar una fecha mínima para el picker si es necesario
  }

  private _setMaxDate() {
    const now = new Date();
    // Asignar una fecha máxima para el picker si es necesario
  }

  searchPatient() {
    if (!this.carnetIdentidad.trim()) {
      this.errorMessage = 'Por favor, ingrese un carnet.';
      this.patient = null;
      return;
    }

    this.patientService.searchPatient(this.carnetIdentidad).subscribe(
      (data) => {
        console.log(data)
        this.patient = data;
        this.errorMessage = '';
        this.id_paciente = this.patient.id_paciente;
        console.log("ID paciente:"+ this.id_paciente);
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Paciente no encontrado.';
        this.patient = null;
      }
    );
  }

  getCrews(){

    this.crewServices.getCrews().subscribe(
      (data) => {
        console.log(data);
        this.crews = data;
        console.log("crews:"+ this.crews);
      },
      (error) => {
        this.errorMessage = error.error?.message ;
        console.log(this.errorMessage);
        this.crews = null;
      }
    );

  }
  onCrewChange(event: any) {
    console.log("Crew seleccionado:", event.value);
  }

  createReservation() {
    if (this.selectedDate && this.horaSeleccionada && this.id_paciente && this.selectedCrew) {
      const reservationDateTime = `${this.selectedDate.toISOString().split('T')[0]}T${this.horaSeleccionada}`;
  
      const reservationData = {
        id_paciente: this.id_paciente,  // Asegúrate de que tienes este valor
        id_crew: this.selectedCrew,         // ID del crew seleccionado
        fecha_hora: reservationDateTime,    // Fecha y hora combinadas
        estado: "Agendada"                  // Estado fijo en "Agendada"
      };
  
      console.log('Enviando reserva:', reservationData);
  
      this._reservaService.createReservation(reservationData).subscribe(
        (response) => {
          console.log('Reserva creada con éxito:', response);
          alert('Reserva creada con éxito');
        },
        (error) => {
          console.error('Error al crear la reserva:', error);
          console.error('Cuerpo del error:', error.error); // Muestra el mensaje de error del servidor
          alert('Hubo un error al crear la reserva.');
        }
      );
    } else {
      console.error('Por favor, selecciona todos los campos necesarios.');
      alert('Todos los campos son obligatorios.');
    }
  }
  

  fechaHoraReserva(){
    this.fechaHora = `${this.selectedDate?.toLocaleDateString()} ${this.horaSeleccionada}`
    console.log("fechaHora:"+ this.fechaHora);
  }

  
}
