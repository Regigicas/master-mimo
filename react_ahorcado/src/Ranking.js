import React from "react";
import "./Ranking.css";

class Ranking extends React.Component
{
    constructor(props)
    {
        super(props);

        this.SortTypes = Object.freeze({
            None: 0,
            Ganado: 1,
            Perdido: 2
        });

        this.state = {
            sortType: this.SortTypes.None
        };

        this.ordenGanadas = this.ordenGanadas.bind(this);
        this.ordenPerdidas = this.ordenPerdidas.bind(this);
        this.ordenarTabla = this.ordenarTabla.bind(this);
    }

    ordenGanadas()
    {
        this.setState(function()
        {
            return { sortType: this.SortTypes.Ganado }
        });
    }

    ordenPerdidas()
    {
        this.setState(function()
        {
            return { sortType: this.SortTypes.Perdido }
        });
    }

    render()
    {
        return (
            <div className={"col-12 mt-4" + (this.props.ocultar ? "" : " hidden")}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col" onClick={ this.ordenGanadas }>Ganadas<i
                                className={"fas float-right " + (this.state.sortType === this.SortTypes.Ganado ? "fa-sort-down" : "fa-sort") }/></th>
                            <th scope="col" onClick={ this.ordenPerdidas }>Perdidas<i
                                className={"fas float-right " + (this.state.sortType === this.SortTypes.Perdido ? "fa-sort-down" : "fa-sort") }/></th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.pintarRanking() }
                    </tbody>
                </table>
            </div>
        );
    }

    ordenarTabla(a, b)
    {
        if (this.state.sortType === this.SortTypes.Ganado)
            return a.ganadas < b.ganadas;

        return a.perdidas < b.perdidas;
    }

    pintarRanking()
    {
        if (this.props.ranking === null)
            return null;

        let datos = Object.values(this.props.ranking);
        if (this.state.sortType !== this.SortTypes.None)
            datos = datos.sort(this.ordenarTabla);

        return datos.map((datos) =>
        {
            return <tr key={ datos.nombreOriginal }>
                <td>{ datos.nombreOriginal }</td>
                <td>{ datos.ganadas }</td>
                <td>{ datos.perdidas }</td>
            </tr>
        });
    }
}

export default Ranking;
