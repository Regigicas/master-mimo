package controllers;

import misc.RestError;
import models.Ingrediente;
import play.cache.SyncCacheApi;
import play.data.Form;
import play.data.FormFactory;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import javax.inject.Inject;
import java.util.List;

public class IngredienteController extends Controller
{
    @Inject
    FormFactory formFactory;

    @Inject
    private SyncCacheApi cache;

    public Result getIngredientes()
    {
        List<Ingrediente> ingredientes = cache.get(Ingrediente.CACHE_GET_PATH);
        if (ingredientes == null)
        {
            ingredientes = Ingrediente.findIngredientes();
            cache.set(Ingrediente.CACHE_GET_PATH, ingredientes, 300);
        }

        if (ingredientes == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(ingredientes));
        else if (request().accepts("application/xml"))
            return ok(views.xml.ingredientes.render(ingredientes));

        return status(415);
    }

    public Result getIngrediente(Long id)
    {
        String cachePath = String.format(Ingrediente.CACHE_GET_PATH_ID, id);
        Ingrediente ingrediente = cache.get(cachePath);
        if (ingrediente == null)
        {
            ingrediente = Ingrediente.findById(id);
            cache.set(cachePath, ingrediente, 300);
        }

        if (ingrediente == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(ingrediente));
        else if (request().accepts("application/xml"))
            return ok(views.xml.ingrediente.render(ingrediente));

        return status(415);
    }

    public Result crearIngrediente()
    {
        Form<Ingrediente> form = formFactory.form(Ingrediente.class).bindFromRequest();
        if (form.hasErrors())
        {
            if (request().accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request().accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));
            else
                return status(415);
        }

        Ingrediente ingrediente = form.get();
        if (Ingrediente.findByName(ingrediente.getNombre()) != null)
        {
            RestError error = RestError.makeError(Http.Context.current().messages(), 409, "error.existingIngredient");
            if (request().accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request().accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));
            else
                return status(415);
        }

        ingrediente.save();
        cache.remove(Ingrediente.CACHE_GET_PATH);
        if (request().accepts("application/json"))
            return created(play.libs.Json.toJson(ingrediente));
        else if (request().accepts("application/xml"))
            return created(views.xml.ingrediente.render(ingrediente));

        return status(415);
    }

    public Result updateNombre(Long id)
    {
        Form<Ingrediente> form = formFactory.form(Ingrediente.class).bindFromRequest();
        if (form.hasErrors())
        {
            if (request().accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request().accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));
            else
                return status(415);
        }

        Ingrediente ingrediente = Ingrediente.findById(id);
        if (ingrediente == null)
            return notFound();

        Ingrediente updRequest = form.get();
        if (updRequest.getNombre().equals(ingrediente.getNombre()))
        {
            RestError error = RestError.makeError(Http.Context.current().messages(), 409, "error.ingredient.samename");
            if (request().accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request().accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));
            else
                return status(415);
        }

        if (Ingrediente.findByName(updRequest.getNombre()) != null)
        {
            RestError error = RestError.makeError(Http.Context.current().messages(), 409, "error.existingIngredient");
            if (request().accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request().accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));
            else
                return status(415);
        }

        ingrediente.setNombre(updRequest.getNombre());
        ingrediente.update();
        cache.remove(Ingrediente.CACHE_GET_PATH);
        cache.remove(String.format(Ingrediente.CACHE_GET_PATH_ID, id));
        return ok();
    }
}
