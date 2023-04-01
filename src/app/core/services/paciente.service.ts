/* import { Injectable } from '@angular/core';
import {Patient} from '../models/Patient';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  public newpaciente: Patient;
  constructor( private firestore: AngularFirestore) { }

  savePaciente(paciente:Patient){

    this.newpaciente = paciente;

  }

  getPaciente(){
    return this.newpaciente;
  }

  getPacienteDB(){
    return this.firestore.collection('paciente').snapshotChanges();
  }


  createPacienteDB(usuario:Patient){
    return this.firestore.collection('paciente').add(usuario);
  }


  updatePacienteDB(usuario: Patient)
  {
    this.firestore.doc('paciente/' + usuario._id).update(usuario);
  }


  deletePacienteDB($key: string)
  {
    this.firestore.doc('paciente/' + $key).delete();
  }


}
 */