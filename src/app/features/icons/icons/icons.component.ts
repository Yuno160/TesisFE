 import { Component,ViewChild, OnInit, OnDestroy} from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

import { saveAs } from 'file-saver';
import { ReportesService } from '../../../core/services/reportes.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit, OnDestroy {

  // Variables para guardar las instancias de los gráficos (para poder destruirlos si sales de la pag)
  charts: any = {};
  
  urlNiveles = '';
  urlZonas = '';
  urlAreas = '';
  urlProductividad = '';
  urlVencimientos = '';
  pacienteSeleccionadoId: string = '';
  mesSeleccionado: string = ''; 
  fechaInicio: string = '';
  fechaFin: string = '';
  isLoading: boolean = false

  urlNivelesTabla: string = '';
  urlZonasTabla: string = '';
  urlAreasTabla: string = '';
  urlProductividadTabla: string = '';


  constructor(private reportesService: ReportesService) {} 

ngOnInit(): void {
    // 1. Configuramos URLs de descarga
    this.urlNiveles = this.reportesService.getPdfUrl('niveles');
    this.urlZonas = this.reportesService.getPdfUrl('zonas');
    this.urlAreas = this.reportesService.getPdfUrl('areas');
    this.urlProductividad = this.reportesService.getPdfUrl('productividad');
    this.urlVencimientos = this.reportesService.getPdfUrl('vencimientos');

    // B) NUEVO: URLs para Reportes de TABLA/DETALLE
    // Usamos el método getPdfTablaUrl que creamos en el servicio
    this.urlNivelesTabla = this.reportesService.getPdfTablaUrl('niveles');
    this.urlZonasTabla = this.reportesService.getPdfTablaUrl('zonas');
    this.urlAreasTabla = this.reportesService.getPdfTablaUrl('areas');
    this.urlProductividadTabla = this.reportesService.getPdfTablaUrl('productividad');

    // 2. Cargamos los gráficos
    this.cargarGraficoNiveles();
    this.cargarGraficoZonas();
    this.cargarGraficoAreas();
    this.cargarGraficoProductividad();
  }

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

  // --- LÓGICA DE CARGA DE GRÁFICOS ---

  cargarGraficoNiveles() {
    this.reportesService.getNivelesGravedad().subscribe(resp => {
      if (resp.ok) {
        this.renderChart('chartNiveles', 'doughnut', resp.chartData, 'Distribución de Gravedad');
      }
    });
  }

  cargarGraficoZonas() {
    this.reportesService.getDistribucionZonas().subscribe(resp => {
      if (resp.ok) {
        this.renderChart('chartZonas', 'pie', resp.chartData, 'Pacientes por Zona');
      }
    });
  }

  cargarGraficoAreas() {
    this.reportesService.getDistribucionAreas().subscribe(resp => {
      if (resp.ok) {
        this.renderChart('chartAreas', 'doughnut', resp.chartData, 'Urbana vs Rural');
      }
    });
  }

  cargarGraficoProductividad() {
    this.reportesService.getProductividad().subscribe(resp => {
      if (resp.ok) {
        this.renderChart('chartProductividad', 'bar', resp.chartData, 'Evolución Mensual', true);
      }
    });
  }

  // --- FUNCIÓN GENÉRICA PARA DIBUJAR (DRY - Don't Repeat Yourself) ---
  renderChart(canvasId: string, type: any, data: any, title: string, isBar: boolean = false) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    // Destruir gráfico previo si existe (evita bugs al recargar)
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    this.charts[canvasId] = new Chart(canvas, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: title },
          legend: { position: 'bottom', display: !isBar } // Ocultar leyenda si es barras
        },
        scales: isBar ? { y: { beginAtZero: true, ticks: { stepSize: 1 } } } : {}
      }
    });
  }

  ngOnDestroy() {
    // Limpieza de memoria
    Object.values(this.charts).forEach((chart: any) => chart.destroy());
  }
}