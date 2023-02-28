import { Component, OnInit } from '@angular/core';
import { faPen, faTrash, faEye, faSearch, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { DatosService } from 'src/app/services/datos.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ReclamosService } from 'src/app/services/reclamos.service';
import { urlServer } from 'src/app/utilities/common';

@Component({
  selector: 'app-usuario-reclamo',
  templateUrl: './usuario-reclamo.component.html',
  styleUrls: ['./usuario-reclamo.component.css']
})
export class UsuarioReclamoComponent implements OnInit {

  resultados : boolean = false;
  public load: boolean = false;
  public page: number = 1;
  id_reclamo_modal: String = "";
  reclamos : any = [];
  monedas : any = [];
  factura : any = {};
  usuario : any = {};
  urlServer = urlServer

  //iconos
  faEdit  =  faPen;
  faDel = faTrash;
  faEye = faEye;
  faSearch = faSearch;
  faCalc= faCalculator;

  constructor(public modal: NgbModal, private reclamoService: ReclamosService,
              private datosService: DatosService, private empleadoService: EmpleadosService,
              private cookieService: CookieService) { }

  ngOnInit(): void {
    //Obtiene al usuario logueado
    console.log('correo', this.cookieService.get('myClaims'))
    this.empleadoService.obtenerEmpleado(this.cookieService.get('myClaims')).subscribe( res=>{
      try {
        this.usuario = res.data;
        console.log('usuario', this.usuario)
        this.obtenerReclamos();
      } catch (error) {
        console.log(error);
      }
    });
   
    this.loading();
    
  }

  //Funcion para mostrar spinner mientras cargan datos
  loading(){
    this.load = false;
    setTimeout(() => {
      this.load = true;
    }, 1500);
  }

  //funcion para convertir
  convertir(valor_reclamo : any){
    const valor_final= parseFloat(valor_reclamo).toFixed(2);
    return valor_final;
  }

  //modal del reembolso
  modalReembolso(modal: any,id_reclamo: any){
    this.obtenerReembolso(id_reclamo);
    this.modal.open(modal);
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

  //función para obtener los reclamos
  obtenerReclamos(){
    this.reclamoService.obtenerReclamosXUsuario(this.usuario.id_usuario).subscribe( (res:any)=>{
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

}
