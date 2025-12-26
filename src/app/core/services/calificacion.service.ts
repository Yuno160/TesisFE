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

  // Nuevo método para llamar al Auditor IA
  analizarDocumentoConIA(archivo: File): Observable<any> {
    const formData = new FormData();
    // 'documento' debe coincidir con lo que pusimos en upload.single('documento') en el backend
    formData.append('documento', archivo);

    // Ajusta la URL si tu backend no está en /api
    // Si usas environment.apiUrl, úsalo aquí también.
    return this.http.post(`http://localhost:3000/api/auditoria/analizar`, formData);
  }

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
analizarMultiplesDocumentos(archivos: File[]): Observable<any> {
    const formData = new FormData();

    // 1. Adjuntar cada archivo al FormData
    // Nota: Usamos el mismo nombre de campo 'archivos' para todos.
    // Esto crea un array de archivos que Multer entenderá en el backend.
    if (archivos && archivos.length > 0) {
      archivos.forEach((archivo) => {
        formData.append('archivos', archivo); 
      });
    }

    // 2. Adjuntar metadatos opcionales (si tu backend los necesita)
    // Por ejemplo, para decirle a la IA que cruce información
    formData.append('contexto', 'expediente_completo');

    // 3. Enviar al Backend
    // Asegúrate de que esta URL sea la correcta en tu API
    return this.http.post(`http://localhost:3000/api/auditoria/analizar-expediente`, formData);
  }
}