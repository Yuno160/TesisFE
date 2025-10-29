
export interface CifNode {
  id: number;
  codigo: string;
  descripcion: string;
  parent_code: string | null;
  categoria_nombre: string;
  children: CifNode[]; // La clave está aquí: un array de sí mismo
}

// Creamos una interfaz para el evento
export interface NodeToggleEvent {
  node: CifNode;
  checked: boolean;
}