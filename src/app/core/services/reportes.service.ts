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

  // --- 1. REPORTE DE NIVELES (Dona) ---
  getNivelesGravedad(): Observable<any> {
    // Pedimos ?format=json para que el backend nos de datos, no el PDF
    return this.http.get(`${this.API_URL}/reportes/niveles?format=json`);
  }

  // --- 2. REPORTE DE ZONAS (Pastel) ---
  getDistribucionZonas(): Observable<any> {
    return this.http.get(`${this.API_URL}/reportes/zonas?format=json`);
  }

  // --- 3. REPORTE DE ÁREAS (Dona) ---
  getDistribucionAreas(): Observable<any> {
    return this.http.get(`${this.API_URL}/reportes/areas?format=json`);
  }

  // --- 4. REPORTE DE PRODUCTIVIDAD (Barras) ---
  getProductividad(): Observable<any> {
    return this.http.get(`${this.API_URL}/reportes/productividad?format=json`);
  }

  // Método helper para obtener la URL de descarga del PDF
  getPdfUrl(tipo: string): string {
    return `${this.API_URL}/reportes/${tipo}`; // Sin ?format=json descarga el PDF
  }

  getPdfTablaUrl(tipo: string): string {
    return `${this.API_URL}/reportes/${tipo}?modo=tabla`; 
  }

  descargarReporteCIF(idPaciente: number | string): Observable<Blob> {
    // Importante: { responseType: 'blob' } le dice a Angular "no esperes JSON, viene un archivo"
    return this.http.get(`${this.API_URL}/reportes/reporte-cif/${idPaciente}`, { 
      responseType: 'blob' 
    });
  }

  
}
