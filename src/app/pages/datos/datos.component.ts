import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdministradorService } from 'src/app/services/adiministrador.service';
import { urlServer } from 'src/app/utilities/common';
import { faPen, faTrash, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {

  resultados : boolean = true;
  datosAdmin : any = {};
  administradores : any = [];
  urlServer = urlServer;

  //iconos
  faEdit = faPen;
  faDel = faTrash;
  faAct = faArrowCircleUp;

  constructor(private administradorService: AdministradorService, private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerAdministradores();
  }

  //función para cargar los adminsitradores
  obtenerAdministradores(){
    this.administradorService.obtenerAdministradores().subscribe(res =>{
      try {
        if(res.message="Succesfully"){
          this.administradores = res.data;
          console.log('admin', this.administradores);
          this.resultados=true;
        }else{
          this.resultados = false;
        }
      } catch (error) {
        console.log(error);
      }
    })
  }

}
