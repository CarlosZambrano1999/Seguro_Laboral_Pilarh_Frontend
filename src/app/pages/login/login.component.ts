import { Component, OnInit } from '@angular/core';
import { urlServer } from 'src/app/utilities/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  correo = new FormControl('', [Validators.required]);

  email = new FormControl('',[Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)])
  
  constructor(private http: HttpClient, private cookieService: CookieService,
              private router: Router, public modal: NgbModal) { }

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

  openModal(modal: any){
    this.modal.open(modal, {backdrop: 'static', keyboard: false});
  }
  
  consultar(){
    this.http.post(urlServer + `/usuario/consultar/${this.correo.value}`, {}).subscribe((res:any) =>{
      try {
        if(res.message=='succesfully'){
          Swal.fire({
            icon: 'success',
            title: 'Exitoso',
            text: 'Por favor revise su correo electrónico',
            width: 'auto',
            showConfirmButton: true
          });
          const dateNow = new Date();
          dateNow.setHours(dateNow.getHours() + 10);
          this.cookieService.set('myClaims', this.correo.value!, dateNow);
          this.correo.reset();
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

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
