import React from 'react';

import { PATTERNS } from '../game';
import Square from './Square';


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


export default Board;