import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit
{
    usuario: Usuario = null;
    constructor(private usuarioService: UsuariosService, private router: Router,
        private alertController: AlertController) { }
    
    ngOnInit() {}

    ionViewWillEnter()
    {
        this.usuario = this.usuarioService.getUsuarioActivo();
    }

    async doLogout()
    {
        const alert = await this.alertController.create(
        {
            message: '¿Estás seguro de que deseas cerrar la sesión?',
            buttons:
            [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'Sí',
                    handler: () =>
                    {
                        this.usuarioService.setUsuarioActivo(null);
                        this.router.navigate(['/login'], { replaceUrl: true });
                    }
                }
            ]
        });

        await alert.present();
    }
}
