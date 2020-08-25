import { Game, PATTERNS, findTraps } from '../game';


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


describe('Game', () => {

	test('constructor creates new patterns with the same values', () => {
		const game = new Game();
		expect(game.patterns).not.toBe(PATTERNS);
		for (let i = 0; i < game.patterns.length; i++) {
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

		test("if multiple opponent traps, plays a safe forcing move", () => {
			const game = new Game();
			game.player1.patterns = [[1, 4], [5, 7]];
			game.player2.patterns = [[0, 5], [5, 8], [2, 4], [2, 6]];
			expect([1, 4, 5]).toContain(game.evaluateBoard(game.player1));
		});
	});

});