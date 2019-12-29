import controllers.routes;
import net.sf.ehcache.CacheManager;
import org.junit.Test;
import play.mvc.Http;
import play.mvc.Result;
import play.test.Helpers;

import static org.junit.Assert.assertNotEquals;
import static play.mvc.Results.badRequest;
import static play.mvc.Results.ok;

public class UnitTest
{
    @Test
    public void checkUsuario()
    {
        Http.RequestBuilder reqBuilder = Helpers.fakeRequest(routes.UsuarioController.getUsuarios());
        Result result = Helpers.route(Helpers.fakeApplication(), reqBuilder);
        assertNotEquals(ok(), result.status());
        CacheManager.getInstance().shutdown();
    }

    @Test
    public void checkReceta()
    {
        Http.RequestBuilder reqBuilder = Helpers.fakeRequest(routes.RecetaController.postReceta());
        Result result = Helpers.route(Helpers.fakeApplication(), reqBuilder);
        assertNotEquals(badRequest(), result.status());
        CacheManager.getInstance().shutdown();
    }
}
