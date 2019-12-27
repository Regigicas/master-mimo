package controllers;

import actions.ValidateAccessAction;
import misc.ObtenerUsuario;
import models.Receta;
import play.cache.SyncCacheApi;
import play.data.FormFactory;
import play.i18n.MessagesApi;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;

import javax.inject.Inject;
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
        Optional<List<Receta>> optRecetas = cache.getOptional(Receta.CACHE_GET_PATH);
        List<Receta> recetas = optRecetas.isPresent() ? optRecetas.get() : null;
        if (recetas == null)
        {
            recetas = Receta.findRecetas();
            cache.set(Receta.CACHE_GET_PATH, recetas, 60);
        }

        if (recetas == null)
            return notFound();

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(recetas));
        else if (request.accepts("application/xml"))
            return ok(views.xml.recetas.render(recetas));

        return status(415);
    }

    public Result deleteReceta(Long id)
    {
        Receta receta = Receta.findById(id);
        if (receta != null)
            receta.delete();

        return noContent();
    }

    public Result deleteRecetasAutor(Long id)
    {
        List<Receta> recetas = Receta.findByAuthor(id);
        if (recetas != null && !recetas.isEmpty())
            for (Receta rec : recetas)
                rec.delete();

        return noContent();
    }
}
