import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit
{
    loginForm: FormGroup;
    errorLogin: boolean = false;
    constructor(private router: Router, private usuariosService: UsuariosService) {}

    ngOnInit()
    {
        this.loginForm = new FormGroup({
            "email": new FormControl(null, [Validators.required, Validators.email]),
            "password": new FormControl(null, [Validators.required, Validators.minLength(8)])
        });
    }

    irRegistro()
    {
        this.router.navigate(['register']);
    }

    hacerLogin(form)
    {
        let loginResult = this.usuariosService.tryLogin(form);
        if (loginResult === null)
            this.errorLogin = true;
        else
        {
            this.errorLogin = false;
            this.usuariosService.setUsuarioActivo(loginResult);
            this.router.navigate(['home']);
        }
    }
}
