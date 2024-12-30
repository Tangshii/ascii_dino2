function AsciiCloud(x: number) {

	const string =
`   _____
  (     )
(____)____)`
      const emptyString = 
`        
         
           `;

    let isVisible = true

    let y = randomNum(0,4);

    function randomNum(min: number, max: number) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	return {
		x,
        y,
        string,
        emptyString,
        isVisible
	};
}

export default AsciiCloud;
