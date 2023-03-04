import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { DatosService } from 'src/app/services/datos.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { urlServer } from 'src/app/utilities/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.css']
})
export class ReclamoComponent implements OnInit {

  agencias : any = [];
  empleados : any = [];
  pacientes : any = [];
  tipos : any = [];
  monedas : any = [];
  doc_money : any = [];
  doc_referencial : any = [];
  resultados : boolean = true;
  faDel = faTrash;
  urlServer = urlServer;
  valorTotal : any = 0;


  /*Formularios */
  empleado = new FormGroup({
    agencia: new FormControl ('', [Validators.required]),
    empleado: new FormControl('', [Validators.required]),
    paciente: new FormControl('', [Validators.required])
  });
  
  monetarios = new FormGroup({
    tipo : new FormControl('', [Validators.required]),
    numero : new FormControl('', [Validators.required]),
    descripcion : new FormControl('', [Validators.required]),
    valor : new FormControl('', [Validators.required]),
    moneda : new FormControl('', [Validators.required])
  })

  referenciales = new FormGroup({
    cantidad : new FormControl('', [Validators.required]),
    descripcion : new FormControl('', [Validators.required])
  })
  constructor(private empleadoService: EmpleadosService, private datosService: DatosService, 
              private authService: AuthService, private http: HttpClient, private route: Router ) { }

  ngOnInit(): void {
    this.obtenerAgencias();
    this.obtenerTipos();
    this.obtenerMonedas();
    this.monetarios.get('moneda')?.setValue('1');
  }

  //función para obtener Agencias
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

  //función para obtener Tipos de documentos
  obtenerTipos(){
    this.datosService.obtenerTipos().subscribe( res=>{
      try {
        this.tipos = res.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

  //función para obtener monedas
  obtenerMonedas(){
    this.datosService.obtenerMonedas().subscribe( res=>{
      try {
        this.monedas = res.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

  //función para obtener Empleados
  obtenerEmpleados(){
    this.empleadoService.obtenerEmpleadosxAgencia(this.empleado.get('agencia')?.value).subscribe( res=>{
      try {
        this.empleados = res.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

   //funcion para convertir
   convertir(valor_reclamo : any){
    const valor_final= parseFloat(valor_reclamo).toFixed(2);
    return valor_final;
  }

  //función para obtener pacientes
  obtenerPacientes(){
    this.empleadoService.obtenerPacientes(this.empleado.get('empleado')?.value).subscribe( res=>{
      try {
        this.pacientes = res.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

  addDocMoney(){
    const valorP =  parseFloat(this.monetarios.get('valor')?.value!).toFixed(2);
    this.monetarios.get('valor')?.setValue(valorP);
    this.doc_money.push(this.monetarios.value);
    this.monetarios.reset();
    this.monetarios.get('moneda')?.setValue('1');
    this.valorTotal = 0;
    for(let i=0; i<this.doc_money.length; i++){
      this.valorTotal= this.sumar(this.valorTotal, parseFloat(this.doc_money[i].valor))
    }
  }
  sumar(a:number, b:number){
    console.log(typeof(a), typeof(b))
    return a+b;
  }

  addDocReferencial(){
    this.doc_referencial.push(this.referenciales.value);
    this.referenciales.reset();
  }

  deleteReferencial(i: any){
    this.doc_referencial.splice(i,1);
  }

  deleteMonetario(i: any){
    this.doc_money.splice(i,1);
  }

  convertirMoneda(id_moneda : any){
    return this.monedas[id_moneda-1].moneda;
  }

  procesar(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    let id_reclamo = 0;
    this.http.post(urlServer + `/reclamo/crearReclamo/${this.empleado.get('paciente')?.value}`, {}, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          id_reclamo = res.data.id_reclamo;
          this.procesarMonetarios(res.data.id_reclamo);
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Reclamos creados correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
          this.route.navigate(['/', 'record']);
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
    this.empleado.reset();
  }

  procesarMonetarios(id_reclamo : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/reclamo/monetarios/${id_reclamo}`,this.doc_money, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          this.procesarReferenciales(id_reclamo);
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Documentos monetarios agregados correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
          this.doc_money = [];
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

  procesarReferenciales(id_reclamo : any){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    if(this.doc_referencial.length>0){
      this.http.post(urlServer + `/reclamo/referenciales/${id_reclamo}`,this.doc_referencial, header).subscribe( (res:any)=>{
        try {
          if(res.message=='Successfully'){
            Swal.fire({
              icon: 'success',
              title: 'Exitoso',
              text: 'Documentos referenciales agregados correctamente',
              width: 'auto',
              showConfirmButton: false,
              timer: 2000
            });
            this.doc_referencial = [];
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

}
