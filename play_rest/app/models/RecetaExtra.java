package models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import java.sql.Timestamp;

@Entity
public class RecetaExtra extends Model
{
    @Id
    @GeneratedValue
    public Long id;

    public double rating;

    public Timestamp fechaPublicacion;

    @OneToOne(mappedBy = "extra")
    @JsonIgnore
    public Receta receta;

    public double getRating()
    {
        return rating;
    }

    public void setRating(double rating)
    {
        this.rating = rating;
    }

    public Timestamp getFechaPublicacion()
    {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(Timestamp fechaPublicacion)
    {
        this.fechaPublicacion = fechaPublicacion;
    }

    public Receta getReceta()
    {
        return receta;
    }

    public void setReceta(Receta receta)
    {
        this.receta = receta;
    }
}
