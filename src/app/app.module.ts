import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReclamoComponent } from './pages/reclamo/reclamo.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HistorialComponent } from './pages/historial/historial.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { DatosComponent } from './pages/datos/datos.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AgenciasComponent } from './pages/empleados/agencias/agencias.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsuariosComponent } from './pages/empleados/usuarios/usuarios.component';
import { InformeComponent } from './pages/informe/informe.component';
import { UsuarioReclamoComponent } from './pages/usuario-reclamo/usuario-reclamo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    ReclamoComponent,
    HistorialComponent,
    EmpleadosComponent,
    DatosComponent,
    SpinnerComponent,
    AgenciasComponent,
    UsuariosComponent,
    InformeComponent,
    UsuarioReclamoComponent
  ],
  imports: [BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    CommonModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
