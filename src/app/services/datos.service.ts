import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlServer } from '../utilities/common';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  urlServer: string = urlServer;
  constructor(private http: HttpClient) { }

  obtenerEmpresa():Observable<any>{
    return this.http.get(this.urlServer + '/datos/empresa', {});
  }

  obtenerAseguradora():Observable<any>{
    return this.http.get(this.urlServer + '/datos/aseguradora', {});
  }
}
