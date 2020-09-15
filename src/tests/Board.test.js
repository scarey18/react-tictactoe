import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Board from '../components/Board';


let container = null;

beforeEach(() => {
	container = document.createElement('div');
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});


test("renders 9 squares with correct values", () => {

	act(() => {
		render(<Board gameState={null} />, container);
	});

	let squares = container.querySelectorAll('.cell');
	const message = ['T', 'I', 'C', 'T', 'A', 'C', 'T', 'O', 'E'];

	expect(squares.length).toBe(9);
	for (let i = 0; i < 9; i++) {
		expect(squares[i].textContent).toBe(message[i]);
	}

	const values = ['X', '', '', '', 'X', 'O', '', '', 'O']
	act(() => {
		render(<Board gameState='playing' squares={values} />, container);
	});

	expect(squares.length).toBe(9);
	for (let i = 0; i < 9; i++) {
		expect(squares[i].textContent).toBe(values[i]);
	}
});


test('highlights correct squares', () => {

	act(() => {
		render(<Board gameState={null} />, container);
	});

	let squares = container.querySelectorAll('.cell');

	for (let i = 0; i < 9; i++) {
		if (i % 3 === 0) {
			expect(squares[i].classList).toContain('highlighted');
		} else {
			expect(squares[i].classList).not.toContain('highlighted');
		}
	}

	const values = ['O', '', 'X', 'O', 'X', '', 'X', 'X', 'O'];
	act(() => {
		render(<Board gameState='cpu' squares={values} />, container);
	});

	for (let i = 0; i < 9; i++) {
		if ([2, 4, 6].includes(i)) {
			expect(squares[i].classList).toContain('highlighted');
		} else {
			expect(squares[i].classList).not.toContain('highlighted');
		}
	}
});