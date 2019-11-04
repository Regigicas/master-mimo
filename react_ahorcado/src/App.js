import React from 'react';
import './App.css';
import Juego from "./Juego"

class App extends React.Component
{
    render()
    {
        return (
            <div className="container">
                <Juego>
                </Juego>
            </div>
        );
    }
}

export default App;
