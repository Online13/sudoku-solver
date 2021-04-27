export function createArray2D(row, col, value = 0) {
	let array = new Array(row);
	array.fill(0);
	return array.map(_ => {
		let r = new Array(col);
		r.fill(value);
		return r;
	})
};

export function in2D(value) {
	let i = 0,j = 0;
	i = parseInt(value / 9);
	j = value % 9;
	return {i,j};
}