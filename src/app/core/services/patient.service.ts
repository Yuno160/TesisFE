import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse  } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {Patient} from '../models/Patient';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  url = 'http://localhost:3000/api/pacientes';
  
  constructor(private http: HttpClient) { }

  getPatients(): Observable<any>{
    return this.http.get(this.url);
  }

deletePatient(carnet_identidad: string): Observable<any> {
    console.log('Eliminando paciente con carnet:', carnet_identidad);
    
    return this.http.delete(`${this.url}/delete/${carnet_identidad}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          // Convertimos el error 409 en una respuesta válida para manejar las dependencias
          return of({
            ...error.error,
            status: error.status,
            isConflict: true
          });
        }
        // Para otros errores, los propagamos normalmente
        return throwError(() => error);
      })
    );
  }


  savePatient(patient: Patient):Observable<any>{
    console.log('Datos enviados al servidor:', patient);
    return this.http.post(this.url, patient);

  }


  getPacienteById(id: string): Observable<Patient> { // <-- 2. CAMBIO DE NOMBRE
    
    // Llama al endpoint, ej: .../api/pacientes/123
    return this.http.get<Patient>(`${this.url}/id/${id}`).pipe(
      catchError(error => {
        console.error(`Error al obtener paciente con ID: ${id}`, error);
        
        // <-- 3. SINTAXIS MODERNA DE ERROR
        // Esto relanza el error para que el componente (CalificacionComponent)
        // pueda saber que algo salió mal.
        return throwError(() => new Error('Error al obtener datos del paciente.'));
      })
    );
  }

  
editPatient(carnet_identidad: string, patient: Patient): Observable<{success: boolean, message?: string, data?: Patient}> {
    // Verificación de datos antes de enviar
    console.log('Enviando datos para actualización:', {
        originalCi: carnet_identidad,
        newData: patient
    });

    return this.http.put<{success: boolean, message?: string, data?: Patient}>(
        `${this.url}/edit/${carnet_identidad}`,
        patient
    ).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error en editPatient:', error);
            
            // Manejo detallado de errores HTTP
            let errorMessage = 'Error al actualizar el paciente';
            
            if (error.status === 400) {
                errorMessage = error.error.message || 'Datos inválidos para la actualización';
            } else if (error.status === 404) {
                errorMessage = 'Paciente no encontrado';
            } else if (error.status === 500) {
                errorMessage = error.error.message || 'Error interno del servidor';
            }

            // Retorna un observable con el formato esperado
            return throwError(() => ({
                success: false,
                message: errorMessage,
                status: error.status
            }));
        })
    );
}

  searchPatient(carnetIdentidad: string): Observable<any> {
    return this.http.get(`${this.url}/search/${carnetIdentidad}`);
  }
  
// --- AÑADE ESTA NUEVA FUNCIÓN ---
  /**
   * Obtiene un paciente por su Carnet de Identidad.
   * (Usado por EditPatientComponent)
   */
  getPacienteByCarnet(carnet: string): Observable<Patient> {
    // Llama al nuevo endpoint: .../api/pacientes/ci/23423423
    return this.http.get<Patient>(`${this.url}/ci/${carnet}`).pipe(
      catchError(error => {
        console.error(`Error al obtener paciente con Carnet: ${carnet}`, error);
        return throwError(() => error);
      })
    );
  }
}