import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Scoreboard from '../components/Scoreboard';


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


test("renders all props correctly", () => {

	act(() => {
		render((
			<Scoreboard
				message="Welcome!"
				playerScore={0}
				cpuScore={1}
			/>
		), container)
	});

	let message = container.querySelector('#message');
	let playerScore = container.querySelector('#player-score');
	let cpuScore = container.querySelector('#cpu-score');

	expect(message.textContent).toBe('Welcome!');
	expect(playerScore.textContent).toBe('0');
	expect(cpuScore.textContent).toBe('1');

	act(() => {
		render((
			<Scoreboard
				message="You are X"
				playerScore={1}
				cpuScore={3}
			/>
		), container)
	});

	expect(message.textContent).toBe('You are X');
	expect(playerScore.textContent).toBe('1');
	expect(cpuScore.textContent).toBe('3');
});