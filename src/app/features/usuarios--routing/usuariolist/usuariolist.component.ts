import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/core/services/user.service';
import { UsuarioformComponent } from '../usuarioform/usuarioform.component';

@Component({
  selector: 'app-usuariolist',
  templateUrl: './usuariolist.component.html',
  styleUrls: ['./usuariolist.component.css']
})
export class UsuariolistComponent implements OnInit {
displayedColumns: string[] = ['id', 'nombre', 'usuario', 'rol', 'cargo', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getAll().subscribe(
      data => this.dataSource.data = data,
      error => console.error(error)
    );
  }

  abrirModal(usuario?: any) {
    const dialogRef = this.dialog.open(UsuarioformComponent, {
      width: '500px',
      data: usuario ? { modo: 'Editar', usuario } : { modo: 'Crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarUsuarios(); // Refrescar tabla si hubo cambios
      }
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.delete(id).subscribe(
        () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.cargarUsuarios();
        },
        error => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
      );
    }
  }
}