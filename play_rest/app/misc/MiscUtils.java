package misc;

import play.data.Form;
import play.i18n.MessagesApi;
import play.mvc.Http;
import play.mvc.Result;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import static play.mvc.Results.badRequest;
import static play.mvc.Results.status;

public class MiscUtils
{
    public static String MakeHash(String password)
    {
        MessageDigest md;
        try
        {
            md = MessageDigest.getInstance("SHA-256");
        }
        catch (NoSuchAlgorithmException e)
        {
            return null;
        }

        byte[] hash = md.digest(password.getBytes());
        StringBuilder sb = new StringBuilder();

        for (byte b : hash)
            sb.append(String.format("%02x", b));

        return sb.toString().toUpperCase();
    }

    public static Result CheckFormErrors(Http.Request request, Form form)
    {
        if (form.hasErrors())
        {
            if (request.accepts("application/json"))
                return badRequest(form.errorsAsJson());
            else if (request.accepts("application/xml"))
                return badRequest(views.xml.formerrors.render(form.errorsAsJson()));

            return status(415);
        }

        return null;
    }

    public static Result MakeRestError(Http.Request request, MessagesApi messageApi, Integer httpError, String messageId)
    {
        RestError error = RestError.makeError(messageApi.preferred(request), httpError, messageId);
        if (request.accepts("application/json"))
            return status(409, play.libs.Json.toJson(error));
        else if (request.accepts("application/xml"))
            return status(409, views.xml.resterror.render(error));

        return status(415);
    }
}
