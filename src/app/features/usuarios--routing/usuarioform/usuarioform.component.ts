import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-usuarioform',
  templateUrl: './usuarioform.component.html',
  styleUrls: ['./usuarioform.component.css']
})
export class UsuarioformComponent implements OnInit {
userForm: FormGroup;
  modo: 'Crear' | 'Editar';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UsuarioformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { 
    this.modo = data.modo;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      usuario: ['', Validators.required],
      password: [''], // Es opcional en edición
      rol: ['', Validators.required],
      cargo: ['']
    });

    // Si es modo Editar, cargamos los datos
    if (this.modo === 'Editar' && this.data.usuario) {
      this.userForm.patchValue(this.data.usuario);
      // La contraseña no se carga por seguridad
    } else {
      // Si es crear, la contraseña es obligatoria
      this.userForm.get('password')?.setValidators([Validators.required]);
    }
  }

  guardar() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.modo === 'Crear') {
      this.userService.create(userData).subscribe(
        () => {
          this.snackBar.open('Usuario creado', 'OK', { duration: 3000 });
          this.dialogRef.close(true);
        },
        err => this.snackBar.open('Error al crear: ' + err.error.message, 'Cerrar', { duration: 3000 })
      );
    } else {
      // Modo Editar
      const id = this.data.usuario.id;
      this.userService.update(id, userData).subscribe(
        () => {
          this.snackBar.open('Usuario actualizado', 'OK', { duration: 3000 });
          this.dialogRef.close(true);
        },
        err => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
      );
    }
  }
}