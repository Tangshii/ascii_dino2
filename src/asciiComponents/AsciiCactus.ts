function AsciiCatus(x: number = 0, y: number = 0) {

    const OVER_SCORE = '\u203E'

    const leftString = 
`(\\|` + OVER_SCORE + `|
 \\| |/)
  | |/
--| |--`;
    const leftShortString = 
`
(\\|` + OVER_SCORE + `|
 \\| |/)
--| |/--`;

const rightString = 
`  |` + OVER_SCORE + `|/)
(\\| |/
 \\| |
--| |--`;

const rightShortString = 
`
  |` + OVER_SCORE + `|/) 
(\\| |/ 
-\\| |--`

      const emptyString = 
`              
       
       
      `;

    let string: string
    switch(randomNum(0,1)) {
    case 0:
        string = leftString
        break;
    case 1:
        string = rightString
        break;
    case 2:
        string = leftShortString
        break;
    case 3:
        string = rightShortString
        break;
    default:
        string = rightString
    }

    function randomNum(min: number, max: number) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	} 

	return {
        height: 4,
        width: 7,
		x,
        y,
        string,
        emptyString
	};
}

export default AsciiCatus;
