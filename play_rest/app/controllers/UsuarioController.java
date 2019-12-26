package controllers;

import forms.UpdateUserPassword;
import misc.RestError;
import models.Usuario;
import play.cache.SyncCacheApi;
import play.data.Form;
import play.data.FormFactory;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import javax.inject.Inject;
import java.util.List;

public class UsuarioController extends Controller
{
    @Inject
    FormFactory formFactory;

    @Inject
    private SyncCacheApi cache;

    public Result getUsuarios()
    {
        List<Usuario> usuarios = cache.get(Usuario.CACHE_GET_PATH);
        if (usuarios == null)
        {
            usuarios = Usuario.findUsuarios();
            cache.set(Usuario.CACHE_GET_PATH, usuarios, 300);
        }

        if (usuarios == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(usuarios));
        else if (request().accepts("application/xml"))
            return ok(views.xml.usuarios.render(usuarios));

        return status(415);
    }

    public Result getUsuario(Long id)
    {
        String cachePath = String.format(Usuario.CACHE_GET_PATH_ID, id);
        Usuario usuario = cache.get(cachePath);
        if (usuario == null)
        {
            usuario = Usuario.findById(id);
            cache.set(cachePath, usuario, 300);
        }

        if (usuario == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(usuario));
        else if (request().accepts("application/xml"))
            return ok(views.xml.usuario.render(usuario));

        return status(415);
    }

    public Result crearUsuario()
    {
        Form<Usuario> form = formFactory.form(Usuario.class).bindFromRequest();
        if (form.hasErrors())
        {
            if (request().accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request().accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));
            else
                return status(415);
        }

        Usuario user = form.get();
        if (Usuario.findByUsername(user.getUsername()) != null)
        {
            RestError error = RestError.makeError(Http.Context.current().messages(), 409, "error.existingUser");
            if (request().accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request().accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));
            else
                return status(415);
        }

        if (!user.hashPassword())
            return internalServerError();

        user.save();
        cache.remove(Usuario.CACHE_GET_PATH);
        if (request().accepts("application/json"))
            return created(play.libs.Json.toJson(user));
        else if (request().accepts("application/xml"))
            return created(views.xml.usuario.render(user));

        return status(415);
    }

    public Result updateUserPass(Long id)
    {
        Form<UpdateUserPassword> form = formFactory.form(UpdateUserPassword.class).bindFromRequest();
        if (form.hasErrors())
        {
            if (request().accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request().accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));
            else
                return status(415);
        }

        Usuario user = Usuario.findById(id);
        if (user == null)
            return notFound();

        UpdateUserPassword updRequest = form.get();
        if (updRequest.getOldPassword().equals(updRequest.getNewPassword()))
        {
            RestError error = RestError.makeError(Http.Context.current().messages(), 409, "error.samepassword");
            if (request().accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request().accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));
            else
                return status(415);
        }

        if (!updRequest.convertPasswords())
            return internalServerError();

        if (!updRequest.getOldPassword().equals(user.getPassword()))
        {
            RestError error = RestError.makeError(Http.Context.current().messages(), 409, "error.oldpasswordMismatch");
            if (request().accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request().accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));
            else
                return status(415);
        }

        // No actualizamos cache porque la pass no va en rest
        user.setPassword(updRequest.getNewPassword());
        user.update();
        return ok();
    }
}
