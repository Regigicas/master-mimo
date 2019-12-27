package forms;

import models.Usuario;
import play.libs.typedmap.TypedKey;

public class UsuarioAccessTryData
{
    public Usuario usuario;
    public String[] userData;

    public Usuario getUsuario()
    {
        return usuario;
    }

    public void setUsuario(Usuario usuario)
    {
        this.usuario = usuario;
    }

    public String[] getUserData()
    {
        return userData;
    }

    public void setUserData(String[] userData)
    {
        this.userData = userData;
    }

    public static final TypedKey<UsuarioAccessTryData> USER_TYPEDKEY = TypedKey.create("userData");
}
