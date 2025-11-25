// src/app/services/cif-code.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CifNode } from '../models/Cif-code';

@Injectable({
  providedIn: 'root' // Disponible en toda la app
})
export class CifCodeService {

  // Ajusta la URL de tu API
  private apiUrl = 'http://localhost:3000/api/cif-codes/tree'; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el árbol completo de códigos CIF.
   */
  getTree(): Observable<CifNode[]> {
    return this.http.get<CifNode[]>(this.apiUrl);
  }

  /**
   * Obtiene los hijos directos de un código padre específico.
   * Usado por el Asistente Experto.
   */
  
getChildren(parentCode: string): Observable<CifNode[]> {
    // Llama al nuevo endpoint: /api/cif-codes/children/:parent_code
    return this.http.get<CifNode[]>(`${this.apiUrl}/children/${parentCode}`).pipe(
      catchError(error => {
        console.error(`Error al obtener hijos para ${parentCode}:`, error);
        // Si no hay hijos (404), podríamos querer devolver un array vacío en lugar de un error.
        // Por ahora, relanzamos el error.
        return throwError(() => error); 
      })
    );
  }
  // --- FIN DEL NUEVO MÉTODO ---
}