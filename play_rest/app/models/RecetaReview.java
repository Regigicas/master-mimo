package models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.util.List;

@Entity
public class RecetaReview extends Model
{
    @ManyToOne
    public Usuario autor;

    @ManyToOne
    public Receta receta;

    public double nota;

    public Usuario getAutor()
    {
        return autor;
    }

    public Receta getReceta()
    {
        return receta;
    }

    public double getNota()
    {
        return nota;
    }

    public void setNota(double nota)
    {
        this.nota = nota;
    }

    public void setAutor(Usuario autor)
    {
        this.autor = autor;
    }

    public void setReceta(Receta receta)
    {
        this.receta = receta;
    }

    @JsonIgnore
    private static final Finder<Long, RecetaReview> finder = new Finder<>(RecetaReview.class);

    @JsonIgnore
    public static final String CACHE_GET_PATH_AUTOR = "GET_REVIEW_AUTOR_CACHE_%d";
    @JsonIgnore
    public static final String CACHE_GET_PATH_RECETA = "GET_REVIEW_RECETA_CACHE_%d";
    @JsonIgnore
    public static final String CACHE_GET_PATH_AUTOR_RECETA = "GET_REVIEW_RECETA_CACHE_%d_%d";

    public static List<RecetaReview> findReviews()
    {
        return finder.all();
    }

    public static List<RecetaReview> findReviewsByAuthor(Long id)
    {
        return finder.query().where().eq("autor.id", id).findList();
    }

    public static List<RecetaReview> findReviewsByRecipe(Long id)
    {
        return finder.query().where().eq("receta.id", id).findList();
    }

    public static RecetaReview findReviewByAuthorAndRecipe(Long author, Long recipe)
    {
        return finder.query().where()
                .eq("autor.id", author)
                .eq("receta.id", recipe).findOne();
    }
}
