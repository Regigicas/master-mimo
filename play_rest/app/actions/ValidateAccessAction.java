package actions;

import forms.UsuarioAccessTryData;
import play.mvc.Http;
import play.mvc.Security;

import java.util.Optional;

public class ValidateAccessAction extends Security.Authenticator
{
    @Override
    public Optional<String> getUsername(Http.Request req)
    {
        Optional<UsuarioAccessTryData> optUser = req.attrs().getOptional(UsuarioAccessTryData.USER_TYPEDKEY);
        UsuarioAccessTryData user = optUser.isPresent() ? optUser.get() : null;
        if (user == null || user.getUsuario() == null ||
            !user.getUsuario().getPassword().equals(user.getUserData()[1].toUpperCase()))
            return Optional.empty();

        return Optional.of(user.getUsuario().getUsername());
    }
}
