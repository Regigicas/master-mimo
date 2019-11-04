import React from "react";
import "./Letra.css";

class Letra extends React.Component
{
    render()
    {
        return (
            <ul>
                { this.getLiLetras() }
            </ul>
        );
    }

    getLiLetras()
    {
        let contador = 0;
        return this.props.letras.map((letra) =>
        {
            let disabled = this.props.letrasUsadas.indexOf(contador) > -1;
            return <li className={"letra" + (disabled ? " usada" : "") } data-key={contador} key={contador++}
            onClick={ disabled ? null : this.props.clickLetra }>{ letra }</li>
        });
    }
}

export default Letra;
