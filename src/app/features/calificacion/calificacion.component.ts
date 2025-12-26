import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CifNode } from '../../core/models/Cif-code';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { CalificacionService } from '../../core/services/calificacion.service';
import { Patient } from '../../core/models/Patient';
import { ReservaService } from 'src/app/core/services/reserva.service';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit {

  calificacionForm: FormGroup;
  public searchTerm: string = '';
  reservaId: string | null = null;
  
  // Variable para guardar el paciente
  public paciente: any; // Usamos any para poder acceder a prediccion_ia_grado sin errores de tipo
  public isLoading: boolean = true;
  public errorMessage: string = '';

  // --- VARIABLES PARA LA AUDITORÍA (IA vs DOCTOR) ---
  mostrarModalAuditoria: boolean = false;
  conflictoDetectado: boolean = false;
  mensajeAuditoria: string = '';
  colorAuditoria: string = ''; // 'danger', 'warning', 'success'

  // Datos para mostrar en el modal
  gradoDoctor: string = '';     // El resultado que calcula tu sistema experto
  gradoIA: string = '';         // El resultado que traemos de la BD
  
  // Variable para almacenar el resultado textual (Ej: "GRAVE")
  resultado_global: string = ''; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PatientService,
    private calificacionService: CalificacionService,
    private cdr: ChangeDetectorRef,
    private reservaService: ReservaService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.reservaId = navigation.extras.state['reservaId'];
    }
  }

  ngOnInit(): void {
    console.log("ReservaID", this.reservaId);
    this.calificacionForm = this.fb.group({
      pacienteId: [null, Validators.required],
      observaciones: [''],
      cifCodes: this.fb.array([]) 
    });

    this.loadPacienteData();
  }

  // --- LÓGICA DE CARGA DE PACIENTE ---
  loadPacienteData(): void {
    const pacienteId = this.route.snapshot.paramMap.get('id');

    if (!pacienteId) {
      this.errorMessage = 'No se proporcionó un ID de paciente.';
      this.isLoading = false;
      return;
    }

    this.pacienteService.getPacienteById(pacienteId).subscribe({
      next: (data) => {
        this.paciente = data;
        
        // Guardamos lo que dijo la IA (si existe)
        this.gradoIA = this.paciente.prediccion_ia_grado || 'NO DISPONIBLE';
        
        // Ponemos el ID del paciente en el formulario
        this.calificacionForm.patchValue({
          pacienteId: this.paciente.id_paciente
        });
        
        this.isLoading = false;
        console.log("Datos Paciente Cargados. IA predijo:", this.gradoIA);
      },
      error: (err) => {
        console.error('Error al obtener paciente:', err);
        this.errorMessage = 'Error al cargar los datos del paciente. ' + (err.error?.message || '');
        this.isLoading = false;
      }
    });
  }

  // --- HELPER: CONVERTIR TEXTO A NÚMERO PARA COMPARAR ---
  obtenerValorGrado(grado: string): number {
    if (!grado) return 0;
    const g = grado.toUpperCase();
    if (g.includes('LIGERO') || g.includes('LIGERA')) return 1;
    if (g.includes('MODERADO') || g.includes('MODERADA')) return 2;
    if (g.includes('GRAVE')) return 3;
    if (g.includes('COMPLETO') || g.includes('COMPLETA')) return 4;
    return 0;
  }

  // =========================================================================
  // MODIFICACIÓN CLAVE: INTERCEPTAMOS EL GUARDADO
  // =========================================================================
  
  // 1. Este es el método que llama el botón "Guardar" del HTML
  guardarCalificacion(): void {
    console.log("--- BOTÓN GUARDAR PRESIONADO ---");

    if (this.calificacionForm.invalid) {
      this.calificacionForm.markAllAsTouched();
      return;
    }

    // PASO 1: ¡Recalcular SIEMPRE basándose en lo que hay AHORA!
    this.calcularGradoDoctorTemporal(); 

    // PASO 2: Asignar el valor recién calculado a la variable del modal
    this.gradoDoctor = this.resultado_global;

    // Debug para ver si cambió
    console.log(`COMPARACIÓN FINAL: Doctor [${this.gradoDoctor}] vs IA [${this.gradoIA}]`);

    // PASO 3: Verificar si hay IA
    if (this.gradoIA === 'NO DISPONIBLE' || !this.gradoIA) {
      this.enviarDatosAlBackend(); 
      return;
    }

    // PASO 4: Comparar (usando los valores frescos)
    const valorDoc = this.obtenerValorGrado(this.gradoDoctor);
    const valorIA = this.obtenerValorGrado(this.gradoIA);
    const diferencia = Math.abs(valorDoc - valorIA);

    if (diferencia === 0) {
      this.conflictoDetectado = false;
      this.colorAuditoria = 'success';
      this.mensajeAuditoria = '✅ Consistencia Excelente. Su diagnóstico coincide con la evidencia IA.';
    } else if (diferencia === 1) {
      this.conflictoDetectado = true;
      this.colorAuditoria = 'warning';
      this.mensajeAuditoria = '⚠️ Discrepancia Leve entre su criterio y los documentos históricos.';
    } else {
      this.conflictoDetectado = true;
      this.colorAuditoria = 'danger';
      this.mensajeAuditoria = '🚨 ADVERTENCIA CRÍTICA. Su calificación difiere significativamente de la evidencia documental.';
    }

    // PASO 5: Mostrar Modal y Forzar actualización de vista
    this.mostrarModalAuditoria = true;
    this.cdr.detectChanges(); // <--- Esto es vital para que Angular refresque el texto
  }
  // 2. Método auxiliar para simular el grado si no viene del sistema experto
  // En calificacion.component.ts

  calcularGradoDoctorTemporal() {
    this.resultado_global = 'LIGERO'; // Valor por defecto
    
    // Obtenemos todos los controles del array
    const controles = this.cifCodesArray.controls;
    
    // Variables para detectar la severidad más alta encontrada
    let maxSeveridad = 0; // 0=Nada, 1=Ligero, 2=Moderado, 3=Grave, 4=Completo

    console.log(`🧮 Analizando ${controles.length} códigos seleccionados...`);

    controles.forEach(control => {
      // Leemos la descripción y el código, lo pasamos a mayúsculas para buscar fácil
      const texto = (control.value.descripcion || '').toUpperCase();
      const codigo = (control.value.codigo || '').toUpperCase();
      
      console.log(`   -> Analizando: ${codigo} - ${texto}`);

      // Buscamos palabras clave
      if (texto.includes('COMPLETO') || texto.includes('COMPLETA')) {
        maxSeveridad = Math.max(maxSeveridad, 4);
      } 
      else if (texto.includes('GRAVE')) {
        maxSeveridad = Math.max(maxSeveridad, 3);
      } 
      else if (texto.includes('MODERADO') || texto.includes('MODERADA')) {
        maxSeveridad = Math.max(maxSeveridad, 2);
      }
      else if (texto.includes('LIGERO') || texto.includes('LIGERA')) {
        maxSeveridad = Math.max(maxSeveridad, 1);
      }
    });

    // Asignamos el resultado final basado en la severidad más alta encontrada
    switch (maxSeveridad) {
      case 4:
        this.resultado_global = 'COMPLETO';
        break;
      case 3:
        this.resultado_global = 'GRAVE';
        break;
      case 2:
        this.resultado_global = 'MODERADO';
        break;
      case 1:
        this.resultado_global = 'LIGERO';
        break;
      default:
        // Si hay códigos pero no dicen nada específico, usamos lógica de cantidad
        if (controles.length >= 3) this.resultado_global = 'MODERADO';
        else this.resultado_global = 'LIGERO';
        break;
    }

    console.log(`✅ VEREDICTO FINAL (Basado en texto): ${this.resultado_global}`);
  }

  // 3. Método para cerrar el modal (Botón "Revisar")
  cerrarModal() {
    console.log("🔄 Doctor decidió revisar. Reseteando cálculos previos...");
    
    // 1. Cerramos el modal visualmente
    this.mostrarModalAuditoria = false;

    // 2. LIMPIEZA DE MEMORIA (Tu idea clave)
    // Borramos el resultado anterior para que no se quede "pegado"
    this.gradoDoctor = '';
    this.resultado_global = ''; 
    this.conflictoDetectado = false;
    this.mensajeAuditoria = '';
    this.colorAuditoria = '';

    // Nota: NO borramos 'cifCodesArray' para que el doctor pueda editar 
    // sobre lo que ya tenía, en lugar de buscar todo de nuevo.
  }

  // 4. Método para confirmar (Botón "Confirmar y Guardar" del Modal)
  confirmarGuardado() {
    this.mostrarModalAuditoria = false;
    this.enviarDatosAlBackend(); // Llamamos al guardado real
  }

  // 5. EL GUARDADO REAL (Tu lógica original movida aquí)
  enviarDatosAlBackend(): void {
    console.log('Enviando al Back-End:', this.calificacionForm.value);
    
    // Agregamos el resultado global al objeto si el backend lo espera
    const datosAGuardar = {
        ...this.calificacionForm.value,
        resultado_global: this.resultado_global // Opcional, si tu backend lo recibe
    };

    this.calificacionService.guardar(datosAGuardar).subscribe({
      next: (respuesta) => {
        console.log('¡Guardado con éxito!', respuesta);
        
        // Manejo de Reserva
        if (respuesta && this.reservaId) {
             console.log("Cerrando reserva:", this.reservaId);
             this.reservaService.marcarComoCompletada(this.reservaId).subscribe(() => {
                console.log('Reserva cerrada');
                this.router.navigate(['/dashboard']);
             });
        } else {
            this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.errorMessage = 'Error al guardar. ' + (err.error?.message || '');
      }
    });
  }

  // =========================================================================
  // RESTO DE MÉTODOS (NO CAMBIAN)
  // =========================================================================

  onTreeSelectionChange(selectedNodes: CifNode[]): void {
    const cifCodesArray = this.calificacionForm.get('cifCodes') as FormArray;
    cifCodesArray.clear();
    selectedNodes.forEach(node => {
      cifCodesArray.push(this.fb.control({ 
        codigo: node.codigo, 
        descripcion: node.descripcion 
      }));
    });
  }

  onSearchTermChange(): void {
    // ...
  }

  removeSelectedCode(codigoToRemove: string): void {
    const cifCodesArray = this.calificacionForm.get('cifCodes') as FormArray;
    const index = cifCodesArray.controls.findIndex(control => 
      (control.value as CifNode).codigo === codigoToRemove
    );

    if (index !== -1) {
      cifCodesArray.removeAt(index);
    }
  }

  onSugerenciasExperto(sugerencias: CifNode[]): void {
    console.log('¡Sugerencias recibidas del asistente!', sugerencias);
    
    // Aquí podrías actualizar el resultado global basado en lo que dice el experto
    // Ejemplo: this.resultado_global = 'GRAVE'; 

    const cifCodesArray = this.calificacionForm.get('cifCodes') as FormArray;
    cifCodesArray.clear();

    sugerencias.forEach(node => {
      cifCodesArray.push(this.fb.control({ 
        codigo: node.codigo, 
        descripcion: node.descripcion || '' 
      }));
    });

    this.cdr.detectChanges();
  }

  get cifCodesArray(): FormArray {
    return this.calificacionForm.get('cifCodes') as FormArray;
  }
}