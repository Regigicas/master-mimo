package models;

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

    public float rating;

    public Timestamp fechaPublicacion;

    @OneToOne(mappedBy = "extra")
    public Receta receta;

    public float getRating()
    {
        return rating;
    }

    public void setRating(float rating)
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
}
