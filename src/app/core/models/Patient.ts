export interface Patient {
  id_paciente?: number; // <-- Añadido
  nombre: string;
  carnet_identidad: string;
  edad: number;
  telefono?: string; // El '?' indica que es opcional
  direccion?: string; // Opcional
  genero?: 'Masculino' | 'Femenino' | 'Otro'; // Opcional
  antecedentes_medicos?: string; // Opcional
  code?: string; // Opcional
  fecha_registro?: string; // <-- Añadido (parece que también lo devuelve tu backend)
  ya_calificado?: 0 | 1; // <-- Añadido (o puedes usar 'boolean' si transformas el 0/1)
}
  