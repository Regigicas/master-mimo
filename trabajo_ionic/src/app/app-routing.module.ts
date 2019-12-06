import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EstaLogueadoService } from './servicios/esta-logueado.service';
import { NoEstaLogueadoService } from './servicios/no-esta-logueado.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./componentes/home/home.module').then( m => m.HomePageModule), canActivate: [EstaLogueadoService]},
  { path: 'login', loadChildren: () => import('./componentes/login/login.module').then( m => m.LoginPageModule), canActivate: [NoEstaLogueadoService] },
  { path: 'register', loadChildren: () => import('./componentes/register/register.module').then(m => m.RegisterPageModule), canActivate: [NoEstaLogueadoService] },
  { path: 'plataformas', loadChildren: () => import('./componentes/plataformas/plataformas.module').then(m => m.PlataformasPageModule), canActivate: [EstaLogueadoService] },
  { path: 'plataformas/:id', loadChildren: () => import('./componentes/plataforma/plataforma.module').then(m => m.PlataformaPageModule), canActivate: [EstaLogueadoService] },
  { path: 'usuario', loadChildren: () => import('./componentes/usuario/usuario.module').then(m => m.UsuarioPageModule), canActivate: [EstaLogueadoService] },
  { path: 'juego/:id', loadChildren: () => import('./componentes/juego-info/juego-info.module').then(m => m.JuegoInfoPageModule), canActivate: [EstaLogueadoService] },
  { path: 'favoritos', loadChildren: () => import('./componentes/favoritos/favoritos.module').then(m => m.FavoritosPageModule), canActivate: [EstaLogueadoService] },
  { path: 'juego/plataforma/:id', loadChildren: () => import('./componentes/juegos-plataforma/juegos-plataforma.module').then(m => m.JuegosPlataformaPageModule), canActivate: [EstaLogueadoService] },
  { path: 'usuario/password', loadChildren: () => import('./componentes/usuario-password/usuario-password.module').then(m => m.UsuarioPasswordPageModule), canActivate: [EstaLogueadoService] },
  { path: 'usuario/datos', loadChildren: () => import('./componentes/usuario-datos/usuario-datos.module').then(m => m.UsuarioDatosPageModule), canActivate: [EstaLogueadoService] },
  { path: 'buscar', loadChildren: () => import('./componentes/buscar/buscar.module').then(m => m.BuscarPageModule), canActivate: [EstaLogueadoService] },
  { path: 'escanear-qr', loadChildren: () => import('./componentes/escanear-qr/escanear-qr.module').then(m => m.EscanearQrPageModule), canActivate: [EstaLogueadoService] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
