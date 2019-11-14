import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { EnumUpdateDatos } from 'src/app/modelos/EnumUpdateDatos';
import { Usuario } from 'src/app/modelos/Usuario';

@Component({
  selector: 'app-usuario-datos',
  templateUrl: './usuario-datos.page.html',
  styleUrls: ['./usuario-datos.page.scss'],
})
export class UsuarioDatosPage implements OnInit
{
    usuario: Usuario = null;
    datosChangeForm: FormGroup;
    updateValue: EnumUpdateDatos = EnumUpdateDatos.None;
    constructor(private usuariosService : UsuariosService, private router: Router) {}

    ngOnInit()
    {
        this.datosChangeForm = new FormGroup({
            "email": new FormControl(null, [Validators.email]),
            "username": new FormControl(null, [Validators.minLength(4)])
        });
    }

    ionViewWillEnter()
    {
        this.usuario = Usuario.fromJSON(sessionStorage.getItem("usuarioActivo"));
    }

    onFormSubmit(form)
    {
        this.updateValue = this.usuariosService.actualizarDatos(form);
        if (this.updateValue > EnumUpdateDatos.None)
        {
            setTimeout(() =>
            {
                let oldUpdate = this.updateValue;
                this.updateValue = EnumUpdateDatos.None;
                this.router.navigate(oldUpdate == EnumUpdateDatos.ActualizadoLogout ? ["login"] : ["usuario"]);
            }, 2500);
        }
    }
}
