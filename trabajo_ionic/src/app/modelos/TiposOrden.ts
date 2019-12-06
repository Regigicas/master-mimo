enum TiposOrden
{
    PorDefecto = 0,
    Nombre = 1,
    FechaSalida = 2,
    Rating = 3
}

class TiposOrdenUtil
{
    static ToString(t: TiposOrden): string
    {
        switch (t)
        {
            case TiposOrden.PorDefecto:
                return "Por Defecto";
            case TiposOrden.Nombre:
                return "Nombre";
            case TiposOrden.FechaSalida:
                return "Fecha de salida";
            case TiposOrden.Rating:
                return "Valoración";
            default:
                break;
        }

        return "error";
    }

    static PorNombre(a, b)
    {
        return a.name > b.name ? 1 : -1;
    }

    static PorFechaSalida(a, b)
    {
        let datea = new Date(a.released);
        let dateb = new Date(b.released);
        return datea > dateb ? 1 : -1;
    }

    static PorValoracion(a, b)
    {
        return a.rating > b.rating ? 1 : -1;
    }
}

export { TiposOrden, TiposOrdenUtil };
