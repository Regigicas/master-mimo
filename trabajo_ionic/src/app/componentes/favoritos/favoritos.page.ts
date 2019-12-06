import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit
{
    favoritos = null;
    constructor(private usuariosService: UsuariosService, private alertController: AlertController) {}

    ngOnInit() {}

    ionViewWillEnter()
    {
        let usuario = this.usuariosService.getUsuarioActivo();
        if (usuario === null)
            return;

        this.favoritos = usuario.favoritos;
    }

    borrarFavorito(fav)
    {
        this.usuariosService.removeFavorito(fav);
        this.favoritos = this.favoritos.filter((data) => data.id != fav.id);
    }

    async borrarTodos()
    {
        const alert = await this.alertController.create(
        {
            message: '¿Estás seguro de que quieres eliminar todos los favoritos?',
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
                        this.favoritos = null;
                        this.usuariosService.eliminarFavoritos();
                    }
                }
            ]
        });

        await alert.present();
    }
}
