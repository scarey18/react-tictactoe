export const PATTERNS = [
									 [0, 1, 2],
									 [3, 4, 5],
									 [6, 7, 8],
									 [0, 3, 6],
									 [1, 4, 7],
									 [2, 5, 8],
									 [0, 4, 8],
									 [2, 4, 6],
								 ]


export class Game {
	constructor() {
		this.squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		this.patterns = PATTERNS.map(p => p.slice());
		this.player1 = {
			alias: 'player',
			patterns: [],
		}
		this.player2 = {
			alias: 'cpu',
			patterns: [],
		}
	}

	makeMove(player, id) {
		removeFromArr(id, this.squares);

		const playerPatterns = player.patterns.filter(p => p.includes(id));
		for (const pattern of playerPatterns) {
			removeFromArr(id, pattern);
			if (pattern.length === 0) {
				return player.alias;
			}
		}

		if (this.squares.length === 0) {
			return 'draw';
		}
		
		const unownedPatterns = this.patterns.filter(p => p.includes(id));
		unownedPatterns.forEach(pattern => {
			removeFromArr(id, pattern);
			removeFromArr(pattern, this.patterns);
			player.patterns.push(pattern);
		});

		const opp = player === this.player1 ? this.player2 : this.player1;
		const oppPatterns = opp.patterns.filter(p => p.includes(id));
		oppPatterns.forEach(pattern => {
			removeFromArr(pattern, opp.patterns);
		});
	}

	evaluateBoard(player) {
		const opp = player === this.player1 ? this.player2 : this.player1;

		for (const patterns of [player.patterns, opp.patterns]) {
			const winningMoves = patterns.filter(p => p.length === 1);
			if (winningMoves.length > 0) {
				return random(winningMoves)[0];
			}
		}

		const playerTraps = findTraps(player.patterns);
		if (playerTraps.length > 0) {
			return random(playerTraps);
		}

		const oppTraps = findTraps(opp.patterns);
		if (oppTraps.length === 1) {
			return random(oppTraps);
		} else if (oppTraps.length > 1) {
			const safeMoves = [];
			player.patterns.forEach(pattern => {
				pattern.forEach(a => {
					const b = pattern.filter(n => n !== a)[0];
					if (!oppTraps.includes(b)) {
						safeMoves.push(a);
					}
				});
			});
			return random(safeMoves);
		}

		const tempoMoves = findTraps(player.patterns.concat(opp.patterns));
		if (tempoMoves.length > 0) {
			return random(tempoMoves);
		}

		if (player.patterns.length > 0) {
			return random(random(player.patterns));
		}

		if (opp.patterns.length > 0 && 
			this.squares.length > 7) {
			const filtered = opp.patterns.reduce((acc, pattern) => {
				return acc.concat(pattern.filter(n => ![1, 3, 5, 7].includes(n)))
			}, []);
			return random(filtered);
		}

		return random(this.squares);
	}
}


export function findTraps(patterns) {
	const counter = {};
	patterns.forEach(pattern => {
		pattern.forEach(id => {
			counter[id] = (counter[id] || 0) + 1;
		});
	});
	return Object.keys(counter)
		.filter(id => counter[id] > 1)
		.map(id => parseInt(id));
}


export function removeFromArr(element, arr) {
	arr.splice(arr.indexOf(element), 1);
}


export function random(arr) {
	const i = Math.floor(Math.random() * Math.floor(arr.length));
	return arr[i];
}