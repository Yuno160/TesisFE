import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // 1. URL Correcta según tu backend
  private API_URL = 'http://localhost:3000/api/auth'; 

  // BehaviorSubject: Nos permite saber en tiempo real si el usuario está logueado
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    // Al iniciar, leemos si ya hay un usuario guardado en el navegador
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter para obtener el valor actual sin suscribirse
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  /**
   * INICIAR SESIÓN
   * Envía 'usuario' y 'password' al backend.
   */
  login(usuario: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { usuario, password })
      .pipe(map(user => {
        // Si el backend responde con el token y el usuario:
        if (user && user.token) {
          // 2. Guardamos la sesión en el navegador
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          // Avisamos a toda la app que el usuario se conectó
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  /**
   * CERRAR SESIÓN
   */
  logout() {
    // Borramos los datos del navegador
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
    // Redirigimos al Login
    this.router.navigate(['/auth/login']);
  }

  /**
   * OBTENER USUARIO ACTUAL (Datos reales)
   * Devuelve el objeto { id, nombre, rol, token ... }
   */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  /**
   * VERIFICAR SI ES ADMIN
   * Útil para ocultar botones en el HTML
   */
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user && user.usuario && user.usuario.rol === 'ADMIN';
  }

  /**
   * VERIFICAR SI ESTÁ LOGUEADO
   */
  isAuthenticated(): boolean {
    return !!this.currentUserValue; // Devuelve true si existe usuario
  }

  // --- Métodos que no usaremos por ahora (SignUp, Reset) ---
  // Como en tu tesis el admin crea los usuarios, 'signUp' público no es necesario.
  // Los he quitado para limpiar el código, pero podemos agregarlos si el Admin
  // necesita una pantalla para "Crear Usuario".
}