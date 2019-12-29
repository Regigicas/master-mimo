package models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.typesafe.config.Optional;
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

    @Optional
    public Integer calorias;

    public Timestamp fechaPublicacion;

    @OneToOne(mappedBy = "extra")
    @JsonIgnore
    public Receta receta;

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

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Integer getCalorias()
    {
        return calorias;
    }

    public void setCalorias(Integer calorias)
    {
        this.calorias = calorias;
    }
}
