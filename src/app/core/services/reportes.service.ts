import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private API_URL = 'http://localhost:3000/api';


  constructor(private http: HttpClient) { }

  /**
   * Pide el reporte de un paciente específico.
   * Esperamos recibir un PDF (blob).
   */
  getReportePaciente(pacienteId: string): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/reportes/paciente/${pacienteId}`, 
      {
        responseType: 'blob', // ¡Importante! Le decimos a Angular que espere un archivo
      }
    );
  }

  getReporteTotal(): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/reportes/total`, 
      {
        responseType: 'blob', // Esperamos un archivo PDF
      }
    );
  }

  getReporteDiario(): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/reportes/calificaciones/diario`, 
      {
        responseType: 'blob', // Esperamos un archivo PDF
      }
    );
  }

  getReporteMensual(mes: string): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/reportes/calificaciones/mensual/${mes}`, 
      {
        responseType: 'blob',
      }
    );
  }

  getReporteRango(inicio: string, fin: string): Observable<Blob> {
    return this.http.get(
      `${this.API_URL}/reportes/calificaciones/rango/${inicio}/${fin}`, 
      {
        responseType: 'blob',
      }
    );
  }
}
