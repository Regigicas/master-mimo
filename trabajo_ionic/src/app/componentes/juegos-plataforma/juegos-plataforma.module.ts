import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegosPlataformaPage } from './juegos-plataforma.page';
import { ComponentsModule } from '../components.module';

const routes: Routes = [
  {
    path: '',
    component: JuegosPlataformaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [JuegosPlataformaPage]
})
export class JuegosPlataformaPageModule {}
