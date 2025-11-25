import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CifNode } from '../models/Cif-code'; // ¡Puede que necesites esto!
interface FormPayload {
  pacienteId: string | number;
  observaciones: string;
  cifCodes: { codigo: string; descripcion: string; }[];
}

interface BackendPayload {
  id_paciente: string | number;
  observaciones: string;
  codigos: string[]; // "calificacion final codigo final armado"
}

export interface CalificacionGuardada {
  id: number;
  observaciones: string;
  fecha_creacion: string;
  codigos: CifNode[]; // Un array de {codigo, descripcion}
  fecha_vencimiento?: string;
}
// -----------------------------

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = 'http://localhost:3000/api/calificaciones'; // URL de tu backend

  constructor(private http: HttpClient) {}

  guardar(payload: FormPayload): Observable<any> {

    // --- ¡AQUÍ ESTÁ LA TRANSFORMACIÓN! ---

    // 1. "Armamos" la calificación final:
    //    Convertimos el array de objetos [ {codigo...}, {codigo...} ]
    //    en un array de strings [ "d4501", "b1670" ]
    const codigosArray = payload.cifCodes.map(nodo => nodo.codigo);

    // 2. Creamos el objeto final para el Back-End
    //    con los nombres de campo correctos (ej. "id_paciente")
    const datosParaBackend: BackendPayload = {
      id_paciente: payload.pacienteId,
      observaciones: payload.observaciones,
      codigos: codigosArray
    };

    // ----------------------------------------

    // 3. Enviamos el objeto TRANSFORMADO al Back-End
    console.log('Enviando al API:', datosParaBackend);
    
    return this.http.post<any>(this.apiUrl, datosParaBackend).pipe(
      catchError(error => {
        console.error('Error al guardar la calificación:', error);
        // Relanzamos el error para que el componente lo maneje
        return throwError(() => new Error('Error al guardar la calificación.'));
      })
    );
  }

  /**
   * Obtiene la última calificación guardada para un paciente.
   */
  getCalificacionPorPaciente(id_paciente: string): Observable<CalificacionGuardada> {
    
    // Llama al endpoint que creamos: /api/calificaciones/paciente/:id
    return this.http.get<CalificacionGuardada>(`${this.apiUrl}/paciente/${id_paciente}`).pipe(
      catchError(error => {
        console.error(`Error al obtener calificación para paciente ID: ${id_paciente}`, error);
        return throwError(() => error); // Relanza el error
      })
    );
  }
  // -----------------------------

}