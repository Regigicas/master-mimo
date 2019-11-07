import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { ErroresRegistro } from 'src/app/modelos/ErroresRegistro';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit
{
    registerForm: FormGroup;
    errorRegistro: ErroresRegistro = ErroresRegistro.None;
    redirectTime: boolean = false;
    constructor(private usuariosService : UsuariosService, private router: Router) {}

    ngOnInit()
    {
        this.registerForm = new FormGroup({
            "email": new FormControl(null, [Validators.required, Validators.email]),
            "username": new FormControl(null, [Validators.required, Validators.minLength(4)]),
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

    onFormSubmit(registerForm)
    {
        this.errorRegistro = this.usuariosService.registrarUsuario(registerForm);
        if (this.errorRegistro === ErroresRegistro.None)
        {
            this.redirectTime = true;
            setTimeout(() =>
            {
                this.router.navigate(["login"]);
            }, 2500);
        }
    }
}
