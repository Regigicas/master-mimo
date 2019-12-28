package models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import io.ebean.Finder;
import io.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.List;

@Entity
public class Receta extends Model
{
    @Id
    @GeneratedValue
    public Long id;

    @Constraints.Required
    public String nombre;

    @Constraints.Required
    @Constraints.MinLength(5)
    @Column(columnDefinition = "TEXT")
    public String preparacion;

    @ManyToOne
    @JsonIgnoreProperties({"publicadas", "reviews"})
    public Usuario publicante;

    @ManyToMany(cascade = CascadeType.ALL)
    public List<Ingrediente> ingredientes;

    @OneToOne(cascade = CascadeType.ALL)
    public RecetaExtra extra;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "receta")
    @JsonIgnoreProperties("receta")
    public List<RecetaReview> reviews;

    public Long getId()
    {
        return id;
    }

    public String getNombre()
    {
        return nombre;
    }

    public void setNombre(String nombre)
    {
        this.nombre = nombre;
    }

    public String getPreparacion()
    {
        return preparacion;
    }

    public void setPreparacion(String preparacion)
    {
        this.preparacion = preparacion;
    }

    public Usuario getPublicante()
    {
        return publicante;
    }

    public List<Ingrediente> getIngredientes()
    {
        return ingredientes;
    }

    public RecetaExtra getExtra()
    {
        return extra;
    }

    public List<RecetaReview> getReviews()
    {
        return reviews;
    }

    public void setPublicante(Usuario publicante)
    {
        this.publicante = publicante;
    }

    public void setExtra(RecetaExtra extra)
    {
        this.extra = extra;
    }

    public void addIngrediente(Ingrediente ingre)
    {
        ingredientes.add(ingre);
        ingre.addReceta(this);
    }

    public void addExtra(RecetaExtra ext)
    {
        extra = ext;
        ext.setReceta(this);
    }

    public void setReviews(List<RecetaReview> reviews)
    {
        this.reviews = reviews;
    }

    @JsonIgnore
    private static final Finder<Long, Receta> finder = new Finder<>(Receta.class);

    @JsonIgnore
    public static final String CACHE_GET_PATH = "GET_RECETAS_CACHE";
    @JsonIgnore
    public static final String CACHE_GET_PATH_ID = "GET_RECETAS_CACHE_%d";

    public static List<Receta> findRecetas()
    {
        return finder.all();
    }

    public static Receta findById(Long id)
    {
        return finder.byId(id);
    }

    public static Receta findByNameAndAuthor(String name, Long autorId)
    {
        return finder.query().where().ilike("nombre", name)
                .eq("publicante.id", autorId).setMaxRows(1).findOne();
    }

    public static List<Receta> findByAuthor(Long id)
    {
        return finder.query().where().eq("publicante.id", id).findList();
    }
}
