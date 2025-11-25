import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CifNode } from '../models/Cif-code'; // Para el tipo de respuesta

// Interfaz para la Pregunta
export interface PreguntaExperto {
  id: number;
  codigo_pregunta: string;
  texto_pregunta: string;
  tipo_respuesta: string;
}

// Interfaz para la Respuesta del usuario
export interface RespuestaExperto {
  pregunta_id: number;
  respuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpertoService {

  private apiUrl = 'http://localhost:3000/api/experto'; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las preguntas para una categoría padre.
   * ej: /api/experto/preguntas/b1
   */
  getPreguntas(categoriaPadre: string): Observable<PreguntaExperto[]> {
    return this.http.get<PreguntaExperto[]>(`${this.apiUrl}/preguntas/${categoriaPadre}`).pipe(
      catchError(error => {
        console.error(`Error al obtener preguntas para ${categoriaPadre}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Envía las respuestas al motor de inferencia.
   * POST /api/experto/evaluar
   */
  evaluar(respuestas: RespuestaExperto[]): Observable<CifNode[]> {
    return this.http.post<CifNode[]>(`${this.apiUrl}/evaluar`, respuestas).pipe(
      catchError(error => {
        console.error('Error al evaluar respuestas:', error);
        return throwError(() => error);
      })
    );
  }
}