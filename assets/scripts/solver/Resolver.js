import Timer from './Timer.js';
import { createArray2D, in2D } from './functions.js';

/**
 * Permet de resoudre une grille de sudoku
 * @property {Array<Array<number>>} grid la grille en tableau JS
 * @property {Array<Object>} order la liste des cases trie selon les possibilites
 * @property {number} current un comteur courant 
 * @property {Timer} timer le timer qui permet de calculer la duree de resolution
 */
class Resolver {

	constructor() {
		this.grid = createArray2D(9, 9);
		this.order = [];
		this.current = 0;
		this.timer = new Timer();
	}
	/**
	 * initialise la grille
	 * @param {Array<Array<number>>} array 
	 */
	init(array) {
		this.grid = array;
	}
	/**
	 * Reinitialise la grille a 0
	 */
	reset() {
		this.grid = createArray2D(9, 9);
	}
	/**
	 * met a jour le tableau en mettant value a la case {i,j}
	 * et renvoie un object qui represente la reponse
	 * @param {Object} param0 
	 * @param {number} value 
	 * @returns {Object} response
	 */
	set(position, value) {
		const i = parseInt(position.i);
		const j = parseInt(position.j);
		this.grid[i][j] = value;
		let repeat = [], ok = true;

		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				if (this.grid[x][y] === 0)
					continue;
				repeat = repeat.concat([
					...this.getRepeatOnCol(x, y, this.grid[x][y]),
					...this.getRepeatOnRow(x, y, this.grid[x][y]),
					...this.getRepeatOnZone(x, y, this.grid[x][y])
				]);
			}
		}

		repeat = new Set(repeat);
		ok = (repeat.size === 0);
		return { ok, error: ok ? null : repeat };
	}
	/**
	 * predicat : teste si la value est presente sur la ligne row
	 * @param {number} row 
	 * @param {number} col 
	 * @param {number} value 
	 * @returns {boolean}
	 */
	onlyOnRow(row, col, value) {
		let icol;
		for (icol = 0; icol < 9; icol++) {
			if (col === icol) continue;
			if (this.grid[row][icol] === value)
				return false;
		}
		return true;
	}
	/**
	 * predicat : teste si la value est presente sur la colonne col
	 * @param {number} row 
	 * @param {number} col 
	 * @param {number} value 
	 * @returns {boolean}
	 */
	onlyOnCol(row, col, value) {
		let irow;
		for (irow = 0; irow < 9; irow++) {
			if (row === irow) continue;
			if (this.grid[irow][col] === value) {
				return false;
			}
		}
		return true;
	}
	/**
	 * predicat : teste si la value est presente dans la zone
	 * @param {number} row 
	 * @param {number} col 
	 * @param {number} value 
	 * @returns {boolean}
	 */
	onlyOnZone(row, col, value) {
		let begin_row = row - row % 3,
			begin_col = col - col % 3;
		let irow, jcol;
		for (irow = begin_row; irow < begin_row + 3; irow++) {
			for (jcol = begin_col; jcol < begin_col + 3; jcol++) {
				if (irow == row && jcol == col) continue; // sauf a sa position
				if (value == this.grid[irow][jcol]) return false;
			}
		}
		return true;
	}
	/**
	 * recupere la valeur possible a la case i,j, 0 s'il n'y a pas de possiblite
	 * @param {number} i 
	 * @param {number} j 
	 * @returns {number} la valeur possible
	 */
	getAcceptableValue(i, j) {
		let possibility;
		for (possibility = this.grid[i][j] + 1; possibility <= 9; possibility++) {
			if (this.onlyOnCol(i, j, possibility) && this.onlyOnRow(i, j, possibility) && this.onlyOnZone(i, j, possibility)) {
				return possibility;
			}
		}
		return 0;
	}
	/**
	 * Recupere un tableau qui liste les valeurs possibles sur une case {i,j}
	 * @param {number} i 
	 * @param {number} j 
	 * @returns {Array<number>}
	 */
	getPossibilityOn(i, j) {
		let possibilities = [];
		for (let guess = 1; guess <= 9; guess++) {
			if (this.onlyOnCol(i, j, guess) && this.onlyOnRow(i, j, guess) && this.onlyOnZone(i, j, guess))
				possibilities.push(guess);
		}
		return possibilities;
	}
	/**
	 * Remplit this.order des cases vides et le trie. 
	 * Si une case a une possibilite, on applique sa valeur,
	 * Sinon elle retourne false
	 * @returns {boolean} l'etat si on a trouve une case avec un cas possible
	 */
	getOrderResolution() {
		let possibilities = [], numberOfPossibility = 0;
		let update = false, i, j;
		this.order = [];

		for (i = 0; i < 9; i++) {
			for (j = 0; j < 9; j++) {
				if (this.grid[i][j] !== 0)
					continue;

				possibilities = this.getPossibilityOn(i, j);
				numberOfPossibility = possibilities.length;

				if (numberOfPossibility === 1) {
					this.grid[i][j] = possibilities[0];
					update = true;
				} else {
					this.order.push({
						size: numberOfPossibility,
						position: [i, j]
					});
				}
			}
		}

		this.order.sort((p1, p2) => p1.size - p2.size);
		return update;
	}
	/**
	 * recupere la liste des positions ayant 
	 * des valeurs egal a value sur la ligne
	 * @param {number} row 
	 * @param {number} col 
	 * @param {number} value 
	 * @returns {Array<number>}
	 */
	getRepeatOnRow(row, col, value) {
		let icol;
		let repeat = [];
		for (icol = 0; icol < 9; icol++) {
			if (col === icol) continue;
			if (this.grid[row][icol] === value) {
				console.log(row, icol);
				repeat.push(row * 9 + icol);
			}
		}
		return repeat;
	}
	/**
	 * recupere la liste des positions ayant 
	 * des valeurs egal a value sur la colonne
	 * @param {number} row 
	 * @param {number} col 
	 * @param {number} value 
	 * @returns {Array<number>}
	 */
	getRepeatOnCol(row, col, value) {
		let irow;
		let repeat = [];
		for (irow = 0; irow < 9; irow++) {
			if (row === irow) continue;
			if (this.grid[irow][col] === value) {
				console.log(irow, col);
				repeat.push(irow * 9 + col);
			}
		}
		return repeat;
	}
	/**
	 * recupere la liste des positions ayant 
	 * des valeurs egal a value sur la zone
	 * @param {number} row 
	 * @param {number} col 
	 * @param {number} value 
	 * @returns {Array<number>}
	 */
	getRepeatOnZone(row, col, value) {
		let begin_row = row - row % 3,
			begin_col = col - col % 3;
		let irow, jcol;
		let repeat = [];
		for (irow = begin_row; irow < begin_row + 3; irow++) {
			for (jcol = begin_col; jcol < begin_col + 3; jcol++) {
				if (irow == row && jcol == col) continue; // sauf a sa position
				if (value == this.grid[irow][jcol]) {
					console.log(irow, jcol);
					repeat.push(irow * 9 + jcol);
				}
			}
		}
		return repeat;
	}
	/**
	 * resoud la grille
	 * @returns {Promise}
	 */
	resolve() {
		return new Promise((resolve, reject) => {

			this.timer.reset();
			this.timer.start();

			while (this.getOrderResolution())
				this.order = [];

			let i = 0, j = 0, temp = 0;
			let len = this.order.length;

			this.current = 0;

			while (this.current < len) {
				if (this.current < 0)
					reject('impossible grid');

				[i, j] = this.order[this.current].position;
				temp = this.getAcceptableValue(i, j);
				this.grid[i][j] = temp;
				this.current += (temp === 0) ? -1 : 1;
			}

			this.timer.stop();
			resolve(this.grid);
		});
	}
}

export default Resolver;