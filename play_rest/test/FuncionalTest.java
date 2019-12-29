import org.junit.Test;
import play.mvc.Http;
import play.mvc.Result;
import play.test.Helpers;
import play.test.WithApplication;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static play.mvc.Results.created;
import static play.mvc.Results.status;

public class FuncionalTest extends WithApplication
{
    @Test
    public void testGetUsuarios()
    {
        Http.RequestBuilder req = Helpers.fakeRequest()
                .method("GET")
                .uri("/usuarios");

        Result res = Helpers.route(app, req);
        assertNotEquals(status(401), res.status());
    }

    @Test
    public void testCreateUser()
    {
        Http.RequestBuilder req = Helpers.fakeRequest()
                .method("POST")
                .uri("/usuarios")
                .bodyText("{\"username\": \"Usuario1\", \"password\": \"pruebapass\"}");

        Result res = Helpers.route(app, req);
        assertNotEquals(created(), res.status());
    }
}
