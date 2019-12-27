package controllers;

import actions.ValidateAccessAction;
import forms.UsuarioAccessTryData;
import misc.ObtenerUsuario;
import models.Receta;
import models.RecetaReview;
import models.Usuario;
import play.cache.SyncCacheApi;
import play.data.Form;
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
public class ReviewController extends Controller
{
    @Inject
    private FormFactory formFactory;

    @Inject
    private MessagesApi messageApi;

    @Inject
    private SyncCacheApi cache;

    public Result getReviewsAutor(Http.Request request, Long id)
    {
        String cachePath = String.format(RecetaReview.CACHE_GET_PATH_AUTOR, id);
        Optional<List<RecetaReview>> optReviews = cache.getOptional(cachePath);
        List<RecetaReview> reviews = optReviews.orElse(null);
        if (reviews == null)
        {
            reviews = RecetaReview.findReviewsByAuthor(id);
            cache.set(cachePath, reviews, 120);
        }

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(reviews));
        else if (request.accepts("application/xml"))
            return ok(views.xml.reviewsautor.render(reviews));

        return status(415);
    }

    public Result getReviewsRecipe(Http.Request request, Long id)
    {
        String cachePath = String.format(RecetaReview.CACHE_GET_PATH_RECETA, id);
        Optional<List<RecetaReview>> optReviews = cache.getOptional(cachePath);
        List<RecetaReview> reviews = optReviews.orElse(null);
        if (reviews == null)
        {
            reviews = RecetaReview.findReviewsByRecipe(id);
            cache.set(cachePath, reviews, 120);
        }

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(reviews));
        else if (request.accepts("application/xml"))
            return ok(views.xml.reviewsautor.render(reviews));

        return status(415);
    }

    public Result deleteReviewByRecipeAndAuthor(Http.Request request, Long recetaId)
    {
        Usuario usuario = request.attrs().get(UsuarioAccessTryData.USER_TYPEDKEY).getUsuario();
        RecetaReview review = RecetaReview.findReviewByAuthorAndRecipe(usuario.getId(), recetaId);
        if (review != null)
        {
            cache.remove(String.format(RecetaReview.CACHE_GET_PATH_AUTOR, review.getAutor().getId()));
            cache.remove(String.format(RecetaReview.CACHE_GET_PATH_RECETA, review.getReceta().getId()));
            cache.remove(String.format(RecetaReview.CACHE_GET_PATH_AUTOR_RECETA, review.getAutor().getId(), review.getReceta().getId()));
            review.delete();
        }

        return noContent();
    }

    private Result getReviewByImpl(Http.Request request, Long autorId, Long recetaId)
    {
        String cachePath = String.format(RecetaReview.CACHE_GET_PATH_AUTOR_RECETA, autorId, recetaId);
        Optional<RecetaReview> optReview = cache.getOptional(cachePath);
        RecetaReview review = optReview.orElse(null);
        if (review == null)
        {
            review = RecetaReview.findReviewByAuthorAndRecipe(autorId, recetaId);
            cache.set(cachePath, review, 120);
        }

        if (review == null)
            return notFound();

        if (request.accepts("application/json"))
            return ok(play.libs.Json.toJson(review));
        else if (request.accepts("application/xml"))
            return ok(views.xml.review.render(review));

        return status(415);
    }

    public Result getReviewByAuthorAndRecipe(Http.Request request, Long autorId, Long recetaId)
    {
        return getReviewByImpl(request, autorId, recetaId);
    }

    public Result getReviewByRecipeAndAuthor(Http.Request request, Long recetaId, Long autorId)
    {
        return getReviewByImpl(request, autorId, recetaId);
    }

    public Result postOrUpdateReview(Http.Request request, Long recetaId)
    {
        Form<RecetaReview> form = formFactory.form(RecetaReview.class).bindFromRequest(request);
        if (form.hasErrors())
        {
            if (request.accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request.accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));

            return status(415);
        }

        Usuario usuario = request.attrs().get(UsuarioAccessTryData.USER_TYPEDKEY).getUsuario();
        RecetaReview review = RecetaReview.findReviewByAuthorAndRecipe(usuario.getId(), recetaId);
        boolean nuevaReceta = false;
        if (review == null)
        {
            nuevaReceta = true;
            review = new RecetaReview();
            Receta receta = Receta.findById(recetaId);
            if (receta == null)
                return notFound();

            review.setAutor(usuario);
            review.setReceta(receta);
        }

        RecetaReview updForm = form.get();
        review.setNota(updForm.getNota());
        review.setTexto(updForm.getTexto());

        cache.remove(String.format(RecetaReview.CACHE_GET_PATH_AUTOR, review.getAutor().getId()));
        cache.remove(String.format(RecetaReview.CACHE_GET_PATH_RECETA, review.getReceta().getId()));
        cache.remove(String.format(RecetaReview.CACHE_GET_PATH_AUTOR_RECETA, review.getAutor().getId(), review.getReceta().getId()));

        if (nuevaReceta)
        {
            review.save();
            return created();
        }

        review.update();
        return ok();
    }
}
