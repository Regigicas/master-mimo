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

    static fromJSON(json: string): Usuario
    {
        let parsed = JSON.parse(json);
        return new Usuario(parsed.email, parsed.username, parsed.passHash);
    }
}

export { Usuario };
