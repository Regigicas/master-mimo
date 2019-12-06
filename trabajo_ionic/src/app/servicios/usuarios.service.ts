import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { Usuario } from "../modelos/Usuario";
import { ErroresRegistro } from "../modelos/ErroresRegistro";
import { ErroresUpdatePassword } from '../modelos/ErroresUpdatePassword';
import { EnumUpdateDatos } from '../modelos/EnumUpdateDatos';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService
{
    usuarios: Map<string, Usuario> = null;
    constructor(private storage: Storage)
    {
        this.loadInitialData();
    }

    async loadInitialData()
    {
        let cached = await this.storage.get("usuarios");
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
        this.storage.set("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Como no tenemos acceso a una base de datos de verdad, almacenamos mediante la libreria de ionic
        this.setUsuarioActivo(null); // Limpiamos la sesion activa
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
        let usuario = this.getUsuarioActivo();
        if (!usuario || !usuario.favoritos)
            return false;

        return usuario.favoritos.find((data) => data.id == id);
    }

    addFavorito(juego)
    {
        let usuario = this.getUsuarioActivo();
        if (!usuario)
            return;

        if (!usuario.favoritos)
            usuario.favoritos = new Array();

        if (usuario.favoritos.find((data) => data.id == juego.id))
            return;

        usuario.favoritos.push(juego);
        this.usuarios.set(usuario.email, usuario);
        this.storage.set("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        this.setUsuarioActivo(usuario);
    }

    removeFavorito(juego)
    {
        let usuario = this.getUsuarioActivo();
        if (!usuario || !usuario.favoritos)
            return;

        usuario.favoritos = usuario.favoritos.filter((data) => data.id != juego.id);
            
        this.usuarios.set(usuario.email, usuario);
        this.storage.set("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        this.setUsuarioActivo(usuario);
    }

    eliminarFavoritos()
    {
        let usuario = this.getUsuarioActivo();
        if (!usuario || !usuario.favoritos)
            return;

        usuario.favoritos = new Array();
        this.usuarios.set(usuario.email, usuario);
        this.storage.set("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        this.setUsuarioActivo(usuario);
    }

    actualizarPassword(form)
    {
        let usuario = this.getUsuarioActivo();
        if (usuario === null)
            return ErroresUpdatePassword.PasswordAntiguaFail;

        let oldHash: any = crypto.SHA256(form.passwordActual);
        oldHash = crypto.enc.Base64.stringify(oldHash);
        if (oldHash != usuario.passHash)
            return ErroresUpdatePassword.PasswordAntiguaFail;

        let hash: any = crypto.SHA256(form.password);
        hash = crypto.enc.Base64.stringify(hash);

        if (oldHash == hash)
            return ErroresUpdatePassword.MismaPassword;

        usuario.passHash = hash;
        this.usuarios.set(usuario.email, usuario);
        this.storage.set("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        this.setUsuarioActivo(null);
        return ErroresUpdatePassword.None;
    }

    actualizarDatos(form)
    {
        let usuario = this.getUsuarioActivo();
        if (usuario === null)
            return EnumUpdateDatos.ActualizadoNormal;

        let nuevoEmail = form.email;
        if (!nuevoEmail || nuevoEmail == "")
            nuevoEmail = null;

        let nuevoUsername = form.username;
        if (!nuevoUsername || nuevoUsername == "")
            nuevoUsername = null;

        let oldMail = usuario.email;
        if (nuevoEmail && nuevoEmail == oldMail)
            nuevoEmail = null;

        if (nuevoEmail)
        {
            this.usuarios.delete(oldMail);
            usuario.email = nuevoEmail;
            this.setUsuarioActivo(null);
        }

        if (nuevoUsername)
            usuario.username = nuevoUsername;

        this.usuarios.set(usuario.email, usuario);
        this.storage.set("usuarios", JSON.stringify(Array.from(this.usuarios.entries()))); // Actualizamos la pseudo-db
        if (!nuevoEmail)
            this.setUsuarioActivo(usuario);
        return nuevoEmail ? EnumUpdateDatos.ActualizadoLogout : EnumUpdateDatos.ActualizadoNormal;
    }

    getUsuarioActivo()
    {
        let result = sessionStorage.getItem("usuarioActivo");
        return result != null ? Usuario.fromJSON(result) : null;
    }

    setUsuarioActivo(usuario: Usuario)
    {
        if (usuario)
            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        else
            sessionStorage.removeItem("usuarioActivo");
    }
}
