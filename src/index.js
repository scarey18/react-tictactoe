import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import {Game, random} from './game';

import Scoreboard from './components/Scoreboard';
import Board from './components/Board';
import Btn from './components/Btn';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameState: null,
			squares: null,
			game: null,
			player: {
				score: 0,
				symbol: 'X',
			},
			cpu: {
				score: 0,
				symbol: 'O',
			},
		}
	}

	setMessage() {
		switch (this.state.gameState) {
			case null: {
				return "Welcome!";
			}
			case "playing": {
				return "You are " + this.state.player.symbol;
			}
			case 'player': {
				return "You win!";
			}
			case 'cpu': {
				return "You lose!";
			}
			case "draw": {
				return "It's a draw!";
			}
			default: {
				break;
			}
		}
	}

	startGame() {
		const squares = Array(9).fill(null);
		const game = new Game();
		if (this.state.cpu.symbol === 'X') {
			const id = random(game.squares);
			squares[id] = this.state.cpu.symbol;
			game.makeMove(game.player2, id);
		}
		this.setState({
			gameState: 'playing',
			squares,
			game,
		});
	}

	handleClick(id) {
		if (this.state.gameState !== 'playing' || this.state.squares[id]) {
			return;
		}
		const squares = this.state.squares.slice();
		const game = this.state.game;
		squares[id] = this.state.player.symbol;
		let gameState = game.makeMove(game.player1, id);
		if (gameState) {
			return this.endGame(gameState, squares);
		}
		const cpuMove = game.evaluateBoard(game.player2);
		squares[cpuMove] = this.state.cpu.symbol;
		gameState = game.makeMove(game.player2, cpuMove);
		if (gameState) {
			return this.endGame(gameState, squares);
		}
		this.setState({squares});
	}

	endGame(gameState, squares) {
		this.setState(state => {
			const newState = {gameState, squares};
			if (gameState !== 'draw') {
				newState[gameState] = {
					score: state[gameState].score + 1,
					symbol: state[gameState].symbol,
				}
			}
			return newState;
		});
	}

	switchSymbol(symbol) {
		this.setState({
			player: {
				symbol,
				score: this.state.player.score,
			},
			cpu: {
				symbol: symbol === 'X' ? 'O' : 'X',
				score: this.state.cpu.score,
			},
		});
	}

	render() {
		return (
			<div className="hero">
				<div className="hero-body">
					<div className="container">

						<Scoreboard
							message={this.setMessage()}
							playerScore={this.state.player.score}
							cpuScore={this.state.cpu.score}
						/>

						<Board 
							squares={this.state.squares}
							gameState={this.state.gameState}
							onClick={id => this.handleClick(id)}
						/>

						<div className="level is-mobile has-text-light" id="start-button-level">
							<Btn 
								classList=" level-item is-large is-link"
								id="start-button"
								gameState={this.state.gameState}
								value="Start Game"
								onClick={() => this.startGame()}
								isSelected={false}
							/>
						</div>

						<div className="level is-mobile has-text-light" id="option-buttons">
							<Btn
								classList=" level-item option is-size-6 is-size-7-mobile"
								id="go-first"
								gameState={this.state.gameState}
								value="Go first (X)"
								isSelected={this.state.player.symbol === 'X'}
								onClick={() => this.switchSymbol('X')}
							/>
						
							<Btn
								classList=" level-item option is-size-6 is-size-7-mobile"
								id="go-second"
								gameState={this.state.gameState}
								value="Go second (O)"
								isSelected={this.state.player.symbol === 'O'}
								onClick={() => this.switchSymbol('O')}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


ReactDOM.render(<App />, document.getElementById('root'));