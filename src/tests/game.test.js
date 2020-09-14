import { Game, PATTERNS, findTraps, removeFromArr } from '../game';


describe('findTraps', () => {
	const patterns = [
		[0, 1],
		[2, 4],
		[1, 7],
		[8, 2],
	]
	test('returns all repeated ids', () => {
		const traps = findTraps(patterns);
		expect(traps).toEqual([1, 2]);
	});
});


describe('removeFromArr', () => {
	test('removes element from the array', () => {
		const arr = [0, 1, 2, 3, 4, 5];
		removeFromArr(4, arr);
		expect(arr).toEqual([0, 1, 2, 3, 5]);
	});
});


describe('Game', () => {

	test('constructor creates new patterns array with the same values', () => {
		const game = new Game();
		expect(game.patterns).not.toBe(PATTERNS);
		for (let i = 0; i < game.patterns.length; i++) {
			expect(game.patterns[i]).not.toBe(PATTERNS[i]);
			expect(game.patterns[i]).toEqual(PATTERNS[i]);
		}
	});

	describe('makeMove', () => {
		const game = new Game();
		game.patterns = [[0, 1, 2], [3, 4, 5]];
		game.player1.patterns = [[0, 3, 6], [6, 7, 8]];
		game.player2.patterns = [[0, 4, 8], [1, 4, 7]];
		game.makeMove(game.player1, 0);

		test('removes id from game squares', () => {
			expect(game.squares).not.toContain(0);
		});

		test('accurately modifies unowned patterns', () => {
			expect(game.patterns).toEqual([[3, 4, 5]]);
		});

		test('accurately modifies player patterns', () => {
			expect(game.player1.patterns).toEqual([[3, 6], [6, 7, 8], [1, 2]]);
		});

		test('accurately modifies opponent patterns', () => {
			expect(game.player2.patterns).toEqual([[1, 4, 7]]);
		});

		test('returns player alias on a win', () => {
			const testGame = new Game();
			testGame.player1.patterns = [[0]];
			expect(testGame.makeMove(testGame.player1, 0)).toBe('player');
		});

		test('returns "draw" on a draw', () => {
			const testGame = new Game();
			testGame.squares = [0];
			testGame.player1.patterns = [[1, 4, 7]];
			expect(testGame.makeMove(testGame.player1, 0)).toBe('draw');
		});
	});

	describe('evaluateBoard', () => {	
		test('finds winning move', () => {
			const game = new Game();
			game.player1.patterns = [[0]];
			game.player2.patterns = [[1]];
			expect(game.evaluateBoard(game.player1)).toBe(0);
		});

		test('blocks opponent winning move', () => {
			const game = new Game();
			game.player1.patterns = [[0, 1]];
			game.player2.patterns = [[2]];
			expect(game.evaluateBoard(game.player1)).toBe(2);
		});

		test('plays a trap if possible', () => {
			const game = new Game();
			game.player1.patterns = [[0, 1], [0, 3]];
			game.player2.patterns = [[2, 4], [2, 6]];
			expect(game.evaluateBoard(game.player1)).toBe(0);
		});

		test('blocks opponent trap if there is only one', () => {
			const game = new Game();
			game.player1.patterns = [[0, 1], [5, 7]];
			game.player2.patterns = [[2, 4], [2, 6]];
			expect(game.evaluateBoard(game.player1)).toBe(2);
		});

		test("if multiple opponent traps, chooses a safe forcing move", () => {
			const game = new Game();
			game.player1.patterns = [[1, 4], [5, 7]];
			game.player2.patterns = [[0, 5], [5, 8], [2, 4], [2, 6]];
			expect([1, 4, 5]).toContain(game.evaluateBoard(game.player1));
		});

		test("else, chooses a tempo move if able", () => {
			const game = new Game();
			game.player1.patterns = [[0, 2], [4, 7]];
			game.player2.patterns = [[3, 4], [2, 8]];
			expect([2, 4]).toContain(game.evaluateBoard(game.player1));
		});

		test("else, chooses random move from player pattern", () => {
			const game = new Game();
			game.player1.patterns = [[0, 2]];
			game.player2.patterns = [[4, 6]];
			expect([0, 2]).toContain(game.evaluateBoard(game.player1));
		});

		test("else, chooses random move from opponent pattern", () => {
			const game = new Game();
			game.player1.patterns = [];
			game.player2.patterns = [[4, 6]];
			expect([4, 6]).toContain(game.evaluateBoard(game.player2));
		});

		test("else, chooses random valid move", () => {
			const game = new Game();
			game.squares = [2, 4];
			expect([2, 4]).toContain(game.evaluateBoard(game.player1));
		});
	});

});