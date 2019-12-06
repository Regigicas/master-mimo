import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class NoEstaLogueadoService implements CanActivate
{
    constructor(private router: Router, private usuarioService: UsuariosService) {}

    canActivate(route: ActivatedRouteSnapshot) : boolean
    {
        let usuario = this.usuarioService.getUsuarioActivo();
        if (usuario !== null)
        {
            this.router.navigate(['home']);
            return false;
        }

        return true;
    }
}
