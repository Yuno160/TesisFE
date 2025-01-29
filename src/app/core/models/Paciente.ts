export interface Patient {
    nombre: string;
    carnet: string;
    edad: number;
    telefono?: string;
    direccion?: string;
    genero?: 'Masculino' | 'Femenino' | 'Otro';
    antecedentes_medicos?: string;
  }
  
