export interface Patient {
    nombre: string;
    carnet_identidad: string;
    edad: number;
    telefono?: string;
    direccion?: string;
    genero?: 'Masculino' | 'Femenino' | 'Otro';
    antecedentes_medicos?: string;
  }
  