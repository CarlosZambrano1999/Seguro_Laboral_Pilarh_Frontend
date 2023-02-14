import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faPen, faTrash, faCircleArrowUp, faPeopleGroup, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { urlServer } from 'src/app/utilities/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  resultados : boolean = true;
  public load: boolean = false;
  public page: number = 1;
  agencias : any = [];
  seleccion : any = [];
  empleados: any = [];
  pacientes: any = [];
  resultPacientes : boolean = true;
  datosEmpleado : any = {};
  habilitado : any = {};
  urlServer = urlServer;
  id_Empleado : string = '';

  //iconos
  faEdit  =  faPen;
  faDel = faTrash;
  faAct = faCircleArrowUp;
  faGente = faPeopleGroup;
  faSearch = faSearch;


  //Formularios
  newEmpleado = new FormGroup({
    certificado : new FormControl('', [Validators.required, Validators.maxLength(10)]),
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/) ]),
    agencia: new FormControl ('', [Validators.required])
  });

  editEmpleado = new FormGroup({
    id_usuario: new FormControl ('', [Validators.required]),
    certificado : new FormControl('', [Validators.required]),
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]),
    agencia: new FormControl ('', [Validators.required])
  });

  filtro = new FormGroup({
    nombre : new FormControl(''),
    id_agencia : new FormControl('')
  })

  newPaciente = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  })


  constructor(private empleadoService: EmpleadosService, public modal: NgbModal,
              private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerAgencias();
    this.obtenerEmpleados();
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
          this.seleccion = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para obtener los empleados
  obtenerEmpleados(){
    this.empleadoService.obtenerEmpleados().subscribe( res=>{
      try {
        if(res.data.length>0){
          this.empleados = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

   //funcion que muestra modal para agregar un nuevo empleado
   agregarEmpleado(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para guardar nuevo empleado
  guardarEmpleado(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/empleado/crearEmpleado`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Nuevo usuario creado Correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
          this.modal.dismissAll();
          this.newEmpleado.reset();
          this.loading();
          this.obtenerEmpleados();
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
      } catch (error) {
        console.log(error);
      }
    });
  }

   //funcion que muestra el modal para editar un empleado
   editarEmpleado(emp : any, modal : any){
    this.editEmpleado.reset();
    this.datosEmpleado = emp;
    this.editEmpleado.get('id_usuario')?.setValue(emp.id_usuario);
    this.editEmpleado.get('certificado')?.setValue(emp.certificado);
    this.editEmpleado.get('nombre')?.setValue(emp.nombre);
    this.editEmpleado.get('correo')?.setValue(emp.correo);
    this.editEmpleado.get('agencia')?.setValue(emp.id_agencia)
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

   //funcion para guardar los cambios en usuario
   confirmarEdicion(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/empleado/editarEmpleado`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Usuario Editado Correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
          this.modal.dismissAll();
          this.loading();
          this.obtenerEmpleados();
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
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para comparar los datos del usuario antes y despues de editar
  objCompare(obj1: any, obj2: any){
    if (obj1.nombre === obj2.nombre &&  obj1.correo === obj2.correo && obj1.agencia.toString()===obj2.id_agencia.toString()){
        return true;
    }else{
      return false;
    }
  }

  //Funcion que muestra modal para habilitar o inhabilitar un usuario
  habEmpleado(emp : any,modal : any){
    this.habilitado=emp;
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion para habilitar o inhabilitar empleado
  habilitarEmpleado(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/usuario/habilitar`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'El usuario ha sido habilitado',
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
        this.obtenerEmpleados();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para inhabilitar empleado
  inhabilitarEmpleado(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/usuario/inhabilitar`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'El usuario ha sido inhabilitado',
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
        this.obtenerEmpleados();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para filtrar empleados
  filtrarEmpleados(){
    this.http.post(this.urlServer + `/empleado/filtrar`, this.filtro.value).subscribe( (res:any)=>{
      try {
        if(res.data.length>0){
          this.empleados = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //función para obtener pacientes
  obtenerPacientes(id_empleado :any){
    this.empleadoService.obtenerPacientes(id_empleado).subscribe( res=>{
      try {
        if(res.data.length>0){
          this.pacientes = res.data;
          this.resultPacientes = true;
        }else{
          this.resultPacientes = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que muestra modal para habilitar o inhabilitar un usuario
  modPacientes(emp : any,modal : any){
    this.id_Empleado=emp.id_usuario;
    this.obtenerPacientes(emp.id_usuario);
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //crear pacientes
  crearPaciente(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/empleado/crearPaciente/${this.id_Empleado}`, this.newPaciente.value, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'El paciente ha sido creado',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
          this.obtenerPacientes(this.id_Empleado);
          this.newEmpleado.reset();
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
      } catch (error) {
        console.log(error);
      }
    });
  }
}
