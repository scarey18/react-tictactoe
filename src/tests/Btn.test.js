import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Btn from '../components/Btn';


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


test("renders with correct value", () => {

	act(() => {
		render(<Btn value="Start Game" />, container);
	});
	let btn = container.querySelector('button');
	expect(btn.textContent).toBe("Start Game");

	act(() => {
		render(<Btn value="Go First (X)" />, container);
	});
	expect(btn.textContent).toBe("Go First (X)");
});


test("is disabled during the game", () => {

	act(() => {
		render(<Btn />, container);
	});
	let btn = container.querySelector('button');
	expect(btn.attributes["disabled"]).toBe(undefined);

	act(() => {
		render(<Btn gameState="playing" />, container);
	});
	expect(btn.attributes["disabled"]["specified"]).toBe(true);
});


test("properly creates the classList", () => {

	act(() => {
		render(<Btn />, container);
	});
	let btn = container.querySelector('button');
	expect(btn.classList.value).toBe('button');

	act(() => {
		render(<Btn classList=" level is-mobile" />, container);
	});
	expect(btn.classList.value).toBe('button level is-mobile');

	act(() => {
		render(<Btn classList=" level is-mobile" isSelected={true} />, container);
	});
	expect(btn.classList.value).toBe('button level is-mobile is-selected');
});