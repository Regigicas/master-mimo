package forms;

import misc.MiscUtils;
import play.data.validation.Constraints;
import play.data.validation.ValidationError;

public class UpdateUserPassword implements Constraints.Validatable<ValidationError>
{
    @Constraints.Required
    public String oldPassword;

    @Constraints.MinLength(8)
    @Constraints.Required
    public String newPassword;

    public String getOldPassword()
    {
        return oldPassword;
    }

    public String getNewPassword()
    {
        return newPassword;
    }

    public void setOldPassword(String oldPassword)
    {
        this.oldPassword = oldPassword;
    }

    public void setNewPassword(String newPassword)
    {
        this.newPassword = newPassword;
    }

    public boolean convertPasswords()
    {
        String oldHash = MiscUtils.MakeHash(this.oldPassword.trim());
        String newHash = MiscUtils.MakeHash(this.newPassword.trim());
        if (oldHash != null)
            oldPassword = oldHash;
        else
            return false;

        if (newHash != null)
            newPassword = newHash;
        else
            return false;

        return true;
    }

    @Override
    public ValidationError validate()
    {
        if (oldPassword.equals(newPassword))
            return new ValidationError("ingredientes", "error.samepassword");

        return null;
    }
}
