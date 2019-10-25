const TableroSize = 3;

const Jugadores = Object.freeze(
{
    Vacio: { texto: "", id: -1, mod: 0 },
    X: { texto: "X", id: 0, mod: -1 },
    O: { texto: "O", id: 1, mod: 1 },
});

const Dificultades = Object.freeze(
{
    Facil: 0,
    Dificil: 1
});

class Tablero
{
    constructor(dimension)
    {
        this.dimension = dimension;
        this.casillas = [];

        for (let i = 0; i < this.dimension; ++i)
        {
            this.casillas[i] = [];
            for (let j = 0; j < this.dimension; ++j)
                this.casillas[i][j] = Jugadores.Vacio;
        }
    }

    emitClick(ev)
    {
        document.querySelector("#tablero").dispatchEvent(new CustomEvent("casillaClick", { "detail" : { "row": ev.target.dataset.row, "col": ev.target.dataset.col } }));
    }

    checkOcupado(i, j)
    {
        return this.casillas[i][j] !== Jugadores.Vacio;
    }

    checkCompleto()
    {
        for (let i = 0; i < this.dimension; ++i)
            for (let j = 0; j < this.dimension; ++j)
                if (this.casillas[i][j] === Jugadores.Vacio)
                    return false;

        return true;
    }

    marcarOcupado(i, j, jugador)
    {
        this.casillas[i][j] = jugador;
    }

    checkFinPartida()
    {
        for (let i = 0; i < this.dimension; ++i) // Primero comprobamos en horizontal
        {
            let sum = 0;
            for (let j = 0; j < this.dimension; ++j)
                sum += this.casillas[i][j].mod;

            if (Math.abs(sum) == this.dimension)
                return sum < 0 ? Jugadores.X : Jugadores.O;
        }

        for (let j = 0; j < this.dimension; ++j) // Despues comprobamos las verticales
        {
            let sum = 0;
            for (let i = 0; i < this.dimension; ++i)
                sum += this.casillas[i][j].mod;

            if (Math.abs(sum) == this.dimension)
                return sum < 0 ? Jugadores.X : Jugadores.O;
        }

        // Diagonales
        // De izquierda a derecha
        let sum = 0;
        for (let i = 0,  j = 0; i < this.dimension; ++i, ++j)
            sum += this.casillas[i][j].mod;
            
        if (Math.abs(sum) == this.dimension)
            return sum < 0 ? Jugadores.X : Jugadores.O;

        // De derecha a izquierda
        sum = 0;
        for (let i = this.dimension - 1, j = 0; j < this.dimension; --i, ++j)
            sum += this.casillas[i][j].mod;

        if (Math.abs(sum) == this.dimension)
            return sum < 0 ? Jugadores.X : Jugadores.O;

        return Jugadores.Vacio;
    }

    pintarTabla()
    {
        let tablaActual = document.querySelector("#tablero table");
        if (tablaActual !== null)
            tablaActual.parentElement.removeChild(tablaActual);

        let tabla = document.createElement("table");
        tabla.classList.add("centrarTabla");
        for (let i = 0; i < this.dimension; ++i)
        {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.dimension; ++j)
            {
                let td = document.createElement("td");
                td.innerHTML = this.casillas[i][j].texto;
                td.addEventListener("click", this.emitClick);
                td.dataset.row = i;
                td.dataset.col = j;
                tr.append(td);
            }

            tabla.append(tr);
        }

        document.querySelector("#tablero").appendChild(tabla);
    }

    seleccionarCasillaAleatoria()
    {
        let casillasVacias = new Array();
        for (let i = 0; i < this.dimension; ++i)
            for (let j = 0; j < this.dimension; ++j)
                if (this.casillas[i][j] === Jugadores.Vacio)
                    casillasVacias.push({ i, j });

        return casillasVacias[Math.floor(Math.random() * casillasVacias.length)];
    }

    obtenerModificadoresCasillas()
    {
        let resultados = new Array();
        resultados["horizontal"] = new Array();
        resultados["vertical"] = new Array();
        resultados["diagonalIzquierda"] = null;
        resultados["diagonalDerecha"] = null;

        for (let i = 0; i < this.dimension; ++i) // Primero comprobamos en horizontal
        {
            let sum = 0;
            let casillasLibres = [];
            for (let j = 0; j < this.dimension; ++j)
            {
                sum += this.casillas[i][j].mod;
                if (this.casillas[i][j] == Jugadores.Vacio)
                    casillasLibres.push(j);
            }

            resultados["horizontal"].push({ "casilla": i, total: sum, "libres": casillasLibres });
        }

        for (let j = 0; j < this.dimension; ++j) // Despues comprobamos las verticales
        {
            let sum = 0;
            let casillasLibres = [];
            for (let i = 0; i < this.dimension; ++i)
            {
                sum += this.casillas[i][j].mod;
                if (this.casillas[i][j] == Jugadores.Vacio)
                    casillasLibres.push(j);
            }

            resultados["vertical"].push({ "casilla": j, total: sum, "libres": casillasLibres });
        }

        // Diagonales
        // De izquierda a derecha
        let casillasLibres = [];
        let sum = 0;
        for (let i = 0,  j = 0; i < this.dimension; ++i, ++j)
        {
            sum += this.casillas[i][j].mod;
            if (this.casillas[i][j] == Jugadores.Vacio)
                casillasLibres.push(j);
        }
            
        resultados["diagonalIzquierda"] = new Array({ "casilla": 0, total: sum, "libres": casillasLibres });

        // De derecha a izquierda
        casillasLibres = [];
        sum = 0;
        for (let i = this.dimension - 1, j = 0; j < this.dimension; --i, ++j)
        {
            sum += this.casillas[i][j].mod;
            if (this.casillas[i][j] == Jugadores.Vacio)
                casillasLibres.push(j);
        }

        resultados["diagonalDerecha"] = new Array({ "casilla": 0, total: sum, "libres": casillasLibres });

        return resultados;
    }
}

class Juego
{
    constructor()
    {
        this.configurarJuego();
    }

    configurarJuego()
    {
        this.turnoActual = Jugadores.X;
        this.tableroBloqueado = true;
        this.tablero = new Tablero(TableroSize);
        
        let idInicial = Math.floor(Math.random() * (2)) + 1;
        this.jugador1 = Object.values(Jugadores)[idInicial];
        this.jugador2 = Object.values(Jugadores)[idInicial == 1 ? 2 : 1];

        this.usarIA = false;
        this.dificultad = Dificultades.Facil;

        document.querySelector("#resultado").style.display = "none";
        document.querySelector("#turno").style.display = "none";

        let clickHandler = (e) =>
        {
            let row = e.detail.row;
            let col = e.detail.col;
            this.casillaClick(row, col, false);
        };

        document.querySelector("#tablero").removeEventListener("casillaClick", clickHandler);
        document.querySelector("#tablero").addEventListener("casillaClick", clickHandler);
    }

    casillaClick(row, col, fromIA)
    {
        if (this.tableroBloqueado || this.tablero.checkOcupado(row, col))
            return;

        if (!fromIA && this.usarIA && this.turnoActual === this.jugador2) // Como la IA mueve el segundo jugador evitamos clic en el turno
            return;

        this.tablero.marcarOcupado(row, col, this.turnoActual);

        this.turnoActual = this.turnoActual === Jugadores.X ? Jugadores.O : Jugadores.X;
        if (this.turnoActual === Jugadores.X)
            document.querySelector("#turno").innerHTML = "Turno de X"
        else
            document.querySelector("#turno").innerHTML = "Turno de O"

        this.tablero.pintarTabla();
        let ganador = this.tablero.checkFinPartida();
        if (ganador !== Jugadores.Vacio)
        {
            this.tableroBloqueado = true;
            let spanResultado = document.querySelector("#resultado");
            spanResultado.style.display = "inline-block";
            if (ganador === Jugadores.X)
                spanResultado.innerHTML = "¡Gana X!"
            else
                spanResultado.innerHTML = "¡Gana O!"
        }
        else if (this.tablero.checkCompleto())
        {
            this.tableroBloqueado = true;
            let spanResultado = document.querySelector("#resultado");
            spanResultado.style.display = "inline-block";
            spanResultado.innerHTML = "¡Empate! El tablero está lleno!"
        }
        else if (this.usarIA && this.turnoActual == this.jugador2)
            this.turnoIA();
    }

    configurarIA(activa, dificultad)
    {
        this.usarIA = activa;
        this.dificultad = dificultad;
    }

    empezar()
    {
        document.querySelector("#jugador1").innerHTML = "Jugador 1: " + this.jugador1.texto;
        document.querySelector("#jugador2").innerHTML = "Jugador 2: " + this.jugador2.texto;
        let turno = document.querySelector("#turno");
        turno.style.display = "inline-block";
        turno.innerHTML = "Turno de X"
        this.tableroBloqueado = false;
        this.tablero.pintarTabla();

        if (this.usarIA && this.turnoActual === this.jugador2) // La IA siempre usa el jugador2
            this.turnoIA();
    }

    pintarTabla()
    {
        this.tablero.pintarTabla();
    }

    turnoIA()
    {
        if (!this.usarIA)
            return;

        if (this.dificultad == Dificultades.Facil)
        {
            let posicion = this.tablero.seleccionarCasillaAleatoria();
            this.casillaClick(posicion.i, posicion.j, true);
        }
        else
        {
            let resultados = this.tablero.obtenerModificadoresCasillas();
            let posiblePosicion = this.comprobarSeccionIA(resultados["horizontal"]);

            if (posiblePosicion === null)
                posiblePosicion = this.comprobarSeccionIA(resultados["vertical"]);

            if (posiblePosicion === null && resultados["diagonalIzquierda"] !== null)
                posiblePosicion = this.comprobarSeccionIA(resultados["diagonalIzquierda"]);

            if (posiblePosicion === null && resultados["diagonalDerecha"] !== null)
                posiblePosicion = this.comprobarSeccionIA(resultados["diagonalDerecha"]);

            if (posiblePosicion === null || this.tablero.checkOcupado(posiblePosicion.i, posiblePosicion.j))
                posiblePosicion = this.tablero.seleccionarCasillaAleatoria();

            this.casillaClick(posiblePosicion.i, posiblePosicion.j, true);
        }
    }

    comprobarSeccionIA(posiciones)
    {
        for (let i = 0; i < posiciones.length; ++i)
        {
            let col = posiciones[i];
            if (Math.abs(col.total) == (TableroSize - 1)) // Puede que gane el jugador o la IA
            {
                // Si la IA puede ganar o va a ganar el otro jugador intentamos ganar o bloquear
                if ((col.total < 0 && this.jugador2 === Jugadores.X) || (col.total > 0 && this.jugador2 === Jugadores.O) ||
                    (col.total < 0 && this.jugador1 === Jugadores.X) || (col.total > 0 && this.jugador1 === Jugadores.O))
                {
                    if (col.libres.length > 0)
                    {
                        let j = col.libres[0];
                        let posiblePosicion = { i, j };
                        return posiblePosicion;
                    }
                }
            }
        }

        return null;
    }
}

function reiniciarPartida()
{
    document.querySelector("#configurar").style.display = "inline-block";
    document.querySelector("#divReiniciar").style.display = "none";
    document.querySelector("#divJugar").style.display = "inline-block";
    document.querySelector("#jugadores").style.display = "none";
    juego.configurarJuego();
    juego.pintarTabla();
}

function iniciarPartida()
{
    let usarIA = document.querySelector("input[name='modoJuego']:checked").value;
    let dificultadIA = document.querySelector("input[name='dificultad']:checked").value;
    juego.configurarIA(usarIA != 0 ? true : false, Object.values(Dificultades)[dificultadIA]);

    document.querySelector("#configurar").style.display = "none";
    document.querySelector("#divReiniciar").style.display = "block";
    document.querySelector("#divJugar").style.display = "none";
    document.querySelector("#jugadores").style.display = "inline-block";
    juego.empezar();
}

var juego = new Juego();
juego.pintarTabla();
