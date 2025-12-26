import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentoServiceService {
// Ajusta tu puerto
  private apiUrl = 'http://localhost:3000/api/documentos';
  // URL base para descargar/ver archivos (la carpeta pública que configuramos)
  private uploadsUrl = 'http://localhost:3000/'; 

  constructor(private http: HttpClient) { }

  // 1. SUBIR ARCHIVO (POST)
  subirDocumento(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/subir`, formData);
  }

  // 2. LISTAR ARCHIVOS (GET)
  listarDocumentos(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paciente/${idPaciente}`);
  }

  // 3. Helper para obtener la URL completa del archivo y poder descargarlo
  // El backend guarda algo como: "uploads\documentos\archivo.pdf"
  // Nosotros necesitamos: "http://localhost:3000/uploads/documentos/archivo.pdf"
  getUrlArchivo(rutaBackend: string): string {
    // Corregimos las barras invertidas de Windows (\) por barras normales (/)
    const rutaLimpia = rutaBackend.replace(/\\/g, '/'); 
    return `${this.uploadsUrl}${rutaLimpia}`;
  }
}