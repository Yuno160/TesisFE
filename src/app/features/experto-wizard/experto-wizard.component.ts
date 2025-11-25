import { Component, EventEmitter, Output } from '@angular/core';
import { CifNode } from '../../core/models/Cif-code'; // Asegúrate que la ruta a tu modelo sea correcta
// Importa el NUEVO servicio y las interfaces
import { ExpertoService, PreguntaExperto, RespuestaExperto } from '../../core/services/experto.service'; // Asegúrate que la ruta a tu servicio sea correcta

@Component({
  selector: 'app-experto-wizard',
  templateUrl: './experto-wizard.component.html',
  styleUrls: ['./experto-wizard.component.css']
})
export class ExpertoWizardComponent {

  @Output() sugerenciasGeneradas = new EventEmitter<CifNode[]>();

  public areaSeleccionada: string | null = null;
  public preguntas: PreguntaExperto[] = []; // Para guardar las preguntas cargadas

  // Guarda las respuestas del usuario, ej: { 1: 'ligero', 2: 'grave' }
  public respuestas = new Map<number, string>(); 
  
  public isLoadingPreguntas: boolean = false; // <-- ¡Aquí está la propiedad que faltaba!
  
  // Opciones estáticas para el tipo 'calificador'
  public opcionesCalificador = [
    { valor: 'ninguno', texto: 'No hay problema (0-4%)' },
    { valor: 'ligero', texto: 'Problema LIGERO (5-24%)' },
    { valor: 'moderado', texto: 'Problema MODERADO (25-49%)' },
    { valor: 'grave', texto: 'Problema GRAVE (50-95%)' },
    { valor: 'completo', texto: 'Problema COMPLETO (96-100%)' },
    { valor: 'na', texto: 'No aplicable / Sin especificar' } // Simplificado
  ];

  constructor(
    private expertoService: ExpertoService // Inyecta el servicio del experto
  ) { }

  /**
   * Se llama al seleccionar el área principal (Paso 1).
   * Carga las preguntas del Sistema Experto desde el BE.
   */
  onAreaChange(): void {
    console.log('Área seleccionada:', this.areaSeleccionada);
    this.preguntas = [];
    this.respuestas.clear();

    if (this.areaSeleccionada) {
      this.isLoadingPreguntas = true;
      
      // Llamamos al servicio para traer las preguntas
      // Usamos 'this.areaSeleccionada' (ej. 'b1') como categoría padre
      this.expertoService.getPreguntas(this.areaSeleccionada).subscribe({
        next: (preguntas) => {
          this.preguntas = preguntas;
          this.isLoadingPreguntas = false;
        },
        error: (err) => {
          console.error(`Error al cargar preguntas para ${this.areaSeleccionada}:`, err);
          this.isLoadingPreguntas = false;
        }
      });
    }
  }

  /**
   * Guarda la respuesta del usuario en el Map cada vez que cambia un calificador.
   */
  onRespuestaChange(preguntaId: number, respuesta: string): void {
    this.respuestas.set(preguntaId, respuesta);
    console.log('Respuestas actuales:', this.respuestas);
  }

  /**
   * Se llama al presionar "Sugerir Códigos".
   * Envía las respuestas al BE para la evaluación.
   */
  finalizarWizard(): void {
    // 1. Convertir el Map de respuestas al formato Array que espera el BE
    const respuestasArray: RespuestaExperto[] = [];
    this.respuestas.forEach((respuesta, pregunta_id) => {
      respuestasArray.push({ pregunta_id, respuesta });
    });

    if (respuestasArray.length === 0) {
      console.warn('No se ha respondido ninguna pregunta.');
      return;
    }

    // 2. Llamar al servicio de evaluación
    this.expertoService.evaluar(respuestasArray).subscribe({
      next: (codigosSugeridos) => {
        // 3. Emitir los códigos al componente padre (CalificacionComponent)
        console.log('ASISTENTE: ¡EMITIENDO sugerencias!', codigosSugeridos);
        this.sugerenciasGeneradas.emit(codigosSugeridos);
      },
      error: (err) => {
        console.error('Error al evaluar las respuestas:', err);
      }
    });
  }
}