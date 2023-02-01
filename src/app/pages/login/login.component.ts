import { Component, OnInit } from '@angular/core';
import { urlServer } from 'src/app/utilities/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ModalManager } from 'ngb-modal';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  anio: number = new Date().getFullYear();
  urlServer=urlServer;
  fieldTextType: boolean =  false;
  faEye= faEye;
  faEyeSlash = faEyeSlash;
  sesion = new FormGroup({
    correo: new FormControl ('', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]),
    password: new FormControl('', [Validators.required])
  });

  email = new FormControl('',[Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)])
  
  constructor(private http: HttpClient, private cookieService: CookieService,
              private router: Router, private modal: ModalManager) { }

  ngOnInit(): void {
  }

  login(){
    this.http.post( this.urlServer + `/usuario/login`, this.sesion.value).subscribe((res:any)=>{
      try {
        if(res.message=='succesfully'){
            if(res.rol=='1'){
              const dateNow = new Date();
              dateNow.setHours(dateNow.getHours() + 10);
              this.cookieService.set('token', res.token, dateNow);
              this.cookieService.set('rol', res.rol, dateNow);
              this.router.navigate(['/', 'claims']);
            }else if(res.rol=='2'){
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El usuario solo pueda consultar, ingrese al botón "Consultar"',
                width: 'auto',
                showConfirmButton: true
              });
            }
          this.sesion.reset();
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


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
