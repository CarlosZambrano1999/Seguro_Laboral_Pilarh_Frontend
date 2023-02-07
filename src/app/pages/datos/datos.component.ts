import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdministradorService } from 'src/app/services/adiministrador.service';
import { urlServer } from 'src/app/utilities/common';
import { faPen, faTrash, faArrowCircleUp, faKey} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { DatosService } from 'src/app/services/datos.service';
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {

  resultados : boolean = true;
  datosAdmin : any = {};
  habilitado: any = {};
  administradores : any = [];
  empresa : any = {};
  aseguradora : any = {};
  urlServer = urlServer;
  empty : any = {};
  insurance : any = {};
  fieldTextType: boolean =  false;
  fieldTextType2: boolean =  false;

  public load: boolean = false;

  //iconos
  faEdit = faPen;
  faDel = faTrash;
  faAct = faArrowCircleUp;
  faKey = faKey;
  //nuevo administrador
  newAdministrador = new FormGroup({
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)])
  });

  //formulario editar administrador
  editAdministrador = new FormGroup({
    id_usuario: new FormControl ('', [Validators.required]),
    nombre: new FormControl ('', [Validators.required, Validators.pattern(/^([A-Za-zñáéíóú]+[\s]*)+$/)]),
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)])
  });

  //formulario editar Aseguradora
  editAseguradora = new FormGroup({
    id_aseguradora: new FormControl('',[Validators.required]),
    aseguradora:  new FormControl('',[Validators.required]),
    lugar:  new FormControl('',[Validators.required]),
    empleado:  new FormControl('',[Validators.required]),
    titulo:  new FormControl('',[Validators.required]),
    cargo :  new FormControl('',[Validators.required])
  })

  //formulario editar Empresa
  editEmpresa = new FormGroup({
    id_empresa: new FormControl('',[Validators.required]),
    empresa:  new FormControl('',[Validators.required]),
    lugar:  new FormControl('',[Validators.required]),
    empleado:  new FormControl('',[Validators.required]),
    titulo:  new FormControl('',[Validators.required]),
    cargo :  new FormControl('',[Validators.required]),
    poliza: new FormControl('',[Validators.required])
  })

  //formulario para contraseña
  sesion = new FormGroup({
    correo: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    confirmPassword: new FormControl('',[Validators.required])
  })

  constructor(private administradorService: AdministradorService, private http: HttpClient,
              public modal: NgbModal, private authService: AuthService, private datosService: DatosService) { }

  ngOnInit(): void {
    this.loading();
    this.obtenerAdministradores();
    this.obtenerAseguradora();
    this.obtenerEmpresa();
  }

   //funcion que muestra spinner al cargar datos
   loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //función para cargar la Aseguradora
  obtenerAseguradora(){
    this.datosService.obtenerAseguradora().subscribe(res =>{
      try {
        if(res.message="Succesfully"){
          this.aseguradora = res.data;
          this.resultados=true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  //función para cargar la Empresa
  obtenerEmpresa(){
    this.datosService.obtenerEmpresa().subscribe(res =>{
      try {
        if(res.message="Succesfully"){
          this.empresa = res.data;
          this.resultados=true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  //función para cargar los adminsitradores
  obtenerAdministradores(){
    this.administradorService.obtenerAdministradores().subscribe(res =>{
      try {
        if(res.message="Succesfully"){
          this.administradores = res.data;
          this.resultados=true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

  //Funcion que llama al modal para agregar administrador
  agregarAdministrador(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }
  //Funcion que guarda el nuevo administrador que se agrega desde el modal
  guardarAdmin(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/administrador/crearAdministrador`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Nuevo administrador creado correctamente',
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
        this.newAdministrador.reset();
        this.loading();
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que llama al modal para editar usuario (Carga los datos anteriores)
  editarAdministrador(admin : any , modal : any){
    this.editAdministrador.reset();
    this.datosAdmin = admin;
    this.editAdministrador.get('id_usuario')?.setValue(admin.id_usuario);
    this.editAdministrador.get('nombre')?.setValue(admin.nombre);
    this.editAdministrador.get('correo')?.setValue(admin.correo);
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

   //Funcion para guardar los cambios al editar adminnistrador
   confirmarEdicion(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/administrador/editarAdministrador`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Administrador Editado Correctamente',
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
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

   //funcion que muestra modal para habilitar administrador
   habAdmin(emp : any,modal : any){
    this.habilitado=emp;
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //funcion que confirma la habilitacion del administrador
  habilitarAdministrador(emp : any){
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
            text: 'El administrador ha sido habilitado',
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
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

   //funcion que confirma la inhabilitacion del administrador
   inhabilitarAdministrador(emp : any){
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
            text: 'El Administrador ha sido inhabilitado',
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
        this.obtenerAdministradores();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion para comparar los datos del administrador antes y despues de editar
  objCompare(obj1: any, obj2: any){
    if (obj1.id_usuario === obj2.id_usuario && obj1.nombre === obj2.nombre &&  obj1.correo === obj2.correo){
        return true;
    };
    return false;
  }

  //Funcion que llama al modal para editar Aseguradora (Carga los datos anteriores)
  editarAseguradora(admin : any , modal : any){
    this.editAseguradora.reset();
    this.insurance = admin;
    this.editAseguradora.setValue(admin);
    /*this.editAseguradora.get('id_usuario')?.setValue(admin.id_usuario);
    this.editAseguradora.get('nombre')?.setValue(admin.nombre);
    this.editAseguradora.get('correo')?.setValue(admin.correo);*/
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //función para comparar objetos
  objCompadre(objA: any, objB: any){
    let a = JSON.stringify(objA);
    let b = JSON.stringify(objB);
    if(a===b){
      return true;
    }
    return false;
  }

  //Funcion para guardar los cambios al editar aseguradora
  confirmarInsurance(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/datos/editarAseguradora`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Aseguradora Editada Correctamente',
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
        this.obtenerAseguradora();
        this.loading();
      } catch (error) {
        console.log(error);
      }
    });
  }

  //Funcion que llama al modal para editar Empresa (Carga los datos anteriores)
  editarEmpresa(admin : any , modal : any){
    this.editEmpresa.reset();
    this.empty = admin;
    this.editEmpresa.setValue(admin);
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion para guardar los cambios al editar aseguradora
  confirmarEmpty(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/datos/editarEmpresa`, emp, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Aseguradora Editada Correctamente',
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
        this.obtenerEmpresa();
        this.loading();
      } catch (error) {
        console.log(error);
      }
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    this.fieldTextType2 = !this.fieldTextType2;
  }

  //Funcion que llama al modal para actualizar contraseña
  actPassword(admin : any , modal : any){
    this.sesion.reset();
    this.sesion.get('correo')?.setValue(admin.correo);
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion para guardar los cambios al editar aseguradora
  guardarPassword(emp : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    if(this.sesion.get('password')?.value!=this.sesion.get('confirmPassword')?.value){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contraseña y verificar contraseña no coinciden',
        width: 'auto',
        showConfirmButton: true
      });    
    }else{
      this.http.post(urlServer + `/usuario/resetPassword`, emp, header).subscribe( (res:any)=>{
        try {
          if(res.message=='Successfully'){
            Swal.fire({
              icon: 'success',
              title: 'Exitoso',
              text: 'Contraseña actualizada correctamente',
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
          this.obtenerAdministradores();
          this.loading();
        } catch (error) {
          console.log(error);
        }
      });
    }
    
  }

}
