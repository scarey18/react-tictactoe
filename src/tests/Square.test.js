import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Square from '../components/Square';


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


// Values and highlighting are tested in Board tests


test("has no bottom border if id is less than 6", () => {

	act(() => {
		render(<Square id={5} />, container);
	});
	let square = container.querySelector('div');
	expect(square.classList).toContain('no-bottom-border');

	act(() => {
		render(<Square id={6} />, container);
	});
	expect(square.classList).not.toContain('no-bottom-border');
});


test("has no right border if id isn't 2, 5, or 8", () => {

	act(() => {
		render(<Square id={1} />, container);
	});
	let square = container.querySelector('div');
	expect(square.classList).toContain('no-right-border');

	act(() => {
		render(<Square id={5} />, container);
	});
	expect(square.classList).not.toContain('no-right-border');
});