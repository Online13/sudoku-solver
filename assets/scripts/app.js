import Resolver from "./solver/Resolver.js";

/**
 * generate a grid (our sudoku grid)
 * @returns {HTMLElement}
 */
function generate_grid() {
	const table = document.createElement('table');
	table.classList.add('grid');

	for (let i = 0; i < 9; i++) {
		let tr = document.createElement('tr');
		for (let j = 0; j < 9; j++) {
			let td = document.createElement('td');
			td.dataset.i = i;
			td.dataset.j = j;
			td.dataset.value = 0;
			td.innerHTML = 0;

			if ((j + 1) % 3 === 0 && j !== 8)
				td.classList.add('bold-border-right');
			if ((i + 1) % 3 === 0 && i !== 8)
				td.classList.add('bold-border-bottom');

			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	return table;
}
/**
 * generate a keyboard for fill the grid
 * @returns {HTMLElement}
 */
function generate_keyboard() {
	const div = document.createElement('div');
	div.classList.add('choice');

	let i = 0, j = 0, value = 0, button = null;

	for (i = 0; i < 3; i++) {
		for (j = 0; j < 3; j++) {
			value = (i * 3 + j) + 1;

			button = document.createElement('button');
			button.dataset.value = button.innerHTML = value;

			div.appendChild(button);
		}
	}

	return div;
}
/**
 * remove focus on all case in grid
 * @param {Array<HTMLElement>} list 
 * @param {HTMLElement} except 
 */
function focusOut(list, except = null) {
	list.forEach(td => {
		if (td === except) return;
		if (td.classList.contains('click'))
			td.classList.remove('click');
	})
}
/**
 * set focus on case
 * @param {HTMLElement} element 
 */
function focusIn(element) {
	element.classList.toggle('click');
}

// global variable for save which case is on focus
let focus = null;

/**
 * connect grid to keyboard and enable to write on the grid
 * @param {Array<HTMLElement>} cases 
 * @param {HTMLElement} keyboard 
 * @param {Function} set_value 
 */
function connect(cases, keyboard, set_value) {
	cases.forEach(td => {
		td.addEventListener('click', e => {
			focusOut(cases, e.target);
			focusIn(e.target);
			if (e.target.classList.contains('click'))
				focus = e.target;
			else
				focus = null;
		});
		// effect only on desktop
		// td.addEventListener('mouseover', e => {
		// 	focusOut(cases, e.target);
		// 	focusIn(e.target);
		// 	focus = e.target;
		// });

		// td.addEventListener('mouseout', e => {
		// 	focusOut(cases, e.target);
		// 	focusIn(e.target);
		// 	focus = null;
		// })
	});

	keyboard.querySelectorAll('button').forEach(button => {
		button.onclick = e => {
			if (focus !== null) {
				set_value(e.target.dataset.value);
			}
		};
	});

	window.addEventListener('keydown', e => {
		if (focus !== null) {
			if (/[0-9]/.test(e.key[0]))
				set_value(e.key);
		}
	})
}

function fill_grid(cases, array) {
	let i, j, k;

	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			k = i * 9 + j;
			cases[k].innerHTML = array[i][j];
			cases[k].dataset.value = array[i][j];
		}
	}
}

function appendAlert() {
	document.querySelector('.info').style.display = "flex";
}

function removeAlert() {
	document.querySelector('.info').style.display = "none";
}

// **********************************************************************
// Main **********************************************************************
// **********************************************************************

/**
 * init resolver,alert,...
 1* generate grid
 2* generate keyboard 
 3* connect keyboard and grid
 4* connect options to grid
 */

const parent = document.querySelector('.main');
const grid = generate_grid();
const cases = grid.querySelectorAll('td');
const keyboard = generate_keyboard();

const solve_btn = document.querySelector('button.solve');
const clear_btn = document.querySelector('button.clear');
const save_btn = document.querySelector('button.save');

const resolver = new Resolver();
// resolver.init([
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 3, 0, 8, 5],
//     [0, 0, 1, 0, 2, 0, 0, 0, 0],
//     [0, 0, 0, 5, 0, 7, 0, 0, 0],
//     [0, 0, 4, 0, 0, 0, 1, 0, 0],
//     [0, 9, 0, 0, 0, 0, 0, 0, 0],
//     [5, 0, 0, 0, 0, 0, 0, 7, 3],
//     [0, 0, 2, 0, 1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 4, 0, 0, 0, 9]
// ]);

// fill_grid(cases,resolver.grid);

// for alert component
removeAlert();
document.querySelector('.info .times').addEventListener('click', removeAlert);

// generate grid
parent.appendChild(grid);

// generate keyboard
parent.appendChild(keyboard);

// connect keyboard and grid
connect(cases, keyboard, (value) => {
	// change value in front
	focus.innerHTML = (value === focus.innerHTML) ? 0 : value;
	focus.dataset.value = focus.innerHTML;

	// change value in grid
	resolver.set({ i: focus.dataset.i, j: focus.dataset.j }, parseInt(focus.innerHTML));

	if (focus.innerHTML !== "0") {
		focus.classList.add('use');
	} else if (focus.innerHTML === "0" && focus.classList.contains('use')) {
		focus.classList.remove('use');
	}
});

// connect options to grid
solve_btn.onclick = e => {
	resolver.resolve().then(res => {
		fill_grid(cases, res);
		appendAlert();
		document.querySelector('p.duration span.content').innerHTML = `${resolver.timer.duration} ms`;
	})
};

// save_btn.onclick = e => {

// };

clear_btn.onclick = e => {
	resolver.reset();
	fill_grid(cases,resolver.grid);
	cases.forEach(Case => {
		if (Case.classList.contains('use'))
			Case.classList.remove('use');
		if (Case.classList.contains('click'))
			Case.classList.remove('click');
	});
};