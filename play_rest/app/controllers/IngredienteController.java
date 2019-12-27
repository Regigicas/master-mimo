package controllers;

import actions.ValidateAccessAction;
import misc.ObtenerUsuario;
import misc.RestError;
import models.Ingrediente;
import play.cache.SyncCacheApi;
import play.data.Form;
import play.data.FormFactory;
import play.i18n.MessagesApi;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;

import javax.inject.Inject;
import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@ObtenerUsuario
@Security.Authenticated(ValidateAccessAction.class)
public class IngredienteController extends Controller
{
    @Inject
    private FormFactory formFactory;

    @Inject
    private MessagesApi messageApi;

    @Inject
    private SyncCacheApi cache;

    public Result getIngredientes(Http.Request request)
    {
        Optional<List<Ingrediente>> optIngredientes = cache.getOptional(Ingrediente.CACHE_GET_PATH);
        List<Ingrediente> ingredientes = optIngredientes.orElse(null);
        if (ingredientes == null)
        {
            ingredientes = Ingrediente.findIngredientes();
            cache.set(Ingrediente.CACHE_GET_PATH, ingredientes, 120);
        }

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(ingredientes));
        else if (request.accepts("application/xml"))
            return ok(views.xml.ingredientes.render(ingredientes));

        return status(415);
    }

    public Result getIngrediente(Http.Request request, Long id)
    {
        String cachePath = String.format(Ingrediente.CACHE_GET_PATH_ID, id);
        Optional<Ingrediente> ingredienteOpt = cache.getOptional(cachePath);
        Ingrediente ingrediente = ingredienteOpt.orElse(null);
        if (ingrediente == null)
        {
            ingrediente = Ingrediente.findById(id);
            if (ingrediente == null)
                return notFound();

            cache.set(cachePath, ingrediente, 120);
        }

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(ingrediente));
        else if (request.accepts("application/xml"))
            return ok(views.xml.ingrediente.render(ingrediente));

        return status(415);
    }

    public Result crearIngrediente(Http.Request request)
    {
        Form<Ingrediente> form = formFactory.form(Ingrediente.class).bindFromRequest(request);
        if (form.hasErrors())
        {
            if (request.accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request.accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));

            return status(415);
        }

        Ingrediente ingrediente = form.get();
        if (Ingrediente.findByName(ingrediente.getNombre()) != null)
        {
            RestError error = RestError.makeError(messageApi.preferred(request), 409, "error.existingIngredient");
            if (request.accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request.accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));

            return status(415);
        }

        ingrediente.save();
        cache.remove(Ingrediente.CACHE_GET_PATH);
        if (request.accepts("application/json"))
            return created(play.libs.Json.toJson(ingrediente));
        else if (request.accepts("application/xml"))
            return created(views.xml.ingrediente.render(ingrediente));

        return status(415);
    }

    public Result updateNombre(Http.Request request, Long id)
    {
        Form<Ingrediente> form = formFactory.form(Ingrediente.class).bindFromRequest(request);
        if (form.hasErrors())
        {
            if (request.accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request.accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));

            return status(415);
        }

        Ingrediente ingrediente = Ingrediente.findById(id);
        if (ingrediente == null)
            return notFound();

        Ingrediente updRequest = form.get();
        if (updRequest.getNombre().equals(ingrediente.getNombre()))
        {
            RestError error = RestError.makeError(messageApi.preferred(request), 409, "error.ingredient.samename");
            if (request.accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request.accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));

            return status(415);
        }

        if (Ingrediente.findByName(updRequest.getNombre()) != null)
        {
            RestError error = RestError.makeError(messageApi.preferred(request), 409, "error.existingIngredient");
            if (request.accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request.accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));

            return status(415);
        }

        ingrediente.setNombre(updRequest.getNombre());
        ingrediente.update();
        cache.remove(Ingrediente.CACHE_GET_PATH);
        cache.remove(String.format(Ingrediente.CACHE_GET_PATH_ID, id));
        return ok();
    }
}
