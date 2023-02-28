import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosService } from 'src/app/services/datos.service';
import { ReclamosService } from 'src/app/services/reclamos.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {

  id_reclamo: string = "";
  mes = new Intl.DateTimeFormat('es-ES', {month: 'long'}).format(new Date());
  anio: number = new Date().getFullYear();
  dia: number = new Date().getDate();
  empresa : any = {};
  aseguradora : any = {};
  reclamo: any = {};
  monetarios: any = [];
  referenciales: any = [];

  constructor(private rutaActiva: ActivatedRoute, private datosService: DatosService,
              private reclamosService: ReclamosService) { }

  ngOnInit(): void {
    this.id_reclamo= this.rutaActiva.snapshot.params['id_reclamo']; 
    console.log('reclamo', this.id_reclamo);
    this.obtenerAseguradora();
    this.obtenerEmpresa();
    this.obtenerReclamo();
    this.obtenerMonetarios();
    this.obtenerReferenciales();
  }

    //función para cargar la Aseguradora
    obtenerAseguradora(){
      this.datosService.obtenerAseguradora().subscribe(res =>{
        try {
          this.aseguradora = res.data;
        } catch (error) {
          console.log(error);
        }
      })
    }
  
    //función para cargar la Empresa
    obtenerEmpresa(){
      this.datosService.obtenerEmpresa().subscribe(res =>{
        try {
          this.empresa = res.data;
        } catch (error) {
          console.log(error);
        }
      })
    }

  //funcion para obetener reclamos
  obtenerReclamo(){
    this.reclamosService.obtenerReclamosXId(this.id_reclamo).subscribe( res=>{
      try {
          this.reclamo = res.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para obetener monetarios
  obtenerMonetarios(){
    this.reclamosService.obtenerMonetarios(this.id_reclamo).subscribe( res=>{
      try {
          this.monetarios = res.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

  //funcion para obetener referenciales
  obtenerReferenciales(){
    this.reclamosService.obtenerReferenciales(this.id_reclamo).subscribe( res=>{
      try {
          this.referenciales = res.data;
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

}
