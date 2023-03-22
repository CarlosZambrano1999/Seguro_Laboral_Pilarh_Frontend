import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlServer } from '../utilities/common';

@Injectable({
  providedIn: 'root'
})
export class ReclamosService {
  urlServer: string = urlServer;
  constructor(private http: HttpClient) { }

  obtenerReclamosXId(id_reclamo : any):Observable<any>{
    return this.http.get(this.urlServer + `/reclamo/obtener/${id_reclamo}`, {});
  }

  obtenerMonetarios(id_reclamo : any):Observable<any>{
    return this.http.get(this.urlServer + `/reclamo/obtener/monetarios/${id_reclamo}`, {});
  }

  obtenerReferenciales(id_reclamo : any):Observable<any>{
    return this.http.get(this.urlServer + `/reclamo/obtener/referenciales/${id_reclamo}`, {});
  }

  obtenerReembolso(id_reclamo : any):Observable<any>{
    return this.http.get(this.urlServer + `/reclamo/obtener/reembolso/${id_reclamo}`, {});
  }

  obtenerReclamosXUsuario(id_empleado: any){
    return this.http.get(this.urlServer + `/reclamo/obtenerUsuario/${id_empleado}`, {});
  }

  
}
