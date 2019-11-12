import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { ItemPlataformaComponent } from './item-plataforma/item-plataforma.component';
import { ListaJuegosComponent } from './lista-juegos/lista-juegos.component';
import { MenuJuegosComponent } from './menu-juegos/menu-juegos.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    ItemPlataformaComponent,
    ListaJuegosComponent,
    MenuJuegosComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    ItemPlataformaComponent,
    ListaJuegosComponent,
    MenuJuegosComponent
  ],
  entryComponents: [],
})
export class ComponentsModule {}
