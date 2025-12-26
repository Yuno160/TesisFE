import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Imports necesarios (Modelos y Servicios existentes)
import { PatientService } from '../../core/services/patient.service';
import { CalificacionService, CalificacionGuardada } from '../../core/services/calificacion.service';
import { Patient } from '../../core/models/Patient';

// --- NUEVO IMPORT: Servicio de Documentos ---
import { DocumentoServiceService } from '../../core/services/documento-service.service'; 

@Component({
  selector: 'app-ver-calificacion',
  templateUrl: './ver-calificacion.component.html',
  styleUrls: ['./ver-calificacion.component.css']
})
export class VerCalificacionComponent implements OnInit {

  // Variables existentes
  public paciente: Patient;
  public calificacion: CalificacionGuardada;
  public pacienteId: string;
  
  public isLoading: boolean = true;
  public errorMessage: string = '';

  // --- NUEVAS VARIABLES PARA DOCUMENTOS ---
  public listaDocumentos: any[] = [];
  public archivoSeleccionado: File | null = null;
  public tipoDocumento: string = 'Informe Médico'; // Valor por defecto del select
  public isUploading: boolean = false; // Para deshabilitar el botón mientras sube

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PatientService,
    private calificacionService: CalificacionService,
    private documentoService: DocumentoServiceService // <--- Inyectamos el servicio aquí
  ) { }

  ngOnInit(): void {
    // 1. Obtener el ID del paciente de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'No se proporcionó ID de paciente.';
      this.isLoading = false;
      return;
    }
    
    this.pacienteId = id; 

    // 2. Cargar los datos del Paciente
    this.pacienteService.getPacienteById(this.pacienteId).subscribe({
      next: (pacienteData) => {
        this.paciente = pacienteData;
        
        // 3. Una vez que tenemos al paciente, cargamos su calificación
        this.loadCalificacion();

        // 4. NUEVO: Cargamos también los documentos adjuntos
        this.cargarDocumentos();
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar datos del paciente.';
        this.isLoading = false;
      }
    });
  }

  loadCalificacion(): void {
    this.calificacionService.getCalificacionPorPaciente(this.pacienteId).subscribe({
      next: (calificacionData) => {
        this.calificacion = calificacionData;
        this.isLoading = false;
      },
      error: (err) => {
        // Un 404 es normal si no tiene calificación
        if (err.status === 404) {
          this.errorMessage = 'Este paciente aún no tiene una calificación registrada.';
        } else {
          this.errorMessage = 'Error al cargar la calificación.';
        }
        this.isLoading = false;
      }
    });
  }

  getImprimirUrl(): string {
    return `http://localhost:3000/api/carnet/pdf/${this.pacienteId}`;
  }

  // ==========================================
  //      NUEVAS FUNCIONES PARA DOCUMENTOS
  // ==========================================

  // A. Cargar la lista desde el servidor
  cargarDocumentos() {
    // Convertimos el ID a número si tu servicio espera number, o lo dejamos string
    this.documentoService.listarDocumentos(Number(this.pacienteId)).subscribe({
      next: (docs) => {
        this.listaDocumentos = docs;
      },
      error: (err) => {
        console.error('Error al cargar documentos', err);
      }
    });
  }

  // B. Detectar cuando el usuario selecciona un archivo del input
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  // C. Enviar el archivo al Backend
  subirArchivo() {
    if (!this.archivoSeleccionado) return;

    this.isUploading = true; // Activar spinner o deshabilitar botón

    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('id_paciente', this.pacienteId); // Usamos el ID de la URL
    formData.append('tipo_documento', this.tipoDocumento);

    this.documentoService.subirDocumento(formData).subscribe({
      next: (resp) => {
        alert('Documento subido correctamente ✅');
        this.archivoSeleccionado = null; // Limpiar variable
        this.isUploading = false;
        
        // Limpiar el input file visualmente (truco de HTML)
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

        this.cargarDocumentos(); // Recargar la lista para ver el nuevo
      },
      error: (err) => {
        console.error(err);
        alert('Error al subir documento ❌. Verifica el tamaño o el formato.');
        this.isUploading = false;
      }
    });
  }

  // D. Abrir el documento en nueva pestaña
  verDocumento(rutaBackend: string) {
    const url = this.documentoService.getUrlArchivo(rutaBackend);
    window.open(url, '_blank');
  }

  // 1. Helper para la URL de la imagen en el HTML
getFotoUrl(ruta: string): string {
  // Asegúrate de que pacienteService tenga el método getUrlImagen o similar
  // Si no, puedes hacerlo manual aquí:
  return `http://localhost:3000/${ruta.replace(/\\/g, '/')}`;
}

// 2. Evento al seleccionar foto
onFotoSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.subirFotoPerfil(file);
  }
}

// 3. Subir la foto inmediatamente
subirFotoPerfil(file: File) {
  this.pacienteService.subirFotoPerfil(this.pacienteId, file).subscribe({
    next: (resp: any) => {
      alert('Foto de perfil actualizada 📸');
      // Actualizamos la vista localmente para que se vea el cambio al instante
      if (this.paciente) {
        this.paciente.foto_url = resp.foto_url;
      }
    },
    error: (err) => {
      console.error(err);
      alert('Error al subir la foto.');
    }
  });}

}