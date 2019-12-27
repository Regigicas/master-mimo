package misc;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

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
}
