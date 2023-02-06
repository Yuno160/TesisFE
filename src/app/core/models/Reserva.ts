export class Reserva {
    _id:string;
    nombre:String;
    carnet:Number;
    telefono:Number;
    direccion: String;
    fecha: Date;
    hora: String;

    constructor ( id: string,nombre:string, carnet:number, telefono: number, direccion: string, fechaReserva: Date, horareserva: string){
        this._id = id;
        this.nombre = nombre;
        this.carnet = carnet;
        this.telefono = telefono;
        this.direccion = direccion;
        this.fecha = fechaReserva;
        this.hora = horareserva;

    }

    }
    