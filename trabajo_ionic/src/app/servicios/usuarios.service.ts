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

    tieneFavorito(id)
    {
        let usuarioStore = sessionStorage.getItem("usuarioActivo");
        if (usuarioStore === null)
            return false;

        let usuario = Usuario.fromJSON(usuarioStore);
        if (!usuario.favoritos)
            return false;

        return usuario.favoritos.find((data) => data.id == id);
    }

    addFavorito(juego)
    {
        let usuarioStore = sessionStorage.getItem("usuarioActivo");
        if (usuarioStore === null)
            return;

        let usuario = Usuario.fromJSON(usuarioStore);
        if (!usuario.favoritos)
            usuario.favoritos = new Array();

        if (usuario.favoritos.find((data) => data.id == juego.id))
            return;

        usuario.favoritos.push(juego);
        this.usuarios.set(usuario.email, usuario);
        localStorage.setItem("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    }

    removeFavorito(juego)
    {
        let usuarioStore = sessionStorage.getItem("usuarioActivo");
        if (usuarioStore === null)
            return;

        let usuario = Usuario.fromJSON(usuarioStore);
        if (!usuario.favoritos)
            return;

        usuario.favoritos = usuario.favoritos.filter((data) => data.id != juego.id);
            
        this.usuarios.set(usuario.email, usuario);
        localStorage.setItem("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    }

    eliminarFavoritos()
    {
        let usuarioStore = sessionStorage.getItem("usuarioActivo");
        if (usuarioStore === null)
            return;

        let usuario = Usuario.fromJSON(usuarioStore);
        if (!usuario.favoritos)
            return;

        usuario.favoritos = new Array();
        this.usuarios.set(usuario.email, usuario);
        localStorage.setItem("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    }
}
