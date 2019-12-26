package models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.ebean.Finder;
import io.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.*;
import java.util.LinkedList;
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
    @Lob
    public String preparacion;

    @ManyToOne
    public Usuario publicante;

    @ManyToMany(cascade = CascadeType.ALL)
    public List<Ingrediente> ingredientes = new LinkedList<>();

    @ManyToMany(mappedBy = "favoritos")
    public List<Usuario> favoritos = new LinkedList<>();

    @OneToOne(cascade = CascadeType.ALL)
    public RecetaExtra extra;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "receta")
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

    public List<Usuario> getFavoritos()
    {
        return favoritos;
    }

    public RecetaExtra getExtra()
    {
        return extra;
    }

    public List<RecetaReview> getReviews()
    {
        return reviews;
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

    public static Receta findByName(String name)
    {
        return finder.query().where().like("nombre", name).setMaxRows(1).findOne();
    }

    public static List<Receta> findByAuthor(Long id)
    {
        return finder.query().where().eq("publicante.id", id).findList();
    }
}
