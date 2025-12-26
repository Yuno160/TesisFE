import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/core/services/patient.service';
import { DocumentoServiceService } from '../../../core/services/documento-service.service';
import { CalificacionService } from 'src/app/core/services/calificacion.service'; 
import Swal from 'sweetalert2';

// RxJS para manejar las subidas simultáneas
import { switchMap, of, forkJoin, catchError } from 'rxjs'; 

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  productoForm: FormGroup;
  titulo = 'AGREGAR PACIENTE';
  id: string | null;
  
  // Variables para FOTO
  fotoSeleccionada: File | null = null;
  previewFoto: string | ArrayBuffer | null = null;
  
  // Variables para DOCUMENTOS (Plural)
  docsSeleccionados: File[] = []; 

  isSaving: boolean = false; 

  // --- VARIABLES IA ---
  resultadoIA: any = null; 
  analizandoIA: boolean = false;

  // --- NUEVA VARIABLE: LISTA DE ZONAS ---
  listaZonas: any[] = [];

  constructor(private fb: FormBuilder,
              private router: Router,
              private _patientService: PatientService,
              private _documentoService: DocumentoServiceService,
              private _calificacionService: CalificacionService,
              private aRouter: ActivatedRoute) {
    
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      carnet_identidad: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      // 1. AÑADIMOS EL CAMPO DE ZONA AL FORMULARIO
      id_zona: ['', Validators.required], 
      edad: ['', Validators.required],
      genero: ['', Validators.required],
      antecedentes_medicos: [''] 
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    // 2. CARGAMOS LAS ZONAS AL INICIAR
    this.cargarZonas();
    this.esEditar();
  }

  // --- NUEVO MÉTODO: CARGAR ZONAS DESDE BACKEND ---
  cargarZonas() {
    this._patientService.getZonas().subscribe({
      next: (data: any) => {
        this.listaZonas = data;
        console.log("📍 Zonas cargadas:", this.listaZonas);
      },
      error: (err) => {
        console.error("Error al cargar zonas:", err);
        // Fallback visual por si el backend falla en desarrollo
        // this.listaZonas = [{id_zona: 1, nombre_zona: 'Zona Norte'}, {id_zona: 6, nombre_zona: 'Zona Rural'}];
      }
    });
  }

  // --- SELECCIÓN DE FOTO ---
  onFotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'error', title: 'Formato Incorrecto', text: 'Solo imágenes (JPG, PNG).' });
      this.resetInput(event);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({ icon: 'warning', title: 'Foto muy pesada', text: 'Máximo 2MB para perfil.' });
      this.resetInput(event);
      return;
    }

    this.fotoSeleccionada = file;
    const reader = new FileReader();
    reader.onload = e => this.previewFoto = reader.result;
    reader.readAsDataURL(file);
  }

  // --- SELECCIÓN MÚLTIPLE DE DOCUMENTOS ---
  onDocsSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error', title: 'Archivo Ignorado', 
          text: `"${file.name}" no es válido. Solo PDF o Imágenes.`, timer: 3000
        });
        continue;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({ icon: 'warning', title: 'Muy Pesado', text: `"${file.name}" excede 5MB.` });
        continue;
      }

      const yaExiste = this.docsSeleccionados.some(d => d.name === file.name && d.size === file.size);
      if (!yaExiste) {
        this.docsSeleccionados.push(file);
      }
    }

    event.target.value = '';
    
    if (this.resultadoIA) {
        this.resultadoIA = null;
        Swal.fire({
            icon: 'info', title: 'Expediente Modificado',
            text: 'Has agregado nuevos documentos. Por favor ejecuta el análisis IA nuevamente.', timer: 3000
        });
    }
  }

  eliminarDoc(index: number) {
    this.docsSeleccionados.splice(index, 1);
    this.resultadoIA = null;
  }

  resetInput(event: any) {
    event.target.value = '';
  }

  // --- CEREBRO IA ---
  analizarDocumentosAhora() {
    if (this.docsSeleccionados.length === 0) return;

    this.analizandoIA = true;

    this._calificacionService.analizarMultiplesDocumentos(this.docsSeleccionados).subscribe({
      next: (res: any) => {
        console.log("🤖 IA Analizó Expediente:", res);
        this.resultadoIA = res.analisis; 
        this.analizandoIA = false;
        
        Swal.fire({
          icon: 'success', title: 'Auditoría Completada',
          text: 'La IA ha revisado el expediente completo.', timer: 2000, showConfirmButton: false
        });
      },
      error: (err: any) => {
        console.error("🔥 Error IA:", err);
        this.analizandoIA = false;
        Swal.fire({ icon: 'error', title: 'Error IA', text: 'No se pudo analizar el expediente.' });
      }
    });
  }

  // --- GUARDAR PACIENTE ---
  agregarPaciente() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched(); 
      Swal.fire({
        icon: 'warning', title: 'Faltan datos',
        text: 'Completa los campos obligatorios (incluyendo la Zona).',
        timer: 2000, showConfirmButton: false
      });
      return;
    }

    this.isSaving = true; 

    const PATIENT: any = {
      nombre: this.productoForm.get('nombre')?.value,
      carnet_identidad: this.productoForm.get('carnet_identidad')?.value,
      edad: Number(this.productoForm.get('edad')?.value), 
      telefono: this.productoForm.get('telefono')?.value,
      direccion: this.productoForm.get('direccion')?.value,
      // 3. CAPTURAMOS EL ID_ZONA (NUEVO)
      id_zona: Number(this.productoForm.get('id_zona')?.value),
      genero: this.productoForm.get('genero')?.value,
      antecedentes_medicos: this.productoForm.get('antecedentes_medicos')?.value,
      id_paciente: this.id ? Number(this.id) : undefined,
      
      // Datos IA
      prediccion_ia_grado: this.resultadoIA ? this.resultadoIA.grado_sugerido : null,
      prediccion_ia_confianza: this.resultadoIA ? this.resultadoIA.confianza : null,
      prediccion_ia_justificacion: this.resultadoIA ? this.resultadoIA.justificacion : null
    };

    let peticionPrincipal;
    if (this.id !== null) {
      peticionPrincipal = this._patientService.savePatient(PATIENT); 
    } else {
      peticionPrincipal = this._patientService.createPaciente(PATIENT);
    }

    peticionPrincipal.pipe(
      switchMap((resp: any) => {
        console.log("✅ Paciente guardado:", resp);
        const pacienteId = this.id ? Number(this.id) : (resp.pacienteId || resp.id || resp.id_paciente);
        
        const uploads = [];

        // Subir Foto
        if (this.fotoSeleccionada) {
          uploads.push(this._patientService.subirFotoPerfil(pacienteId, this.fotoSeleccionada));
        }

        // Subir Documentos
        this.docsSeleccionados.forEach(file => {
            const formData = new FormData();
            formData.append('archivo', file);
            formData.append('id_paciente', pacienteId.toString());
            const tipo = file.type === 'application/pdf' ? 'Informe Médico' : 'Imagen/Estudio';
            formData.append('tipo_documento', tipo);
            uploads.push(this._documentoService.subirDocumento(formData));
        });

        return uploads.length > 0 ? forkJoin(uploads) : of(null);
      }),
      catchError(err => {
        this.isSaving = false;
        this.manejarErroresBackend(err);
        throw err;
      })
    ).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: '¡Expediente Guardado!',
          text: 'Paciente registrado correctamente.',
          confirmButtonColor: '#3085d6', confirmButtonText: 'Ir a la lista'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/customers']);
          }
        });
      },
      error: (e) => { console.error("Detenido por error"); }
    });
  }

  manejarErroresBackend(err: any) {
    if (err.status === 409) {
      Swal.fire({ icon: 'warning', title: 'Paciente Duplicado', text: err.error.message || 'Carnet ya registrado.' });
      return;
    }
    if (err.status === 400 && err.error.errors) {
      let lista = '<ul style="text-align: left;">';
      err.error.errors.forEach((e: string) => lista += `<li>• ${e}</li>`);
      lista += '</ul>';
      Swal.fire({ icon: 'error', title: 'Datos Inválidos', html: `Corrige:<br>${lista}` });
      return;
    }
    Swal.fire({ icon: 'error', title: 'Error del Servidor', text: 'No se pudo guardar.', footer: `Código: ${err.status}` });
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'EDITAR PACIENTE';
      this._patientService.buscarPorCarnet(this.id).subscribe(data => {
        this.productoForm.patchValue({
          nombre: data.nombre,
          carnet_identidad: data.carnet_identidad,
          telefono: data.telefono,
          direccion: data.direccion,
          // 4. AL EDITAR, CARGAMOS LA ZONA GUARDADA
          id_zona: data.id_zona, 
          edad: data.edad,
          genero: data.genero,
          antecedentes_medicos: data.antecedentes_medicos
        });
      });
    }
  }
}