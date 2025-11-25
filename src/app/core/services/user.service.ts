import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  create(user: any): Observable<any> {
    return this.http.post(this.API_URL, user);
  }

  update(id: number, user: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}