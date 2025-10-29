// src/app/tree-node/tree-node.component.ts

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'; // Añadimos OnChanges, SimpleChangesimport { CifNode } from '../../core/models/Cif-code';
import { NodeToggleEvent } from '../../core/models/Cif-code'; // ¡Esto puede darte un error circular, mira abajo!
import { CifNode } from '../../core/models/Cif-code';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent implements OnChanges { // Implementamos OnChanges

  @Input() node: CifNode;
  @Input() searchTerm: string = ''; // Nuevo: recibe el término de búsqueda
  @Output() nodeToggled = new EventEmitter<NodeToggleEvent>();

  public isExpanded: boolean = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Si el término de búsqueda cambia, ajustamos la expansión
    if (changes['searchTerm'] && this.searchTerm) {
      // Si hay un término de búsqueda, expandimos el nodo si él mismo o sus hijos coinciden
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      const nodeMatches = 
        this.node.codigo.toLowerCase().includes(lowerCaseSearchTerm) ||
        this.node.descripcion.toLowerCase().includes(lowerCaseSearchTerm);
      
      // Si el nodo actual coincide O tiene hijos filtrados, lo expandimos
      if (nodeMatches || (this.node.children && this.node.children.length > 0)) {
        this.isExpanded = true;
      } else {
        this.isExpanded = false; // Colapsar si no hay búsqueda o no coincide
      }
    } else if (changes['searchTerm'] && !this.searchTerm) {
        // Si el searchTerm se vacía, colapsamos los nodos por defecto
        this.isExpanded = false;
    }
  }

  get hasChildren(): boolean {
    return this.node.children && this.node.children.length > 0;
  }

  toggleExpand(): void {
    if (this.hasChildren) {
      this.isExpanded = !this.isExpanded;
    }
  }

  onToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    this.nodeToggled.emit({ node: this.node, checked: checked });
  }

  onChildToggle(event: NodeToggleEvent): void {
    this.nodeToggled.emit(event);
  }
}