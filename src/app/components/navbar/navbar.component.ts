import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faFileLines, faBookOpen, faUserGroup, faHome, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  faFieLines = faFileLines;
  faLibro= faBookOpen;
  faGrupo = faUserGroup;
  faCasa = faHome;
  faSalir = faRightFromBracket;
  constructor(private router:Router, private cookieService: CookieService,
              public modal: NgbModal) {
  }

  ngOnInit(): void {
  }

  //Funcion para abril modal que confirma el cierre de sesion
  cerrarSesion(modal : any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }

  //Funcion para salir (borra las cookies, cierra la venta modal y redirige al login)
  salir(){
    this.cookieService.deleteAll();
    this.modal.dismissAll();
    this.router.navigate(['/', 'login']);
  }
}
