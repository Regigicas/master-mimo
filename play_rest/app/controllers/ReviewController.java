package controllers;

import models.RecetaReview;
import play.cache.SyncCacheApi;
import play.data.FormFactory;
import play.mvc.Controller;
import play.mvc.Result;

import javax.inject.Inject;
import java.util.List;

public class ReviewController extends Controller
{
    @Inject
    FormFactory formFactory;

    @Inject
    private SyncCacheApi cache;

    public Result getReviewsAutor(Long id)
    {
        String cachePath = String.format(RecetaReview.CACHE_GET_PATH_AUTOR, id);
        List<RecetaReview> reviews = cache.get(cachePath);
        if (reviews == null)
        {
            reviews = RecetaReview.findReviewsByAuthor(id);
            cache.set(cachePath, reviews, 300);
        }

        if (reviews == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(reviews));
        else if (request().accepts("application/xml"))
            return ok(views.xml.reviewsautor.render(reviews));

        return status(415);
    }

    public Result getReviewsRecipe(Long id)
    {
        String cachePath = String.format(RecetaReview.CACHE_GET_PATH_RECETA, id);
        List<RecetaReview> reviews = cache.get(cachePath);
        if (reviews == null)
        {
            reviews = RecetaReview.findReviewsByRecipe(id);
            cache.set(cachePath, reviews, 300);
        }

        if (reviews == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(reviews));
        else if (request().accepts("application/xml"))
            return ok(views.xml.reviewsautor.render(reviews));

        return status(415);
    }

    private Result deleteReviewImpl(Long autorId, Long recetaId)
    {
        RecetaReview review = RecetaReview.findReviewByAuthorAndRecipe(autorId, recetaId);
        if (review != null)
            review.delete();

        return noContent();
    }

    public Result deleteReviewByAuthorAndRecipe(Long recetaId, Long autorId)
    {
        return deleteReviewImpl(autorId, recetaId);
    }

    public Result deleteReviewByRecipeAndAuthor(Long autorId, Long recetaId)
    {
        return deleteReviewImpl(autorId, recetaId);
    }

    private Result getReviewByImpl(Long autorId, Long recetaId)
    {
        String cachePath = String.format(RecetaReview.CACHE_GET_PATH_AUTOR_RECETA, autorId, recetaId);
        RecetaReview review = cache.get(cachePath);
        if (review == null)
        {
            review = RecetaReview.findReviewByAuthorAndRecipe(autorId, recetaId);
            cache.set(cachePath, review, 300);
        }

        if (review == null)
            return notFound();

        if (request().accepts("application/json"))
            return ok(play.libs.Json.toJson(review));
        else if (request().accepts("application/xml"))
            return ok(views.xml.review.render(review));

        return status(415);
    }

    public Result getReviewByAuthorAndRecipe(Long autorId, Long recetaId)
    {
        return getReviewByImpl(autorId, recetaId);
    }

    public Result getReviewByRecipeAndAuthor(Long recetaId, Long autorId)
    {
        return getReviewByImpl(autorId, recetaId);
    }
}
