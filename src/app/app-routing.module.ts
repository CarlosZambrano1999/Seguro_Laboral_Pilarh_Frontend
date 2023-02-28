import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { SessionGuard } from './guards/session.guard';
import { DatosComponent } from './pages/datos/datos.component';
import { AgenciasComponent } from './pages/empleados/agencias/agencias.component';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { UsuariosComponent } from './pages/empleados/usuarios/usuarios.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { InformeComponent } from './pages/informe/informe.component';
import { LoginComponent } from './pages/login/login.component';
import { ReclamoComponent } from './pages/reclamo/reclamo.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate:[SessionGuard], data:{title:'Seguros Login'}},
  {path: 'claims', component: ReclamoComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Seguros Reclamos'}},
  {path: 'record', component: HistorialComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Seguros Historial'}},
  {path: 'employees', component: EmpleadosComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Seguros Empleados'}, children:[
    {path: 'branch', component: AgenciasComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Seguros Agencias'}},
    {path: 'users', component: UsuariosComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Seguros Afiliados'}},
  ]},
  {path: 'data', component: DatosComponent, canActivate:[AuthGuard, AdminGuard], data:{title:'Seguros Datos'}},
  {path: 'report/:id_reclamo', component: InformeComponent, data:{title:'Detalles de Reclamo'}},
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
