import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Patient} from '../models/Patient';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  url = 'http://localhost:3000/patient';
  
  constructor(private http: HttpClient) { }

  getPatients(): Observable<any>{
    return this.http.get(this.url);
  }

  deletePatient(carnet_identidad: string): Observable<any> {
    console.log('Eliminando paciente con carnet:', carnet_identidad);
    return this.http.delete(`${this.url}/delete/${carnet_identidad}`);
}


  savePatient(patient: Patient):Observable<any>{
    console.log('Datos enviados al servidor:', patient);
    return this.http.post(this.url, patient);

  }
  getPatient(carnet_identidad: string): Observable<any>{
    return this.http.get(`${this.url}/carnet/${carnet_identidad}`);
  }
  editPatient(carnet_identidad: string, patient:Patient): Observable<any> {
    // Mostrar los datos que se van a enviar para verificar que son correctos
    console.log('Paciente a actualizar:', patient);
    // Hacer la petición PUT al backend
    return this.http.put(`${this.url}/edit/${carnet_identidad}`, patient);
  }

  searchPatient(carnetIdentidad: string): Observable<any> {
    return this.http.get(`${this.url}/search/${carnetIdentidad}`);
  }
  
}
