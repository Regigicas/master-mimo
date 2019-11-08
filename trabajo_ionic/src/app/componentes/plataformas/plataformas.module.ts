import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlataformasPage } from './plataformas.page';
import { ComponentsModule } from '../components.module';

const routes: Routes = [
  {
    path: '',
    component: PlataformasPage
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
  declarations: [PlataformasPage]
})
export class PlataformasPageModule {}
