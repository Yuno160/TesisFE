export interface Pregunta {
    id_pregunta: number;
    texto_pregunta: string;
    categoria_cif: string;
    tipo_respuesta: 'Texto' | 'Escala' | 'Sí/No';
}