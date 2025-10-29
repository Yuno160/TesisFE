import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Imports necesarios
import { PatientService } from '../../core/services/patient.service';
import { CalificacionService, CalificacionGuardada } from '../../core/services/calificacion.service';
import { Patient } from '../../core/models/Patient';

@Component({
  selector: 'app-ver-calificacion',
  templateUrl: './ver-calificacion.component.html',
  styleUrls: ['./ver-calificacion.component.css']
})
export class VerCalificacionComponent implements OnInit {
// Variables para guardar los datos
  public paciente: Patient;
  public calificacion: CalificacionGuardada;
  public pacienteId: string;
  
  public isLoading: boolean = true;
  public errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private pacienteService: PatientService,
    private calificacionService: CalificacionService) { }

  ngOnInit(): void {
// 1. Obtener el ID del paciente de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'No se proporcionó ID de paciente.';
      this.isLoading = false;
      return;
    }
    
    this.pacienteId = id; // Guardamos el ID para el botón de imprimir

    // 2. Cargar los datos del Paciente
    this.pacienteService.getPacienteById(this.pacienteId).subscribe({
      next: (pacienteData) => {
        this.paciente = pacienteData;
        
        // 3. Una vez que tenemos al paciente, cargamos su calificación
        this.loadCalificacion();
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
        // Un 404 es normal si no tiene calificación, no es un "error"
        if (err.status === 404) {
          this.errorMessage = 'Este paciente aún no tiene una calificación registrada.';
        } else {
          this.errorMessage = 'Error al cargar la calificación.';
        }
        this.isLoading = false;
      }
    });
  }

  /**
   * Genera la URL para el botón de imprimir PDF.
   * ¡¡NOTA: Aún no hemos creado este endpoint en el BE!!
   */
  getImprimirUrl(): string {
    // Este endpoint (Paso 1B) es nuestro próximo trabajo.
    // Por ahora, lo dejamos apuntando a donde DEBERÍA estar.
    return `http://localhost:3000/api/carnet/pdf/${this.pacienteId}`;
  }
}
