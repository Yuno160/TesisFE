import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Patient } from '../models/Patient'; // Asegúrate que la ruta sea correcta
import { catchError,map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // Ajusta si tu API tiene otro prefijo, pero esto debe coincidir con tu backend
  url = 'http://localhost:3000/api/pacientes';
  
  constructor(private http: HttpClient) { }

  // 1. OBTENER TODOS
  getPatients(): Observable<any>{
    return this.http.get(this.url);
  }

  // 2. CREAR (Este es el que usaba tu componente AddPatient)
  createPaciente(patient: Patient): Observable<any> {
    console.log('Enviando a CREAR:', patient);
    // IMPORTANTE: Asegúrate que en tu backend la ruta sea POST /api/pacientes/crear
    // Si tu backend usa la raíz POST /, cambia esto a `this.http.post(this.url, patient)`
    return this.http.post(`${this.url}/crear`, patient); 
  }

  // 3. EDITAR
  savePatient(patient: Patient): Observable<any> {
      // Este método parece ser un 'update' camuflado o un 'create' genérico.
      // Para evitar confusiones, redirijamos al update si tiene ID, o create si no.
      if (patient.carnet_identidad) {
         return this.editPatient(patient.carnet_identidad, patient);
      }
      return this.createPaciente(patient);
  }

  // 4. ACTUALIZAR (PUT)
  editPatient(carnet_identidad: string, patient: Patient): Observable<any> {
    console.log('Enviando a EDITAR:', { carnet_identidad, patient });
    return this.http.put(`${this.url}/edit/${carnet_identidad}`, patient).pipe(
        catchError(this.handleError)
    );
  }

  // 5. ELIMINAR
  deletePatient(carnet_identidad: string): Observable<any> {
    console.log('Eliminando:', carnet_identidad);
    return this.http.delete(`${this.url}/delete/${carnet_identidad}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          // Conflicto de dependencias (tiene citas)
          return of({ ...error.error, status: error.status, isConflict: true });
        }
        return throwError(() => error);
      })
    );
  }

  // 6. BUSQUEDAS
  buscarPorCarnet(carnet: string): Observable<any> {
  return this.getPacienteByCarnet(carnet).pipe(
    map((res: any) => {
      // Si viene envuelto en 'data', lo sacamos. Si no, devolvemos tal cual.
      return res.data || res;
    })
  );
}

getPacienteByCarnet(carnet: string): Observable<any> {
    // Asegúrate de que esta ruta coincida con tu backend (/ci/:carnet)
    return this.http.get<any>(`${this.url}/ci/${carnet}`).pipe(
      map(response => {
        // ✨ AUTO-CORRECCIÓN:
        // Si el backend devuelve { success: true, data: {...} }, extraemos 'data'.
        // Si devuelve el paciente directo, lo dejamos pasar.
        return response.data || response;
      }),
      catchError(error => {
        console.error(`Error al buscar Carnet: ${carnet}`, error);
        return throwError(() => error);
      })
    );
  }

  getPacienteById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.url}/id/${id}`).pipe(
      catchError(error => throwError(() => new Error('Error al obtener por ID.')))
    );
  }

  // 7. FOTOS
  subirFotoPerfil(idPaciente: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('idPaciente', idPaciente.toString());
    
    // Asegúrate que tu backend tenga esta ruta en pacienteRoutes.js
    return this.http.post(`${this.url}/foto`, formData);
  }

  getUrlImagen(rutaBackend: string): string {
    if (!rutaBackend) return 'assets/img/default-avatar.png'; // Imagen por defecto si no hay
    return `http://localhost:3000/${rutaBackend.replace(/\\/g, '/')}`;
  }

  // --- MANEJO DE ERRORES CENTRALIZADO ---
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error cliente:', error.error.message);
    } else {
      console.error(`Error servidor ${error.status}:`, error.error);
    }
    // Propagamos el error para que el componente lo atrape (y muestre SweetAlert)
    return throwError(() => error);
  }

  getZonas(): Observable<any> {
    // Esto llama a tu backend: 
    return this.http.get(`${this.url}/zonas`);
  }

  

  
}