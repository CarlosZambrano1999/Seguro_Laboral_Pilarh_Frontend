import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { faEye, faPen, faSearch, faTrash, faCalculator  } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { DatosService } from 'src/app/services/datos.service';
import { ReclamosService } from 'src/app/services/reclamos.service';
import { urlServer } from 'src/app/utilities/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  resultados : boolean = false;
  public load: boolean = false;
  public page: number = 1;
  id_reclamo_modal: String = "";
  reclamos : any = [];
  monedas : any = [];
  factura : any = {};
  urlServer = urlServer

  //iconos
  faEdit  =  faPen;
  faDel = faTrash;
  faEye = faEye;
  faSearch = faSearch;
  faCalc= faCalculator;

  //formularios
  filtro = new FormGroup({
    nombre : new FormControl(''),
    fecha_inicial : new FormControl(''),
    fecha_final : new FormControl('')
  })

  reembolso = new FormGroup({
    total_cubierto: new FormControl('', [Validators.required]),
    deducible: new FormControl('', [Validators.required]),
    coaseguro: new FormControl('', [Validators.required]),
    observaciones: new FormControl('', [Validators.required]),
    moneda: new FormControl('', [Validators.required]) 
  })

  constructor(private datosService: DatosService, private http: HttpClient,
              public modal: NgbModal, private router:Router, private reclamoService: ReclamosService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loading();
    this.obtenerReclamos();
    this.obtenerMonedas();
  }

  //Funcion para mostrar spinner mientras cargan datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  filtrarReclamos(){
    console.log('filtro', typeof(this.filtro.get('fecha_inicial')?.value))
    this.http.post(this.urlServer + `/reclamo/filtrar`, this.filtro.value).subscribe( (res:any)=>{
      try {
        if(res.data.length>0){
          this.reclamos = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
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

  //función para obtener los reclamos
  obtenerReclamos(){
    this.datosService.obtenerReclamos().subscribe( res=>{
      try {
        if(res.data.length>0){
          this.reclamos = res.data;
          this.resultados = true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  //función para obtener los reembolsos
  obtenerReembolso(id: any){
    this.reclamoService.obtenerReembolso(id).subscribe( res=>{
      try {
        this.factura = res.data;
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

  //abrir modal
  openModal(modal: any,id_reclamo: any){
    this.id_reclamo_modal = id_reclamo
    this.modal.open(modal);
  }

  //modal del reembolso
  modalReembolso(modal: any,id_reclamo: any){
    this.obtenerReembolso(id_reclamo);
    this.modal.open(modal);
  }
  inhabilitarReclamo(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/reclamo/inhabilitar/${this.id_reclamo_modal}`, {},header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'El reclamo ha sido inhabilitado exitosamente',
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
        this.loading();
        this.modal.dismissAll();
        this.filtrarReclamos();
      } catch (error) {
        console.log(error);
      }
    });
  }

  enviarReclamo(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(this.urlServer + `/reclamo/enviar/${this.id_reclamo_modal}`, {}, header).subscribe( (res: any)=>{
      try {
        if(res.message=="Successfully"){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'El reclamo ha sido enviado y notificado al usuario',
            width: 'auto',
            showConfirmButton: false,
            timer: 1500
          });
          this.obtenerReclamos();
          this.loading();
          this.modal.dismissAll();
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
    })
  }

  reembolsar(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.authService.getToken()}`)
    }
    this.http.post(urlServer + `/reclamo/reembolsar/${this.id_reclamo_modal}`,this.reembolso.value, header).subscribe( (res:any)=>{
      try {
        if(res.message=='Successfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Documentos monetarios agregados correctamente',
            width: 'auto',
            showConfirmButton: false,
            timer: 2000
          });
          this.reembolso.reset();
          this.obtenerReclamos();
          this.modal.dismissAll();
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
