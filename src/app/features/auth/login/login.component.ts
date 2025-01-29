import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm!: UntypedFormGroup;
    loading!: boolean;
    nombre_usuario: string = '';
    contrasena: string = '';
    error: string = '';

    constructor(private router: Router,
        private titleService: Title,
        private notificationService: NotificationService,
        private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.titleService.setTitle('angular-material-template - Login');
        this.authenticationService.logout();
        this.createForm();
    }

    onSubmit(): void {
        this.error = ''; // Reiniciar el mensaje de error
        this.loading = true; // Iniciar el estado de carga
    
        this.login(this.nombre_usuario, this.contrasena);
      }

    private createForm() {
        const savedUserEmail = localStorage.getItem('savedUserEmail');

        this.loginForm = new UntypedFormGroup({
            email: new UntypedFormControl(savedUserEmail, [Validators.required, Validators.email]),
            password: new UntypedFormControl('', Validators.required),
            rememberMe: new UntypedFormControl(savedUserEmail !== null)
        });
    }
    private login(nombre_usuario: string, contrasena: string): void {
        this.authenticationService.login(nombre_usuario, contrasena).subscribe({
          next: (response) => {
            // Guardar el token en localStorage
            localStorage.setItem('token', response.token);
    
            
    
            // Redirigir según el tipo de usuario
            if (response.tipo_usuario === 'administrador') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            console.error(err);
            this.error = err.error?.error || 'Credenciales incorrectas'; // Mensaje de error del backend
            this.loading = false; // Terminar el estado de carga
          },
          complete: () => {
            this.loading = false; // Finalizar el estado de carga al completar
          }
        });
      }
}
