import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Patient} from '../models/Patient';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  url = 'http://localhost:4000/api/patient/';
  constructor(private http: HttpClient) { }

  getPatients(): Observable<any>{
    return this.http.get(this.url);
  }

  deletePatient(id:string):Observable<any>{
    return this.http.delete(this.url + id);
  }

  savePatient(patient: Patient):Observable<any>{
    return this.http.post(this.url, patient);

  }
  getPatient(id: string): Observable<any>{
    return this.http.get(this.url + id);
  }
}
