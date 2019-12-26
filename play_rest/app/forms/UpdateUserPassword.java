package forms;

import misc.MiscUtils;
import play.data.validation.Constraints;

public class UpdateUserPassword
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
}
