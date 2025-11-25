import { Component, OnInit } from '@angular/core';
// Importamos AuthService para saber quién está logueado
import { AuthenticationService } from '../../../core/services/auth.service'; 
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  
  currentUser: any;
  reservasHoy: any[] = []; // Aquí guardaremos las citas
  constructor(private authService: AuthenticationService, private reservaService: ReservaService, private router: Router) { }

  ngOnInit(): void {
    // Obtenemos los datos del usuario actual al iniciar
    this.currentUser = this.authService.getCurrentUser();
    this.verificarYCargarAgenda();


    // Si es Calificador o Admin, cargamos su agenda
    if (this.esCalificador || this.esAdmin || this.esOperador) {
      this.cargarAgendaHoy();
    }
  }

  cargarAgendaHoy() {
    this.reservaService.getHoy().subscribe(
      data => this.reservasHoy = data,
      err => console.error(err)
    );
  }

  // --- Helpers (Ayudantes) para el HTML ---
  // Estas funciones nos dicen 'true' o 'false' según el rol
  
  get esAdmin() { 
    return this.currentUser?.usuario?.rol === 'ADMIN'; 
  }

  get esOperador() { 
    return this.currentUser?.usuario?.rol === 'OPERADOR'; 
  }

  get esCalificador() { 
    return this.currentUser?.usuario?.rol === 'CALIFICADOR'; 
  }

  iniciarCalificacion(cita: any) {
    console.log('Iniciando calificación para:', cita.nombre, '| Reserva ID:', cita.id);

    // Navegamos pasando el ID del paciente en la URL (para cargar datos)
    // Y el ID de la reserva en el 'state' (para poder cerrarla al final)
    this.router.navigate(['/calificacion/crear', cita.id_paciente], {
      state: { 
        reservaId: cita.id, // <--- ESTO ES LO QUE FALTABA
        paciente: {
          id: cita.id_paciente,
          nombre: cita.nombre,
          carnet: cita.carnet_identidad,
          edad: cita.edad
        }
      }
    });
  }

  verificarYCargarAgenda() {
    if (this.esCalificador || this.esAdmin || this.esOperador) {
      this.cargarAgendaHoy();
    }
  }

  
}