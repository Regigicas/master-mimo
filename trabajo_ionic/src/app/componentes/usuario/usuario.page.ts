import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit
{
    usuario: Usuario = null;
    constructor(private usuarioService: UsuariosService) { }
    
    ngOnInit() {}

    ionViewWillEnter()
    {
        this.usuario = this.usuarioService.getUsuarioActivo();
    }
}
