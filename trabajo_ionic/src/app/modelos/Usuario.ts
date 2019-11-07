class Usuario
{
    email: string;
    username: string;
    passHash: string;
    favoritos: Array<any>;

    constructor(email: string, username: string, passHash: string)
    {
        this.email = email;
        this.username = username;
        this.passHash = passHash;
    }

    getUsername() : string
    {
        return this.username;
    }
}

export { Usuario };
