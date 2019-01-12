import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game, PATTERNS, random} from './game';


class Scoreboard extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="level">
					<h1 className="level-item title has-text-light" id="message">
						{this.props.message}
					</h1>
				</div>
				<div className="level is-mobile has-text-light" id="scoreboard">
					<div className="level-item has-text-centered">
						<div>
							<p id="player-symbol">Player</p>
							<p id="player-score">{this.props.playerScore}</p>
						</div>
					</div>
					<div className="level-item has-text-centered">
						<div>
							<p id="cpu-symbol">CPU</p>
							<p id="cpu-score">{this.props.cpuScore}</p>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}	
}


class Square extends React.Component {
	getClassList() {
		let classList = "cell has-text-centered";
		if (this.props.id < 6) {
			classList += " no-bottom-border";
		}
		if ([0, 1, 3, 4, 6, 7].includes(this.props.id)) {
			classList += " no-right-border";
		}
		if (this.props.highlighted) {
			classList += " highlighted";
		}
		return classList;
	}

	render() {
		return (
			<div 
				className={this.getClassList()} 
				onClick={() => this.props.onClick()}
			>
				{this.props.value}
			</div>
		)
	}
}


class Board extends React.Component {
	mapValues(id) {
		if (this.props.gameState === null) {
			const message = ['T', 'I', 'C', 'T', 'A', 'C', 'T', 'O', 'E'];
			return message[id];
		}
		else {
			return this.props.squares[id];
		}
	}

	highlight(id) {
		if (this.props.gameState === null) {
			return (id % 3 === 0);
		}
		else if (['player', 'cpu'].includes(this.props.gameState)) {
			const squares = this.props.squares;
			for (const pattern of PATTERNS.filter(p => p.includes(id))) {
				const [a, b, c] = pattern;
				if (squares[a] &&
						squares[a] === squares[b] &&
						squares[a] === squares[c]) {
					return true;
				}
			}
		}
	}

	render() {
		const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		return (
			<div className="board has-text-light">
				{squares.map(id => {
					return <Square 
									 id={id}
									 key={id} 
									 value={this.mapValues(id)}
									 highlighted={this.highlight(id)}
									 onClick={() => this.props.onClick(id)}
								 />
				})}
			</div>
		);
	}
}


class Btn extends React.Component {
	getClassList() {
		let classList = "button" + this.props.classList;
		if (this.props.isSelected) {
			classList += " is-selected";
		}
		return classList;
	}

	render() {
		return (
			<button
				className={this.getClassList()}
				id={this.props.id}
				disabled={this.props.gameState === 'playing'}
				onClick={() => this.props.onClick()}
			>
				{this.props.value}
			</button>
		);
	}
}


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