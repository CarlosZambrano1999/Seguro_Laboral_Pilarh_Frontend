import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faCoffee, faFileLines } from '@fortawesome/free-solid-svg-icons';
/*import { NgbModal } from '@ng-bootstrap/ng-bootstrap';*/

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  faFieLines = faFileLines;
  constructor() {
  }


  /*salir(modal:any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }*/

  ngOnInit(): void {
  }

}
