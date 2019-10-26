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

Vue.component("casilla",
{
    props: [ "i", "j", "jugador" ],
    methods:
    {
        casillaClick()
        {
            this.$emit("tcClick", this.i, this.j, false);
        }
    },
    template: `
        <td @click="casillaClick">{{ jugador.texto }}</td>
    `
});

Vue.component("tablero",
{
    props: [ "dimension" ],
    methods: {
        tcClick(row, col, fromIA)
        {
            if (this.tableroBloqueado || this.checkOcupado(row, col))
                return;

            if (!fromIA && this.usarIA && this.turnoActual === this.jugador2) // Como la IA mueve el segundo jugador evitamos clic en el turno
                return;

            this.marcarOcupado(row, col, this.turnoActual);

            this.turnoActual = this.turnoActual === Jugadores.X ? Jugadores.O : Jugadores.X;

            let ganador = this.checkFinPartida();
            if (ganador !== Jugadores.Vacio)
            {
                this.ganador = ganador;
                this.tableroBloqueado = true;
            }
            else if (this.checkCompleto())
            {
                this.ganador = Jugadores.Vacio;
                this.tableroGanador = true;
            }
            else if (this.usarIA && this.turnoActual === this.jugador2)
                this.turnoIA();
        },

        marcarOcupado(i, j, jugador)
        {
            this.$set(this.casillas[i], j, jugador) // Cambio reactivo, de forma normal no actualiza el display
        },

        checkOcupado(i, j)
        {
            return this.casillas[i][j] !== Jugadores.Vacio;
        },

        obtenerJugadorDeCasilla(i, j)
        {
            return this.casillas[i][j];
        },
    
        checkCompleto()
        {
            for (let i = 0; i < this.dimension; ++i)
                for (let j = 0; j < this.dimension; ++j)
                    if (this.casillas[i][j] === Jugadores.Vacio)
                        return false;
    
            return true;
        },

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
        },

        seleccionarCasillaAleatoria()
        {
            let casillasVacias = new Array();
            for (let i = 0; i < this.dimension; ++i)
                for (let j = 0; j < this.dimension; ++j)
                    if (this.casillas[i][j] === Jugadores.Vacio)
                        casillasVacias.push({ i, j });
    
            return casillasVacias[Math.floor(Math.random() * casillasVacias.length)];
        },

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
                    if (this.casillas[i][j] === Jugadores.Vacio)
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
                    if (this.casillas[i][j] === Jugadores.Vacio)
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
                if (this.casillas[i][j] === Jugadores.Vacio)
                    casillasLibres.push(j);
            }
                
            resultados["diagonalIzquierda"] = new Array({ "casilla": 0, total: sum, "libres": casillasLibres });
    
            // De derecha a izquierda
            casillasLibres = [];
            sum = 0;
            for (let i = this.dimension - 1, j = 0; j < this.dimension; --i, ++j)
            {
                sum += this.casillas[i][j].mod;
                if (this.casillas[i][j] === Jugadores.Vacio)
                    casillasLibres.push(j);
            }
    
            resultados["diagonalDerecha"] = new Array({ "casilla": 0, total: sum, "libres": casillasLibres });
    
            return resultados;
        },

        turnoIA()
        {
            if (this.dificultad == Dificultades.Facil)
            {
                let posicion = this.seleccionarCasillaAleatoria();
                this.tcClick(posicion.i, posicion.j, true);
            }
            else
            {
                let resultados = this.obtenerModificadoresCasillas();
                let posiblePosicion = this.comprobarSeccionIA(resultados["horizontal"]);
    
                if (posiblePosicion === null)
                    posiblePosicion = this.comprobarSeccionIA(resultados["vertical"]);
    
                if (posiblePosicion === null && resultados["diagonalIzquierda"] !== null)
                    posiblePosicion = this.comprobarSeccionIA(resultados["diagonalIzquierda"]);
    
                if (posiblePosicion === null && resultados["diagonalDerecha"] !== null)
                    posiblePosicion = this.comprobarSeccionIA(resultados["diagonalDerecha"]);
    
                if (posiblePosicion === null || this.checkOcupado(posiblePosicion.i, posiblePosicion.j))
                    posiblePosicion = this.seleccionarCasillaAleatoria();

                this.tcClick(posiblePosicion.i, posiblePosicion.j, true);
            }
        },

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
        },
        
        iniciarPartida()
        {
            let idInicial = Math.floor(Math.random() * (2)) + 1;
            this.jugador1 = Object.values(Jugadores)[idInicial];
            this.jugador2 = Object.values(Jugadores)[idInicial == 1 ? 2 : 1];

            this.tableroBloqueado = false;
            this.jugando = true;
            this.ganador = null;
            this.turnoActual = Jugadores.X;

            if (this.usarIA && this.turnoActual === this.jugador2)
                this.turnoIA();
        },

        reiniciarPartida()
        {
            this.tableroBloqueado = true;
            this.jugando = false;
            this.ganador = null;
            for (let i = 0; i < this.dimension; ++i)
                for (let j = 0; j < this.dimension; ++j)
                    this.$set(this.casillas[i], j, Jugadores.Vacio);
        },

        setIA(ev)
        {
            this.usarIA = ev.target.value != 0 ? true : false;
        },

        setDificultadIA(ev)
        {
            this.dificultad = Object.values(this.Dificultades)[ev.target.value]
        }
    },
    data: function()
    {
        casillas = [];
        for (let i = 0; i < this.dimension; ++i)
        {
            casillas[i] = [];
            for (let j = 0; j < this.dimension; ++j)
                casillas[i][j] = Jugadores.Vacio;
        }

        let idInicial = Math.floor(Math.random() * (2)) + 1;
        jugador1 = Object.values(Jugadores)[idInicial];
        jugador2 = Object.values(Jugadores)[idInicial == 1 ? 2 : 1];

        return {
            casillas: casillas,
            Jugadores: Jugadores,
            Dificultades: Dificultades,
            TableroSize: TableroSize,
            turnoActual: Jugadores.X,
            jugando: false,
            jugador1: jugador1,
            jugador2: jugador2,
            usarIA: false,
            dificultad: Dificultades.Facil,
            tableroBloqueado: true,
            ganador: null
        }
    },
    template: `
        <div class="centrarDiv">
            <h2 v-if="turnoActual === Jugadores.X && jugando" id="turnoX">Turno de X</h2>
            <h2 v-else-if="turnoActual === Jugadores.O && jugando" id="turnoO">Turno de O</h2>
            <h2 v-else id="configurar">¡Configura el modo de juego y dale a jugar!</h2>

            <table id="tablero" class="centrarTabla">
                <tr v-for="(idx1, i) in dimension">
                    <casilla v-for="(idx2, j) in dimension" :key="i + ' ' + j" v-bind:i="i" v-bind:j="j" v-on:tcClick="tcClick"
                    v-bind:jugador="casillas[i][j]"></casilla>
                </tr>
            </table>

            <div v-if="!jugando" id="divJugar" class="espaciado">
                <button class="espaciado" v-on:click="iniciarPartida">Iniciar partida</button>
                <fieldset class="espaciado bloqueLinea" id="estadoIA">
                    <input type="radio" name="modoJuego" value="0" v-bind:checked="usarIA ? false : true" @click="setIA"> <label>Sin IA</label>
                    <input type="radio" name="modoJuego" value="1" v-bind:checked="usarIA ? true : false" @click="setIA"> <label>Con IA</label>
                </fieldset>
                <fieldset class="espaciado bloqueLinea" id="dificultadIA">
                    <input type="radio" name="dificultad" value="0" v-bind:checked="dificultad == Dificultades.Facil ? false : true" @click="setDificultadIA"> <label>IA Facil</label>
                    <input type="radio" name="dificultad" value="1" v-bind:checked="dificultad == Dificultades.Facil ? false : true" @click="setDificultadIA"> <label>IA Avanzada</label>
                </fieldset>
            </div>
            <div v-else>
                <div id="jugadores" class="espaciado">
                    <span id="jugador1">Jugador 1: {{ jugador1.texto }}</span>
                    <span>&emsp;-&emsp;</span>
                    <span id="jugador2">Jugador 2: {{ jugador2.texto }}</span>
                </div>

                <div id="divReiniciar">
                    <button class="espaciado" id="botonReiniciar" v-on:click="reiniciarPartida">Reiniciar partida</button>
                </div>
            </div>

            <span v-if="ganador !== null && ganador != Jugadores.Vacio" id="resultado"><br>¡Gana {{ ganador.texto }}!</span>
            <span v-else-if="ganador !== null" id="resultado"><br>¡Empate! El tablero está lleno!</span>
        </div>
    `
});

let app = new Vue(
{
    el: "#app",
    data: {
        TableroSize: TableroSize
    },
    template: `
        <tablero v-bind:dimension="TableroSize"></tablero>
    `
});
