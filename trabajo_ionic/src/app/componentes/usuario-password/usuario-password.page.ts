import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';
import { ErroresUpdatePassword } from 'src/app/modelos/ErroresUpdatePassword';

@Component({
  selector: 'app-usuario-password',
  templateUrl: './usuario-password.page.html',
  styleUrls: ['./usuario-password.page.scss'],
})
export class UsuarioPasswordPage implements OnInit
{
    passwordChangeForm: FormGroup;
    redirectTime: boolean = false;
    errorUpdate: ErroresUpdatePassword = ErroresUpdatePassword.None;
    constructor(private usuariosService : UsuariosService, private router: Router) {}

    ngOnInit()
    {
        this.passwordChangeForm = new FormGroup({
            "passwordActual": new FormControl(null, [Validators.required, Validators.minLength(8)]),
            "password": new FormControl(null, [Validators.required, Validators.minLength(8)]),
            "password2": new FormControl(null, [Validators.required])
        }, this.passwordIguales );
    }

    passwordIguales: ValidatorFn = (fg: FormGroup) =>
    {
        let pass = fg.get('password').value;
        let confirmPass = fg.get('password2').value;

        return pass === confirmPass ? null : { notSame: true }
    }

    onFormSubmit(form)
    {
        this.errorUpdate = this.usuariosService.actualizarPassword(form);
        if (this.errorUpdate == ErroresUpdatePassword.None)
        {
            this.redirectTime = true;
            setTimeout(() =>
            {
                this.redirectTime = false;
                this.router.navigate(["login"]);
            }, 2500);
        }
    }
}
