package actions;

import forms.UsuarioAccessTryData;
import misc.ObtenerUsuario;
import models.Usuario;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;

import java.util.Base64;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class ObtenerUsuarioAction extends Action<ObtenerUsuario>
{
    @Override
    public CompletionStage<Result> call(Http.Request req)
    {
        Optional<String> basicAuth = req.getHeaders().get("Authorization");
        if (!basicAuth.isPresent())
            return delegate.call(req);

        String[] splits = basicAuth.get().split(" ");
        if (splits.length != 2)
            return CompletableFuture.completedFuture(badRequest());

        String decoded = new String(Base64.getDecoder().decode(splits[1]));
        String[] userData = decoded.split(":");
        if (userData.length != 2)
            return CompletableFuture.completedFuture(badRequest());

        Usuario user = Usuario.findByUsername(userData[0]);
        UsuarioAccessTryData data = new UsuarioAccessTryData();
        data.setUsuario(user);
        data.setUserData(userData);
        return delegate.call(req.addAttr(UsuarioAccessTryData.USER_TYPEDKEY, data));
    }
}
