package models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.ebean.Finder;
import io.ebean.Model;
import play.data.validation.Constraints;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.LinkedList;
import java.util.List;

@Entity
public class Ingrediente extends Model
{
    @Id
    @GeneratedValue
    public Long id;

    @Constraints.Required
    public String nombre;

    @ManyToMany(mappedBy = "ingredientes")
    @JsonIgnore
    public List<Receta> recetas = new LinkedList<>();

    public String getNombre()
    {
        return nombre;
    }

    public void setNombre(String nombre)
    {
        this.nombre = nombre;
    }

    public void addReceta(Receta rct)
    {
        recetas.add(rct);
    }

    @JsonIgnore
    private static final Finder<Long, Ingrediente> finder = new Finder<>(Ingrediente.class);

    @JsonIgnore
    public static final String CACHE_GET_PATH = "GET_INGREDIENTES_CACHE";
    @JsonIgnore
    public static final String CACHE_GET_PATH_ID = "GET_INGREDIENTES_CACHE_%d";

    public static List<Ingrediente> findIngredientes()
    {
        return finder.all();
    }

    public static Ingrediente findById(Long id)
    {
        return finder.byId(id);
    }

    public static Ingrediente findByName(String name)
    {
        return finder.query().where().ilike("nombre", name).setMaxRows(1).findOne();
    }

    public static List<Ingrediente> findListByName(String name)
    {
        return finder.query().where().ilike("nombre", name).findList();
    }
}
