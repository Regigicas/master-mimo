package controllers;

import actions.ValidateAccessAction;
import com.fasterxml.jackson.databind.JsonNode;
import forms.UpdateUserPassword;
import forms.UsuarioAccessTryData;
import misc.MiscUtils;
import misc.ObtenerUsuario;
import misc.RestError;
import models.Usuario;
import play.cache.SyncCacheApi;
import play.data.Form;
import play.data.FormFactory;
import play.data.validation.ValidationError;
import play.i18n.MessagesApi;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;

import javax.inject.Inject;
import java.util.List;
import java.util.Optional;

public class UsuarioController extends Controller
{
    @Inject
    private FormFactory formFactory;

    @Inject
    private MessagesApi messageApi;

    @Inject
    private SyncCacheApi cache;

    @ObtenerUsuario
    @Security.Authenticated(ValidateAccessAction.class)
    public Result getUsuarios(Http.Request request)
    {
        Optional<List<Usuario>> optUsuarios = cache.getOptional(Usuario.CACHE_GET_PATH);
        List<Usuario> usuarios = optUsuarios.orElse(null);
        if (usuarios == null)
        {
            usuarios = Usuario.findUsuarios();
            cache.set(Usuario.CACHE_GET_PATH, usuarios, 120);
        }

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(usuarios));
        else if (request.accepts("application/xml"))
            return ok(views.xml.usuarios.render(usuarios));

        return status(415);
    }

    @ObtenerUsuario
    @Security.Authenticated(ValidateAccessAction.class)
    public Result getUsuario(Http.Request request, Long id)
    {
        String cachePath = String.format(Usuario.CACHE_GET_PATH_ID, id);
        Optional<Usuario> optUsuario = cache.getOptional(cachePath);
        Usuario usuario = optUsuario.orElse(null);
        if (usuario == null)
        {
            usuario = Usuario.findById(id);
            if (usuario == null)
                return notFound();

            cache.set(cachePath, usuario, 120);
        }

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(usuario));
        else if (request.accepts("application/xml"))
            return ok(views.xml.usuario.render(usuario));

        return status(415);
    }

    public Result crearUsuario(Http.Request request)
    {
        Form<Usuario> form = formFactory.form(Usuario.class).bindFromRequest(request);
        Result formResult = MiscUtils.CheckFormErrors(request, form);
        if (formResult != null)
            return formResult;

        Usuario user = form.get();
        if (Usuario.findByUsername(user.getUsername()) != null)
            return MiscUtils.MakeRestError(request, messageApi, 409, "error.existingUser");

        if (!user.hashPassword())
            return internalServerError();

        user.save();
        cache.remove(Usuario.CACHE_GET_PATH);
        if (request.accepts("application/json"))
            return created(play.libs.Json.toJson(user));
        else if (request.accepts("application/xml"))
            return created(views.xml.usuario.render(user));

        return status(415);
    }

    @ObtenerUsuario
    @Security.Authenticated(ValidateAccessAction.class)
    public Result updateUserPass(Http.Request request)
    {
        Form<UpdateUserPassword> form = formFactory.form(UpdateUserPassword.class).bindFromRequest(request);
        Result formResult = MiscUtils.CheckFormErrors(request, form);
        if (formResult != null)
            return formResult;

        Usuario user = request.attrs().get(UsuarioAccessTryData.USER_TYPEDKEY).getUsuario();
        UpdateUserPassword updRequest = form.get();
        ValidationError verror = updRequest.validate();
        if (verror != null)
        {
            form = form.withError(verror);
            if (request.accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request.accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));

            return status(415);
        }

        if (!updRequest.convertPasswords())
            return internalServerError();

        if (!updRequest.getOldPassword().equals(user.getPassword()))
            return MiscUtils.MakeRestError(request, messageApi, 409, "error.oldpasswordMismatch");

        // No actualizamos cache porque la pass no va en rest
        user.setPassword(updRequest.getNewPassword());
        user.update();
        return ok();
    }
}
