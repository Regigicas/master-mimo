import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent
  ],
  entryComponents: [],
})
export class ComponentsModule {}
