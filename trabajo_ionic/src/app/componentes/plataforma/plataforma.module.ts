import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlataformaPage } from './plataforma.page';
import { ComponentsModule } from '../components.module';

const routes: Routes = [
  {
    path: '',
    component: PlataformaPage
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
  declarations: [PlataformaPage]
})
export class PlataformaPageModule {}
