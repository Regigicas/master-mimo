package controllers;

import actions.ValidateAccessAction;
import forms.PostNuevaReceta;
import forms.UsuarioAccessTryData;
import misc.ObtenerUsuario;
import misc.RestError;
import models.Ingrediente;
import models.Receta;
import models.RecetaExtra;
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
import java.sql.Timestamp;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@ObtenerUsuario
@Security.Authenticated(ValidateAccessAction.class)
public class RecetaController extends Controller
{
    @Inject
    private FormFactory formFactory;

    @Inject
    private MessagesApi messageApi;

    @Inject
    private SyncCacheApi cache;

    public Result getRecetas(Http.Request request)
    {
        String nameParam = request.getQueryString("name");
        Optional<List<Receta>> optRecetas = cache.getOptional(Receta.CACHE_GET_PATH);
        List<Receta> recetas = optRecetas.orElse(null);
        if (recetas == null)
        {
            recetas = Receta.findRecetas();
            cache.set(Receta.CACHE_GET_PATH, recetas, 120);
        }

        List<Receta> result = new LinkedList<>(recetas);
        if (nameParam != null && !result.isEmpty())
            result.removeIf(r -> !r.getNombre().toUpperCase().contains(nameParam.toUpperCase()));

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(result));
        else if (request.accepts("application/xml"))
            return ok(views.xml.recetas.render(result));

        return status(415);
    }

    public Result getReceta(Http.Request request, Long id)
    {
        String cachePath = String.format(Receta.CACHE_GET_PATH_ID, id);
        Optional<Receta> optReceta = cache.getOptional(cachePath);
        Receta receta = optReceta.orElse(null);
        if (receta == null)
        {
            receta = Receta.findById(id);
            if (receta == null)
                return notFound();

            cache.set(cachePath, receta, 120);
        }

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(receta));
        else if (request.accepts("application/xml"))
            return ok(views.xml.receta.render(receta));

        return status(415);
    }

    public Result deleteReceta(Http.Request request, Long id)
    {
        Receta receta = Receta.findById(id);
        if (receta != null)
        {
            cache.remove(Receta.CACHE_GET_PATH);
            cache.remove(String.format(Receta.CACHE_GET_PATH_ID, id));
            receta.delete();
        }

        return noContent();
    }

    public Result deleteRecetasAutor(Http.Request request)
    {
        Usuario user = request.attrs().get(UsuarioAccessTryData.USER_TYPEDKEY).getUsuario();
        cache.remove(Ingrediente.CACHE_GET_PATH);
        List<Receta> recetas = Receta.findByAuthor(user.getId());
        if (!recetas.isEmpty())
        {
            cache.remove(Receta.CACHE_GET_PATH);
            for (Receta rec : recetas)
            {
                cache.remove(String.format(Receta.CACHE_GET_PATH_ID, rec.getId()));
                rec.delete();
            }
        }

        return noContent();
    }

    public Result postReceta(Http.Request request)
    {
        Form<PostNuevaReceta> form = formFactory.form(PostNuevaReceta.class).bindFromRequest(request);
        if (form.hasErrors())
        {
            if (request.accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request.accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));

            return status(415);
        }

        PostNuevaReceta postData = form.get();
        ValidationError verror = postData.validate();
        if (verror != null)
        {
            form = form.withError(verror);
            if (request.accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request.accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));

            return status(415);
        }

        Usuario user = request.attrs().get(UsuarioAccessTryData.USER_TYPEDKEY).getUsuario();
        if (Receta.findByNameAndAuthor(postData.getNombre(), user.getId()) != null)
        {
            RestError error = RestError.makeError(messageApi.preferred(request), 409, "error.duplicatedrecipe");
            if (request.accepts("application/json"))
                return status(409, play.libs.Json.toJson(error));
            else if (request.accepts("application/xml"))
                return status(409, views.xml.resterror.render(error));

            return status(415);
        }

        Receta nuevaReceta = new Receta();
        nuevaReceta.setNombre(postData.getNombre());
        nuevaReceta.setPreparacion(postData.getPreparacion());
        nuevaReceta.setPublicante(user);

        RecetaExtra extra = new RecetaExtra();
        extra.setRating(5.0f);
        extra.setFechaPublicacion(new Timestamp(System.currentTimeMillis()));
        nuevaReceta.addExtra(extra);

        List<String> nombresUsados = new LinkedList<>();
        if (postData.getIdIngredientes() != null)
        {
            for (Long ingreId : postData.getIdIngredientes())
            {
                Ingrediente ingre = Ingrediente.findById(ingreId);
                if (ingre == null)
                    return badRequest();

                if (nombresUsados.contains(ingre.getNombre()))
                    continue;;

                nuevaReceta.addIngrediente(ingre);
                nombresUsados.add(ingre.getNombre());
            }
        }

        boolean clearCache = true;
        if (postData.getNombreIngredientes() != null)
        {
            for (String inombre : postData.getNombreIngredientes())
            {
                if (nombresUsados.contains(inombre))
                    continue;;

                Ingrediente ingre = Ingrediente.findByName(inombre);
                if (ingre == null)
                {
                    if (clearCache)
                    {
                        clearCache = false;
                        cache.remove(Ingrediente.CACHE_GET_PATH);
                    }

                    ingre = new Ingrediente();
                    ingre.setNombre(inombre);
                    nuevaReceta.addIngrediente(ingre);
                    nombresUsados.add(inombre);
                }
                else
                    nuevaReceta.addIngrediente(ingre);
            }
        }

        cache.remove(Receta.CACHE_GET_PATH);
        nuevaReceta.save();

        nuevaReceta.getPublicante().setReviews(null); // No nos interesan las reviews del usuario aqui
        if (request.accepts("application/json"))
            return created(play.libs.Json.toJson(nuevaReceta));
        else if (request.accepts("application/xml"))
            return created(views.xml.receta.render(nuevaReceta));

        return status(415);
    }
}
