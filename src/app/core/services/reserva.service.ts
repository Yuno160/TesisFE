import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from '../models/Reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  url = 'http://localhost:4000/api/reservas/';
  constructor(private http: HttpClient) {}

  getReserva(): Observable<any>{
    return this.http.get(this.url);
  }

  eliminarReserva(id:string):Observable<any>{
    return this.http.delete(this.url + id);
  }

  guardarReserva(reserva: Reserva):Observable<any>{
    return this.http.post(this.url, reserva);

  }
  obtenerReserva(id: string): Observable<any>{
    return this.http.get(this.url + id);
  }
}
