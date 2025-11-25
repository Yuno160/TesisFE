import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventInput } from '@fullcalendar/core'; // Usamos el tipo de FullCalendar

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
// La URL de tu backend
  private API_URL = 'http://localhost:3000/api/reservas';

  constructor(private http: HttpClient) { }

  /**
   * GET: Trae todas las reservas para llenar el calendario.
   * (El backend ya las devuelve en formato FullCalendar)
   */
  getAll(): Observable<EventInput[]> {
    return this.http.get<EventInput[]>(this.API_URL);
  }

  /**
   * POST: Crea una nueva reserva
   */
  create(reserva: any): Observable<any> {
    // El body debe coincidir con lo que espera 'crearReserva' en el controller
    // (id_paciente, fecha_hora_inicio, observaciones)
    return this.http.post(this.API_URL, reserva);
  }

  /**
   * GET (By ID): Trae los datos de una reserva para editar
   */
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  getHoy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/hoy`);
  } 

  getConteoHoy(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/conteo-hoy`);
  }

  marcarComoCompletada(id: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/estado`, { estado: 'Completada' });
  }

  /**
   * PUT (Update): Actualiza una reserva
   */
  update(id: string, reserva: any): Observable<any> {
    // El body debe coincidir con 'updateReserva' en el controller
    // (fecha_hora_inicio, observaciones)
    return this.http.put(`${this.API_URL}/${id}`, reserva);
  }

  /**
   * DELETE (Delete): Elimina una reserva
   */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}