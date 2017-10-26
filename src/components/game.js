import React, { Component } from 'react';
import History from './history';

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
            history: [],
            displayLow: false,
            displayCorrect: false,
            displayHigh: false,
            displayNull: false
        };
        this.generateRandomNum = this.generateRandomNum.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDisplay = this.handleDisplay.bind(this);
        this.handleShake = this.handleShake.bind(this);
        this.handleGuess = this.handleGuess.bind(this);
        this.resetGame = this.resetGame.bind(this);
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
        this.handleGuess();
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

    handleShake() {
        this.setState ({ shake: true }, () => {
            setTimeout (() => this.setState ({ shake: false }), 1000);
        });
    }

    handleGuess() {
        const { lowestScore, guess, guessCount, guessInput, randomNum, history } = this.state;
        const userGuess = parseInt(guessInput);
        const newStateArray = lowestScore;
        const updates = {};
        
        if(userGuess !== randomNum){
            newStateArray.push(guessCount);
            updates.message = (userGuess > randomNum) ? 'Too High' : 'Too Low';
            updates.displayHigh = (userGuess > randomNum) ? true : false;
            updates.displayLow = (userGuess < randomNum) ? true : false;
        }
        if(userGuess === randomNum){
            updates.message = 'You Guessed It!';
            updates.randomNum = this.generateRandomNum();
            updates.score = guessCount;
            updates.guessCount = 0;
            updates.lowestScore = newStateArray;
            updates.displayCorrect = true;
        }
        if(isNaN(userGuess)){
            updates.message = 'Please enter a number';
            updates.guess = '';
            updates.displayNull = false;
        }
        updates.history = [{guess: userGuess, result: updates.message}, ...history];
        this.setState(updates);
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
            history: [],
            displayNull: this.handleDisplay()
        });
    }

    render(){
        const { displayHigh, displayLow, displayCorrect, guessInput, guess, guessCount, lowestScore, shake, message, history } = this.state;
        return (
            <div className="gameArea">
                <h1 className="text-center my-3">Guessing Game</h1>
                <h3 className="text-center my-3">Choose a number between 1 - 10,000</h3>
                <form onSubmit={ this.handleSubmit }>
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <input value={ guessInput } onChange={ this.handleUserInput } onClick={ this.handleDisplay }  className={"form-control form-control-lg user-input mt-3 " +
                            (displayLow ? 'displayLow' : displayHigh ? 'displayHigh' : displayCorrect ? 'displayCorrect' : '')}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <button onClick={ this.handleShake } className="btn btn-lg btn-outline-success col-xs-6 m-3">Guess Number</button>
                        <button onClick={ this.resetGame } className="btn btn-lg btn-outline-danger col-xs-6 m-3" type="button">Reset Game</button>
                    </div>
                </form>
                <h1 className={"text-center my-3 " + ( shake ? 'shake' : '') }>{ message }</h1>
                <p className="text-center">Current Number of Guesses: { guessCount } | Lowest Score: { lowestScore.length ? Math.min(...lowestScore) : 0 } </p>
                <div><History list={history}/></div>
            </div>
        )
    }
}

export default Game;