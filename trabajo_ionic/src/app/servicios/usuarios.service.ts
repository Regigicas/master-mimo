import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { Usuario } from "../modelos/Usuario";
import { ErroresRegistro } from "../modelos/ErroresRegistro";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService
{
    usuarios: Map<string, Usuario>;
    constructor()
    {
        this.usuarios = new Map<string, Usuario>();
    }

    registrarUsuario(form)
    {
        let hash: any = crypto.SHA256(form.password);
        hash = crypto.enc.Base64.stringify(hash);
        let usuario = new Usuario(form.email, form.username, hash);
        if (this.usuarios.get(usuario.email))
            return ErroresRegistro.EmailDuplicado;

        for (let usr of this.usuarios.values())
            if (usr.getUsername().toLowerCase() === usuario.getUsername().toLowerCase())
                return ErroresRegistro.UsuarioDuplicado;

        this.usuarios.set(usuario.email, usuario);
        return ErroresRegistro.None;
    }
}
