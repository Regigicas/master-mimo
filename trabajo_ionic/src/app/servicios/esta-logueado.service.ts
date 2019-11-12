import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EstaLogueadoService implements CanActivate
{
    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot) : boolean
    {
        let usuario = sessionStorage.getItem("usuarioActivo");
        if (usuario === null)
        {
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }
}
