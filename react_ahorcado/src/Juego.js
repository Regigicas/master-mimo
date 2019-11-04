import React from "react";
import "./Juego.css";
import Letra from "./Letra"

const Dificultades = Object.freeze(
{
    Facil: 0,
    Medio: 1,
    Dificil: 2
});

class Juego extends React.Component
{
    constructor(props)
    {
        super(props);

        let palabras = [ "Coche", "Vaca", "Semaforo" ];
        let palabra = palabras[Math.floor(Math.random() * palabras.length )];
        let letras = "abcdefghijklmnñopqrstuvwxyz".split("");
        this.state =
        {
            palabras: palabras,
            palabra: palabra,
            jugando: false,
            dificultad: Dificultades.Facil,
            numIntentos: 0,
            tiempoRestante: 0,
            finTiempo: false,
            letras: letras,
            letrasUsadas: [],
            acertadas: [],
            ganado: false,
            perdido: false,
            username: "",
            partidaTerminada: false
        };

        this.dificultadChange = this.dificultadChange.bind(this);
        this.clickJugar = this.clickJugar.bind(this);
        this.agotoTiempo = this.agotoTiempo.bind(this);
        this.clickReiniciar = this.clickReiniciar.bind(this);
        this.clickLetra = this.clickLetra.bind(this);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.Dificultades = Dificultades;
    }

    dificultadChange(event)
    {
        let nueva = Object.values(this.Dificultades)[event.target.value];
        this.setState(function()
        {
            return { dificultad: nueva }
        });
    }

    clickJugar()
    {
        if (this.state.username === "")
        {
            alert("¡Introduce tu nombre!")
            return;
        }

        let partidaActual = localStorage.getItem("partidaActual_" + this.state.username.toLowerCase());
        partidaActual = partidaActual !== null ? JSON.parse(partidaActual) : null;
        if (partidaActual !== null && partidaActual.terminado === false && partidaActual.username.toLowerCase().localeCompare(this.state.username.toLowerCase()) === 0)
        {
            console.log(partidaActual);
            this.setState(function()
            {
                return {
                    jugando: true,
                    numIntentos: partidaActual.numIntentos,
                    finTiempo: false,
                    palabra: partidaActual.palabra,
                    letrasUsadas: partidaActual.letrasUsadas,
                    acertadas: partidaActual.acertadas,
                    terminado: false
                }
            });
        }
        else
        {

            let tiempoRestante = 0;
            let multiplier = 1.0;

            switch (this.state.dificultad)
            {
                case this.Dificultades.Facil:
                    multiplier = 1.5;
                    break;
                case this.Dificultades.Medio:
                    tiempoRestante = 120000; // 2 minutos en milisegundos
                    break;
                case this.Dificultades.Dificil:
                    tiempoRestante = 60000; // 1 minuto en milisegundos
                    multiplier = 0.8;
                    break;
                default:
                    break;
            }

            let intentos = Math.floor(this.state.palabra.length * multiplier);
            let palabra = this.state.palabras[Math.floor(Math.random() * this.state.palabras.length )];

            this.setState(function()
            {
                return {
                    jugando: true,
                    numIntentos: intentos,
                    finTiempo: false,
                    palabra: palabra
                }
            });

            if (tiempoRestante !== 0)
                setTimeout(this.agotoTiempo, tiempoRestante);

            localStorage.setItem("partidaActual_" + this.state.username.toLowerCase(), JSON.stringify(
                { 
                    username: this.state.username,
                    palabra: palabra,
                    numIntentos: intentos,
                    letrasUsadas: [],
                    acertadas: [],
                    terminado: false
                }));
        }
    }

    clickReiniciar()
    {
        localStorage.removeItem("partidaActual_" + this.state.username.toLowerCase());
        clearInterval(this.agotoTiempo);
        this.setState(function()
        {
            return {
                jugando: false,
                letrasUsadas: [],
                acertadas: [],
                finTiempo: false,
                ganado: false,
                perdido: false,
                username: "",
                partidaTerminada: false
            }
        });
    }

    agotoTiempo()
    {
        this.setState(function()
        {
            return {
                finTiempo: true,
                perdido: true,
                partidaTerminada: true
            }
        });
    }

    getLiPalabras()
    {
        let contador = 0;
        return this.state.palabra.split("").map((letra) =>
        {
            return <li className="casilla" key={contador++}>{ this.state.acertadas.indexOf(letra.toLowerCase()) > -1 ? letra : "" }</li>
        });
    }

    clickLetra(event)
    {
        let key = event.target.dataset.key;
        let letrasUsadas = this.state.letrasUsadas;
        if (this.state.partidaTerminada || letrasUsadas.indexOf(parseInt(key)) > -1)
            return;

        letrasUsadas.push(parseInt(key));

        let letra = this.state.letras[key].toLowerCase();
        let letrasPalabra = this.state.palabra.toLowerCase().split("");
        let acierto = letrasPalabra.indexOf(letra) > -1;
        let intentos = this.state.numIntentos;
        let acertadas = this.state.acertadas;
        let perdido = false;
        let ganado = false;
        if (!acierto)
        {
            --intentos;
            if (intentos <= 0)
                perdido = true;
        }
        else
            acertadas.push(letra);

        if (!perdido)
        {
            let letrasRestantes = letrasPalabra.filter((e) =>
            {
                return acertadas.indexOf(e) === -1;
            });

            if (letrasRestantes.length === 0)
            {
                ganado = true;
                clearInterval(this.agotoTiempo);
            }
        }

        let partidaActual = localStorage.getItem("partidaActual_" + this.state.username.toLowerCase());
        partidaActual = partidaActual !== null ? JSON.parse(partidaActual) : null;
        if (partidaActual !== null)
        {
            partidaActual.acertadas = acertadas;
            partidaActual.numIntentos = intentos;
            partidaActual.letrasUsadas = letrasUsadas;
            partidaActual.terminado = ganado || perdido;
            localStorage.setItem("partidaActual_" + this.state.username.toLowerCase(), JSON.stringify(partidaActual));
        }

        this.setState(function()
        {
            return {
                letrasUsadas: letrasUsadas,
                numIntentos: intentos,
                acertadas: acertadas,
                ganado: ganado,
                perdido: perdido,
                partidaTerminada: ganado || perdido
            }
        });
    }

    usernameChanged(event)
    {
        let nombre = event.target.value;
        this.setState(function()
        {
            return {
                username: nombre
            }
        });
    }

    render()
    {
        if (this.state.jugando)
        {
            let finTiempo = this.state.finTiempo ?
            <div className="col-12">
                <span>Se acabo el tiempo</span>
            </div> : "";

            let divGanado = this.state.ganado ?
            <div className="col-12 mt-3">
                <span>¡Has Ganado!</span>
            </div> : "";

            let divPerdido = this.state.perdido ?
            <div className="col-12 mt-3">
                <span>¡Has Perdido!</span>
            </div> : "";

            return (
                <div className="row">
                    <div className="col-12">
                        {/*<h2>Se ha seleccionado la palabra: { this.state.palabra }</h2>*/}
                        <h3>Jugando como <b>{ this.state.username }</b></h3>
                        <h4>Número de intentos restantes: { this.state.numIntentos }</h4>
                    </div>
                    <div className="col-12 mt-1 espaciado">
                        <ul>
                            { this.getLiPalabras() }
                        </ul>
                    </div>
                    <div className="col-12 mt-3">
                        <Letra letras={ this.state.letras } clickLetra={ this.clickLetra } letrasUsadas={ this.state.letrasUsadas }></Letra>
                    </div>
                    <div className="col-12 mt-2">
                        <input className="btn btn-warning" type="button" value="Reiniciar" onClick={ this.clickReiniciar }/>
                    </div>

                    { finTiempo }
                    { divGanado }
                    { divPerdido }
                </div>
            );
        }
        else
        {
            return (
                <div className="row">
                    <div className="col-12">
                        <h2>¡Introduce tu nombre, selecciona una dificultad y dale a jugar!</h2>
                    </div>

                    <div className="col-12 mt-2">
                    <label>Nombre de usuario</label>
                    <input type="text" placeholder="Nombre de usuario" className="form-control" name="username" onChange={ this.usernameChanged }/>
                    </div>

                    <div className="col-12 mt-2">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className={"btn btn-secondary" + (this.state.dificultad === this.Dificultades.Facil ? " active" : "") }>
                                <input type="radio" name="dificultad" checked={this.state.dificultad === this.Dificultades.Facil}
                                onChange={this.dificultadChange} value={this.Dificultades.Facil}/> Fácil
                            </label>
                            <label className={"btn btn-secondary" + (this.state.dificultad === this.Dificultades.Medio ? " active" : "") }>
                                <input type="radio" name="dificultad" checked={this.state.dificultad === this.Dificultades.Medio}
                                onChange={this.dificultadChange} value={this.Dificultades.Medio}/> Medio
                            </label>
                            <label className={"btn btn-secondary" + (this.state.dificultad === this.Dificultades.Dificil ? " active" : "") }>
                                <input type="radio" name="dificultad" checked={this.state.dificultad === this.Dificultades.Dificil}
                                onChange={this.dificultadChange} value={this.Dificultades.Dificil}/> Dificil
                            </label>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <input className="btn btn-primary" type="button" value="Jugar" onClick={ this.clickJugar }/>
                    </div>

                </div>
            );
        }
    }
}

export default Juego;
