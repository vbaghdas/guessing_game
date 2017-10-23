import React, { Component } from 'react';

class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            randomNum: 0,
            guess: '',
            guessInput: '',
            guessCount: 0,
            score: 'Not Set',
            min: 1,
            max: 10000,
            lowestScore: [],
            displayLow: false,
            displayCorrect: false,
            displayHigh: false,
            displayNull: false
        };
        this.generateRandomNum = this.generateRandomNum.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.onShake = this.onShake.bind(this);
        this.handleDisplay = this.handleDisplay.bind(this);
    }

    componentWillMount() {
        const lowestScore = localStorage.lowestScore;

        if(lowestScore){
            this.setState({
              lowestScore: JSON.parse(lowestScore)
            })
        }
    }

    componentDidUpdate() {
        const { lowestScore } = this.state;
        if (localStorage.lowestScore !== lowestScore){
            localStorage.lowestScore = JSON.stringify(lowestScore);
        }
    }

    componentDidMount() {
        this.setState ({
            randomNum: this.generateRandomNum()
        });
    }

    generateRandomNum() {
        const { min, max } = this.state;
        return Math.floor(Math.random() * (max - min) + min);
    }

    handleUserInput(e) {
        if(!isNaN(e.target.value)){
            this.setState ({
                guessInput: e.target.value,
            })
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { guessInput, guessCount } = this.state;
        this.setState({
            guess: parseInt(guessInput),
            guessInput: '',
            guessCount: guessCount + 1,
        });
        this.displayMessage();
        console.log('This is the random number', this.state.randomNum);
    }

    handleDisplay() {
        this.setState ({
            displayLow: false,
            displayCorrect: false,
            displayHigh: false,
            displayNull: true
        })
    }

    displayMessage() {
        const { lowestScore, guessCount, guessInput, randomNum } = this.state;
        const userGuess = parseInt(guessInput);
        if(userGuess === randomNum){
            const newStateArray = lowestScore;
            newStateArray.push(guessCount);
            this.setState ({
                message: ' | You got it!',
                randomNum: this.generateRandomNum(),
                score: guessCount,
                guessCount: 0,
                lowestScore: newStateArray,
                displayCorrect: true
            });
        } else if (userGuess > randomNum){
            this.setState ({
                message: ' is Too High!',
                displayHigh: true
            });
        } else if (userGuess < randomNum){
            this.setState ({
                message: ' is Too Low!',
                displayLow: true
            });
        } else if (isNaN(userGuess)){
            this.setState ({
                message: 'Please enter a number!',
                guess: '',
                displayNull: false
            });
        }
    }

    resetGame() {
        this.setState ({
            randomNum: this.generateRandomNum(),
            guess: '',
            guessInput: '',
            guessCount: 0,
            min: 1,
            max: 10000,
            message: '',
            displayNull: this.handleDisplay()
        });
    }

    onShake() {
        this.setState ({ shake: true }, () => {
            setTimeout (() => this.setState ({ shake: false }), 1000);
        });
    }

    render(){
        const { displayHigh, displayLow, displayCorrect, guessInput, guess, guessCount, lowestScore, shake, message } = this.state;
        return (
            <div className="gameArea">
                <h1 className="text-center my-3">Guessing Game</h1>
                <form onSubmit={ this.handleSubmit }>
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <input value={ guessInput } onChange={ this.handleUserInput } onClick={ this.handleDisplay }  className={"form-control form-control-lg user-input " +
                            (displayLow ? 'displayLow' : displayHigh ? 'displayHigh' : displayCorrect ? 'displayCorrect' : '')}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <button onClick={ this.resetGame } className="btn btn-lg btn-outline-danger col-2 m-3" type="button">Reset Game</button>
                        <button onClick={ this.onShake } className="btn btn-lg btn-outline-success col-2 m-3">Guess</button>
                    </div>
                </form>
                <h1 className={"text-center my-3 " + ( shake ? 'shake' : '') }>{ guess } { message }</h1>
                <p className="text-center">Current Number of Guesses: { guessCount } | Lowest Score: { lowestScore.length ? Math.min(...lowestScore) : 0 } </p>
            </div>
        )
    }
}

export default Game;