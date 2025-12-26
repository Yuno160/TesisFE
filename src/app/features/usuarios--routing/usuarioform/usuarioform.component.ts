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
  
  // NUEVO: Variable para almacenar los equipos que vienen del backend
  listaEquipos: any[] = [];

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
    // 1. Cargamos los equipos al iniciar
    this.cargarEquipos();

    this.userForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      usuario: ['', Validators.required],
      password: [''], 
      rol: ['', Validators.required],
      cargo: [''],
      // 2. Agregamos el control para el equipo
      id_equipo: [''] 
    });

    if (this.modo === 'Editar' && this.data.usuario) {
      this.userForm.patchValue(this.data.usuario);
      // El patchValue llenará id_equipo automáticamente si el usuario ya tiene uno
    } else {
      this.userForm.get('password')?.setValidators([Validators.required]);
    }
  }

  // NUEVO: Método para obtener equipos
  cargarEquipos() {
    this.userService.getEquipos().subscribe({
      next: (data) => {
        this.listaEquipos = data;
        console.log('Equipos cargados:', this.listaEquipos);
      },
      error: (err) => console.error('Error cargando equipos', err)
    });
  }

  guardar() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    // Si el rol NO es calificador, limpiamos el id_equipo por seguridad
    if (userData.rol !== 'CALIFICADOR') {
        userData.id_equipo = null;
    }

    if (this.modo === 'Crear') {
      this.userService.create(userData).subscribe(
        () => {
          this.snackBar.open('Usuario creado', 'OK', { duration: 3000 });
          this.dialogRef.close(true);
        },
        err => this.snackBar.open('Error al crear: ' + (err.error?.message || err.message), 'Cerrar', { duration: 3000 })
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