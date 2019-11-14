import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit
{
    usuario: Usuario = null;
    constructor() { }
    
    ngOnInit() {}

    ionViewWillEnter()
    {
        this.usuario = Usuario.fromJSON(sessionStorage.getItem("usuarioActivo"));
    }
}
