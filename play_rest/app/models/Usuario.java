package models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.ebean.Finder;
import io.ebean.Model;
import misc.MiscUtils;
import play.data.validation.Constraints;
import play.libs.typedmap.TypedKey;
import validators.NoWhitespaceValidator;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;

@Entity
public class Usuario extends Model
{
    @Id
    @GeneratedValue
    public Long id;

    @Constraints.MinLength(5)
    @Constraints.MaxLength(20)
    @Constraints.Required
    @Constraints.ValidateWith(NoWhitespaceValidator.class)
    public String username;

    @Constraints.MinLength(8)
    @Constraints.Required
    @Constraints.ValidateWith(NoWhitespaceValidator.class)
    @JsonIgnore
    public String password;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "publicante")
    public List<Receta> publicadas;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "autor")
    public List<RecetaReview> reviews;

    public void setPassword(String password)
    {
        this.password = password;
    }

    public String getPassword()
    {
        return password;
    }

    public boolean hashPassword()
    {
        String hash = MiscUtils.MakeHash(this.password.trim());
        if (hash != null)
        {
            password = hash;
            return true;
        }

        return false;
    }

    public Long getId()
    {
        return id;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public List<Receta> getPublicadas()
    {
        return publicadas;
    }

    public List<RecetaReview> getReviews()
    {
        return reviews;
    }

    @JsonIgnore
    private static final Finder<Long, Usuario> finder = new Finder<>(Usuario.class);

    @JsonIgnore
    public static final String CACHE_GET_PATH = "GET_USUARIOS_CACHE";
    @JsonIgnore
    public static final String CACHE_GET_PATH_ID = "GET_USUARIOS_CACHE_%d";

    public static List<Usuario> findUsuarios()
    {
        return finder.all();
    }

    public static Usuario findById(Long id)
    {
        return finder.byId(id);
    }

    public static Usuario findByUsername(String name)
    {
        return finder.query().where().ilike("username", name).setMaxRows(1).findOne();
    }
}
