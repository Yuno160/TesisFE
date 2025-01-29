export interface Reserva {
    id_cita?: number;  // Se mantiene opcional porque se autoincrementa en la base de datos
    id_paciente: number;  // Relación con la tabla paciente
    id_profesional: number;  // Relación con la tabla profesional
    fecha_hora: Date | string;  // Puede ser Date o string dependiendo del formato
    estado: 'Agendada' | 'Completada' | 'Cancelada';  // Valores según el enum definido en MySQL
    nombre?: string; // Nuevo campo para el nombre del paciente
    carnet_identidad?: string; // Nuevo campo para el DNI del paciente
    edad?: number;
    telefono?: number; // Nuevo campo para el teléfono del paciente
    direccion?: string; // Nuevo campo para la dirección del paciente
  }
  