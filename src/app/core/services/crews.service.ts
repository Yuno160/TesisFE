import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrewsService {

  apiUrl = 'http://localhost:3000/api/crews';
   constructor(private http: HttpClient) {}
 
   
   getAllActive(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

   
}
