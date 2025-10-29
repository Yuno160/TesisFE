// src/app/services/cif-code.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CifNode } from '../models/Cif-code';

@Injectable({
  providedIn: 'root' // Disponible en toda la app
})
export class CifCodeService {

  // Ajusta la URL de tu API
  private apiUrl = 'http://localhost:3000/api/cif-codes/tree'; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el árbol completo de códigos CIF.
   */
  getTree(): Observable<CifNode[]> {
    return this.http.get<CifNode[]>(this.apiUrl);
  }
}