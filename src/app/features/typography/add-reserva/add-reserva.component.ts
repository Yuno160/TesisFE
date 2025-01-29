import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva } from 'src/app/core/models/Reserva';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { ThemePalette } from '@angular/material/core';
import { PatientService } from 'src/app/core/services/patient.service';

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
    private patientService: PatientService
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
        this.patient = data;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Paciente no encontrado.';
        this.patient = null;
      }
    );
  }

  createReservation() {
    if (this.selectedDate && this.selectedTime) {
      const reservationDateTime = `${this.selectedDate.toISOString().split('T')[0]}T${this.selectedTime}`;
      console.log('Fecha y hora de reserva:', reservationDateTime);
      // Aquí puedes enviar `reservationDateTime` al backend
    } else {
      console.error('Por favor, selecciona una fecha y hora.');
    }
  }
}
