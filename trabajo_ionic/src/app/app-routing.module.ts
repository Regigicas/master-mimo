import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./componentes/home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: () => import('./componentes/login/login.module').then( m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./componentes/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'plataformas', loadChildren: () => import('./componentes/plataformas/plataformas.module').then(m => m.PlataformasPageModule) },
  { path: 'plataformas/:id', loadChildren: () => import('./componentes/plataforma/plataforma.module').then(m => m.PlataformaPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
