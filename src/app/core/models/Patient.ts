export class Patient {
    _id:string;
    nombre:String;
    carnet:string;
    telefono:Number;
    direccion: String ;
    edad: Number;
    cif: String;

    constructor ( id: string,nombre:string, carnet:string, telefono: number, direccion: string, edad: number, codCif: string){
        this._id = id;
        this.nombre = nombre;
        this.carnet = carnet;
        this.telefono = telefono;
        this.direccion = direccion;
        this.edad = edad;
        this.cif = codCif;

    }

    }
    