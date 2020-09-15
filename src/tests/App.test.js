import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { random } from '../game';
import App from '../components/App';


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


test("renders with welcome message and correct values", () => {
	act(() => {
		render(<App />, container);
	});
	let message = container.querySelector('#message');
	let cells = container.querySelectorAll('.cell');

	expect(message.textContent).toBe('Welcome!');
	for (let i = 0; i < cells.length; i++) {
		const tictactoe = ['T', 'I', 'C', 'T', 'A', 'C', 'T', 'O', 'E']
		expect(cells[i].textContent).toBe(tictactoe[i]);
	}
});


test("starts game and handles click", () => {
	act(() => {
		render(<App />, container);
	});
	let message = container.querySelector('#message');
	let startBtn = container.querySelector('#start-button');
	let cells = Array.from(container.querySelectorAll('.cell'));

	act(() => {
		startBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
	});

	expect(message.textContent).toBe('You are X');
	for (const cell of cells) {
		expect(cell.textContent).toBe('');
	}

	const randomCell = random(cells);
	act(() => {
		randomCell.dispatchEvent(new MouseEvent('click', {bubbles: true}));
	});

	expect(randomCell.textContent).toBe('X');

	const cpuMoves = cells.filter(c => c.textContent === 'O');
	expect(cpuMoves.length).toBe(1);
});


test("switches symbol and starts game", () => {
	act(() => {
		render(<App />, container);
	});
	let message = container.querySelector('#message');
	let goSecondBtn = container.querySelector('#go-second');
	let startBtn = container.querySelector('#start-button');
	let cells = Array.from(container.querySelectorAll('.cell'));

	act(() => {
		goSecondBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
	});

	act(() => {
		startBtn.dispatchEvent(new MouseEvent('click', {bubbles: true}));
	});

	expect(message.textContent).toBe('You are O');

	const cpuMoves = cells.filter(c => c.textContent === 'X');
	expect(cpuMoves.length).toBe(1);
});