import React, { Component } from 'react';

class Game extends Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return (
            <div>
                <h1 className="text-center my-3">Guessing Game</h1>
            </div>
        )
    }
}

export default Game;
