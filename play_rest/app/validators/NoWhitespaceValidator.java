package validators;

import play.data.validation.Constraints;
import play.i18n.MessagesApi;
import play.libs.F;

import javax.inject.Inject;

public class NoWhitespaceValidator extends Constraints.Validator
{
    @Override
    public boolean isValid(Object object)
    {
        if (object instanceof String)
        {
            String username = (String)object;
            if (username != null)
                return !username.contains(" ");
        }
        return false;
    }

    @Override
    public F.Tuple<String, Object[]> getErrorMessageKey()
    {
        return new F.Tuple<>("error.no.whitespace.allowed", new Object[]{""});
    }
}
