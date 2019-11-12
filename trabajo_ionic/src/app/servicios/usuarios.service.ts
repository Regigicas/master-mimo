import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { Usuario } from "../modelos/Usuario";
import { ErroresRegistro } from "../modelos/ErroresRegistro";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService
{
    usuarios: Map<string, Usuario> = null;
    constructor()
    {
        let cached = localStorage.getItem("usuarios");
        if (cached !== null)
            this.usuarios = new Map(JSON.parse(cached));

        if (this.usuarios === null)
            this.usuarios = new Map<string, Usuario>();
    }

    registrarUsuario(form)
    {
        let hash: any = crypto.SHA256(form.password);
        hash = crypto.enc.Base64.stringify(hash);
        let email = form.email.toLowerCase();
        let usuario = new Usuario(email, form.username, hash);
        if (this.usuarios.get(usuario.email))
            return ErroresRegistro.EmailDuplicado;

        for (let usr of this.usuarios.values())
            if (usr.username.toLowerCase() === usuario.username.toLowerCase())
                return ErroresRegistro.UsuarioDuplicado;

        this.usuarios.set(usuario.email, usuario);
        localStorage.setItem("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Como no tenemos acceso a una base de datos de verdad, almacenamos en localstorage
        sessionStorage.removeItem("usuarioActivo"); // Limpiamos la sesion activa
        return ErroresRegistro.None;
    }

    tryLogin(form)
    {
        let usuario = this.usuarios.get(form.email.toLowerCase());
        if (!usuario)
            return null;

        let hash: any = crypto.SHA256(form.password);
        hash = crypto.enc.Base64.stringify(hash);
        return usuario.passHash === hash ? usuario : null;
    }
}
