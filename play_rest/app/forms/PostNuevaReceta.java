package forms;

import play.data.validation.Constraints;
import play.data.validation.ValidationError;

import java.util.List;

public class PostNuevaReceta implements Constraints.Validatable<ValidationError>
{
    @Constraints.Required
    public String nombre;

    @Constraints.Required
    @Constraints.MinLength(5)
    public String preparacion;

    public List<String> nombreIngredientes;
    public List<Long> idIngredientes;

    public String getNombre()
    {
        return nombre;
    }

    public String getPreparacion()
    {
        return preparacion;
    }

    public List<String> getNombreIngredientes()
    {
        return nombreIngredientes;
    }

    public List<Long> getIdIngredientes()
    {
        return idIngredientes;
    }

    @Override
    public ValidationError validate()
    {
        if ((nombreIngredientes == null || nombreIngredientes.size() < 2) &&
            (idIngredientes == null || idIngredientes.size() < 2))
            return new ValidationError("ingredientes", "error.musthaveingredients");

        return null;
    }
}
