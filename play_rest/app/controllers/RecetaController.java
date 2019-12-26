package controllers;

import models.Receta;
import play.cache.SyncCacheApi;
import play.data.FormFactory;
import play.mvc.Controller;
import play.mvc.Result;

import javax.inject.Inject;
import java.util.List;

public class RecetaController extends Controller
{
    @Inject
    FormFactory formFactory;

    @Inject
    private SyncCacheApi cache;

    public Result getRecetas()
    {
        List<Receta> recetas = cache.get(Receta.CACHE_GET_PATH);
        if (recetas == null)
        {
            recetas = Receta.findRecetas();
            cache.set(Receta.CACHE_GET_PATH, recetas, 300);
        }

        if (recetas == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(recetas));
        else if (request().accepts("application/xml"))
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
