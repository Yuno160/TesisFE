
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core'; // Añadimos Input, OnChanges, SimpleChanges
import { Observable, EMPTY, of } from 'rxjs'; // Añadimos 'of'
import { catchError, map } from 'rxjs/operators';
import { CifNode } from '../../core/models/Cif-code';
import { CifCodeService } from '../../core/services/cif-code.service';
import { NodeToggleEvent } from '../../core/models/Cif-code'; // Importamos la interfaz


@Component({
  selector: 'app-cif-tree',
  templateUrl: './cif-tree.component.html',
  styleUrls: ['./cif-tree.component.css']
})
export class CifTreeComponent implements OnInit, OnChanges { // Implementamos OnChanges

  public originalTree: CifNode[] = []; // Guardamos el árbol completo sin filtrar
  public filteredTree$: Observable<CifNode[]>; // El árbol que se muestra (filtrado)
  public errorMsg: string = '';

  @Input() searchTerm: string = ''; // Nuevo: Recibe el término de búsqueda

  @Output() selectionUpdate = new EventEmitter<CifNode[]>(); 

  private selectedNodes = new Map<string, CifNode>();

  constructor(private cifCodeService: CifCodeService) { }

  ngOnInit(): void {
    // Cargamos el árbol una sola vez
    this.cifCodeService.getTree().pipe(
      catchError(err => {
        this.errorMsg = 'Error al cargar los datos: ' + err.message;
        return EMPTY;
      })
    ).subscribe(data => {
      this.originalTree = data; // Guardamos la data original
      this.applyFilter(); // Aplicamos el filtro inicial (vacío)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si el searchTerm cambia, volvemos a aplicar el filtro
    if (changes['searchTerm'] && !changes['searchTerm'].firstChange) {
      this.applyFilter();
    }
  }

  private applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredTree$ = of(this.originalTree); // Si no hay término, muestra todo
      return;
    }

    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    
    // Función recursiva para filtrar el árbol
    const filterNodes = (nodes: CifNode[]): CifNode[] => {
      return nodes
        .map(node => ({ ...node })) // Copiamos el nodo para no mutar el original
        .filter(node => {
          const match = 
            node.codigo.toLowerCase().includes(lowerCaseSearchTerm) ||
            node.descripcion.toLowerCase().includes(lowerCaseSearchTerm);

          const filteredChildren = filterNodes(node.children); // Filtra los hijos
          
          // Un nodo coincide si:
          // 1. Él mismo coincide, O
          // 2. Alguno de sus hijos coincide (y lo mostramos expandido)
          if (match || filteredChildren.length > 0) {
            node.children = filteredChildren; // Asigna los hijos filtrados
            // Aquí podríamos forzar isExpanded = true si el nodo original está oculto por filtro
            // Lo manejaremos en TreeNode para la visibilidad.
            return true;
          }
          return false;
        });
    };

    this.filteredTree$ = of(filterNodes(this.originalTree));
  }


  public onNodeToggle(event: NodeToggleEvent): void {
    // ... (este método no cambia)
    if (event.checked) {
      this.selectedNodes.set(event.node.codigo, event.node);
    } else {
      this.selectedNodes.delete(event.node.codigo);
    }

    const selectedList = Array.from(this.selectedNodes.values());
    this.selectionUpdate.emit(selectedList);
  }
}