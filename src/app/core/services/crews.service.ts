import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrewsService {

  url = 'http://localhost:3000/crews';
   constructor(private http: HttpClient) {}
 
   getCrews(): Observable<any>{
     return this.http.get(this.url);
   }

   
}
