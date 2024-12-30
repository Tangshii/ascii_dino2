function AsciiGrid(rowAmount: number, colAmount: number) {
	let string = '';

	for (let i = 0; i <= colAmount; i++) {
		string += " ".repeat(rowAmount) + '\n';
	}

	function replaceCharAt(char: string, index: number, replaceOnlyIfBlank: boolean = false) {
		if (index < 0 || index > string.length) {
			return 'Index out of bounds';
		}
		let charToReplace = string.charAt(index);
		if(replaceOnlyIfBlank && charToReplace !== " ") {
			// only replace if is not white space?
		} else {
			string = string.slice(0, index) + char + string.slice(index + 1);

		}
		return charToReplace;
	}

	function replaceCharAt2d(char: string, x: number, y: number, replaceOnlyIfBlank: boolean = false) {
		let index = x + y * (rowAmount + 1);
		return replaceCharAt(char, index, replaceOnlyIfBlank);
	}

	function replaceStringAt2d(string: string, x: number, y: number) {
		for (let i = 0; i < string.length; i++) {
			let char = string.charAt(i);
			let index = x + y * (rowAmount + 1) + i;
			replaceCharAt(char, index);
		}
	}

	function replaceStringAt2dWithLineBrake(stringParam: string, x: number, y: number, replaceOnlyIfBlank: boolean = false) {
		let lines = stringParam.split("\n")
		lines.forEach((line: string, i) => {
			line.split('').forEach((char, j) => {
				let dervX = x + j
				if(dervX >= 0 && dervX < rowAmount ) {
					replaceCharAt2d(char,  dervX ,  y + i, replaceOnlyIfBlank);
				}
			});
		})
	}

	function getString() {
		return string;
	}

	return {
		replaceCharAt,
		replaceCharAt2d,
		replaceStringAt2d,
		replaceStringAt2dWithLineBrake,
		getString,
		rowAmount
	};
}

export default AsciiGrid;
