const PATTERNS = [
									 [0, 1, 2],
									 [3, 4, 5],
									 [6, 7, 8],
									 [0, 3, 6],
									 [1, 4, 7],
									 [2, 5, 8],
									 [0, 4, 8],
									 [2, 4, 6],
								 ]


class Game {
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
		this.squares.splice(this.squares.indexOf(id), 1);

		const playerPatterns = player.patterns.filter(p => p.includes(id));
		for (const pattern of playerPatterns) {
			pattern.splice(pattern.indexOf(id), 1);
			if (pattern.length === 0) {
				return player.alias;
			}
		}

		if (this.squares.length === 0) {
			return 'draw';
		}
		
		const unownedPatterns = this.patterns.filter(p => p.includes(id));
		unownedPatterns.forEach(pattern => {
			pattern.splice(pattern.indexOf(id), 1);
			this.patterns.splice(this.patterns.indexOf(pattern), 1);
			player.patterns.push(pattern);
		});

		const opp = player === this.player1 ? this.player2 : this.player1;
		const oppPatterns = opp.patterns.filter(p => p.includes(id));
		oppPatterns.forEach(pattern => {
			opp.patterns.splice(opp.patterns.indexOf(pattern), 1);
		});
	}

	evaluateBoard(player) {
		if (this.squares.length === 8) {
			return this.squares.includes(4) ? 4 : random([0, 2, 6, 8]);
		}

		const opp = player === this.player1 ? this.player2 : this.player1;
		for (const patterns of [player.patterns, opp.patterns]) {
			const winningMoves = patterns.filter(p => p.length === 1);
			if (winningMoves.length > 0) return random(winningMoves)[0];
		}

		const playerTraps = findTraps(player.patterns);
		if (playerTraps.length > 0) {
			return random(playerTraps);
		}

		const oppTraps = findTraps(opp.patterns);
		if (oppTraps.length === 1) {
			return random(oppTraps);
		}
		else if (oppTraps.length > 1) {
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

		return this.scoreAllMoves(player);
	}

	scoreAllMoves(player) {
		let bestMoves = [];
		let maxScore = -2;
		this.squares.forEach(id => {
			const score = this.simulateMove(player, id);
			if (score > maxScore) {
				bestMoves = [id];
				maxScore = score;
			}
			else if (score === maxScore) {
				bestMoves.push(id);
			}
		});
		return random(bestMoves);
	}

	simulateMove(player, id) {
		const opp = player === this.player1 ? this.player2 : this.player1;
		const gameClone = this.createClone(player, opp);
		const playerClone = gameClone.player1;
		const oppClone = gameClone.player2;

		let currentPlayer = playerClone;
		let currentOpp = oppClone;
		let gameState = gameClone.makeMove(playerClone, id);
		while (!gameState) {
			currentPlayer = currentPlayer === playerClone ? oppClone : playerClone;
			currentOpp = currentOpp === playerClone ? oppClone : playerClone;
			const move = gameClone.evaluateBoard(currentPlayer);
			gameState = gameClone.makeMove(currentPlayer, move);
		}

		if (gameState === 'draw') {
			return 0;
		}
		else if (gameState === playerClone.alias) {
			return 1;
		}
		else {
			return -1;
		}
	}

	createClone(player, opp) {
		const clone = new Game();
		clone.squares = this.squares.slice();
		clone.firstMove = this.firstMove;
		clone.patterns = this.patterns.map(p => p.slice());
		clone.player1 = {
			alias: player.alias,
			patterns: player.patterns.map(p => p.slice()),
		}
		clone.player2 = {
			alias: opp.alias,
			patterns: opp.patterns.map(p => p.slice()),
		}
		return clone;
	}
}


function findTraps(patterns) {
	const ids = [];
	const repeatedIds = [];
	patterns.forEach(pattern => {
		pattern.forEach(id => {
			if (!ids.includes(id)) {
				ids.push(id);
			}
			else if (!repeatedIds.includes(id)) {
				repeatedIds.push(id);
			}
		});
	});
	return repeatedIds;
}


function random(arr) {
	const i = Math.floor(Math.random() * Math.floor(arr.length));
	return arr[i];
}


export {Game, PATTERNS, random};