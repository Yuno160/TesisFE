 import { Component,ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { Chart } from 'angular-highcharts';
import { saveAs } from 'file-saver';
import { ReportesService } from '../../../core/services/reportes.service';
@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent {
// Variables para los inputs (bindings)
  pacienteSeleccionadoId: string = '';
  mesSeleccionado: string = ''; // Formato "YYYY-MM"
  fechaInicio: string = '';
  fechaFin: string = '';
  isLoading: boolean = false

  // Inyectamos el servicio (cuando exista)
  // constructor(private reportesService: ReportesService) {}
  constructor(private reportesService: ReportesService) {} // Por ahora

  generarReportePaciente() {
    if (!this.pacienteSeleccionadoId) {
      alert('Por favor, ingrese un carnet de paciente.'); // O un toast de error
      return;
    }
    
    this.isLoading = true;
    console.log('Solicitando reporte para paciente:', this.pacienteSeleccionadoId);

    this.reportesService.getReportePaciente(this.pacienteSeleccionadoId).subscribe({
      next: (pdfBlob: Blob) => {
        // Usa file-saver para descargar el PDF
        saveAs(pdfBlob, `reporte-paciente-${this.pacienteSeleccionadoId}.pdf`);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al descargar el reporte:', error);
        alert('Error al generar el reporte. Verifique el carnet o intente más tarde.');
        this.isLoading = false;
      }
    });
  }

  generarReporteTotal() {
    this.isLoading = true;
    console.log('Solicitando reporte total...');

    this.reportesService.getReporteTotal().subscribe(
      (pdfBlob: Blob) => {
        saveAs(pdfBlob, 'reporte-total-pacientes.pdf');
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al descargar el reporte total:', error);
        this.isLoading = false;
      }
    );
  }

  generarReporteDiario() {
    this.isLoading = true;
    console.log('Solicitando reporte diario...');

    this.reportesService.getReporteDiario().subscribe({
      next: (pdfBlob: Blob) => {
        saveAs(pdfBlob, 'reporte-calificaciones-diario.pdf');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al descargar el reporte diario:', error);
        alert('Error al generar el reporte diario.');
        this.isLoading = false;
      }
    });
  }

  generarReporteMensual() {
    if (!this.mesSeleccionado) {
      alert('Por favor, seleccione un mes.');
      return;
    }
    this.isLoading = true;
    console.log('Solicitando reporte para el mes:', this.mesSeleccionado);

    this.reportesService.getReporteMensual(this.mesSeleccionado).subscribe({
      next: (pdfBlob: Blob) => {
        saveAs(pdfBlob, `reporte-calificaciones-${this.mesSeleccionado}.pdf`);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al descargar el reporte mensual:', error);
        alert('Error al generar el reporte mensual.');
        this.isLoading = false;
      }
    });
  }

  generarReporteRango() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Por favor, seleccione una fecha de inicio y fin.');
      return;
    }
    this.isLoading = true;
    console.log('Generando reporte entre', this.fechaInicio, 'y', this.fechaFin);
    // Próximamente: this.reportesService.getReporteRango(this.fechaInicio, this.fechaFin)...
    alert('Función de Reporte por Rango aún no implementada.');
    this.isLoading = false;
  }
}