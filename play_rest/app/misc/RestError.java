package misc;

import play.i18n.Messages;
import play.i18n.MessagesApi;
import play.mvc.Http;

public class RestError
{
    public static RestError makeError(Messages messages, Integer httpError, String messageId)
    {
        String messageResult = messages.at(messageId);
        return new RestError(httpError, messageResult);
    }

    public Integer httpError;
    public String message;

    public RestError(Integer httpError, String message)
    {
        this.httpError = httpError;
        this.message = message;
    }
}
