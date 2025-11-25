import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Servicio de Autenticación
import { AuthenticationService } from '../../../core/services/auth.service';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true; // Para alternar la visibilidad de la contraseña

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Redirigir si ya está logueado
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']); // O tu ruta principal
    }

    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { usuario, password } = this.loginForm.value;

    this.authService.login(usuario, password).subscribe({
      next: (data) => {
        this.isLoading = false;
        // Mensaje de éxito
        this.snackBar.open(`¡Bienvenido/a, ${data.usuario.nombre}!`, 'OK', { 
          duration: 3000,
          panelClass: ['success-snackbar'] 
        });
        
        this.router.navigate(['/dashboard']); // Redirigir al Dashboard
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        
        let msg = 'Error de conexión con el servidor';
        if (error.status === 401) msg = 'Usuario o contraseña incorrectos';
        if (error.status === 404) msg = 'Usuario no encontrado o inactivo';

        this.snackBar.open(msg, 'Cerrar', { 
          duration: 4000, 
          panelClass: ['error-snackbar'] 
        });
      }
    });
  }
}
