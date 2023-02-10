import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faPen, faTrash, faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { urlServer } from 'src/app/utilities/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styleUrls: ['./agencias.component.css']
})
export class AgenciasComponent implements OnInit {

  resultados : boolean = true;
  public load: boolean = false;
  public page: number = 1;
  habilitado : any = {};
  comparar: any = {};
  agencias : any = [];
  urlServer = urlServer;
  faEdit  =  faPen;
  faDel = faTrash;
  faAct = faCircleArrowUp

   /*Formularios*/
   newAgencia = new FormGroup({
    nombre : new FormControl('', [Validators.required, Validators.pattern(/^([A-Z,]+[\s]*)+$/)]),
    telefono : new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'),Validators.maxLength(10)]),
  })

  editAgencia = new FormGroup({
    id_agencia : new FormControl('', [Validators.required]),
    nombre : new FormControl('', [Validators.required, Validators.pattern(/^([A-Z,]+[\s]*)+$/)]),
    telefono : new FormControl('', [Validators.required,Validators.pattern('[- +()0-9]+'), Validators.maxLength(10)]),
  })
  
  constructor(private empleadoService : EmpleadosService, private authService : AuthService, 
    public modal: NgbModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerAgencias();
    this.loading();
  }

  //Funcion para mostrar spinner mientras cargan datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //Funcion para obtener las agencias
  obtenerAgencias(){
    this.empleadoService.obtenerAgencias().subscribe( res=>{
      try {
        if(res.data.length>0){
          this.agencias = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion que muestra modal para agregar una agencia
  agregarAgencia(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para guardar una nueva agencia
  guardarAgencia(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/crearAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Nuevo Agencia creada Correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
        }else{
          const mensaje = res.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            width: 'auto',
            showConfirmButton: true
          });
        }
        this.modal.dismissAll();
        this.newAgencia.reset();
        this.loading();
        this.obtenerAgencias();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que muestra modal para editar agencia
  editarAgencia(agen : any, modal : any){
    this.editAgencia.reset();
    this.comparar = agen;
    this.editAgencia.get('id_agencia')?.setValue(agen.id_agencia);
    this.editAgencia.get('nombre')?.setValue(agen.nombre);
    this.editAgencia.get('telefono')?.setValue(agen.telefono);
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para guardar los cambios en una agencia
  confirmarEdicion(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/editarAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Agencia Editado Correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
        }else{
          const mensaje = res.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            width: 'auto',
            showConfirmButton: true
          });
        }
        this.modal.dismissAll();
        this.loading();
        this.obtenerAgencias();
      } catch (error) {
        console.log(error);
      }
    });
  }
   //Funcion que muestra modal para poder habilitar o inhabilitar agencia
   habAgencia(emp : any,modal : any){
    this.habilitado=emp;
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion para habilitar agencia
  habilitarAgencia(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/habilitarAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'La agencia ha sido habilitada',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
        }else{
          const mensaje = res.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            width: 'auto',
            showConfirmButton: true
          });
        }
        this.modal.dismissAll();
        this.loading();
        this.obtenerAgencias();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para inhabilitar agencia
  inhabilitarAgencia(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/agencia/inhabilitarAgencia`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'La agencia ha sido inhabilitada',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
        }else{
          const mensaje = res.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            width: 'auto',
            showConfirmButton: true
          });
        }
        this.modal.dismissAll();
        this.loading();
        this.obtenerAgencias();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para comparar los datos de la agencia antes y despues de editar
  objCompare(obj1: any, obj2: any){
    if (JSON.stringify(obj1) === JSON.stringify(obj2)){
        return true;
    };
    return false;
  }
}
