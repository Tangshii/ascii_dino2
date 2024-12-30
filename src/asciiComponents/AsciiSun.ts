function AsciiSun(x: number, y: number) {

	const string =
`   , , ,
 ‘ .---. ’
‘ /     \\ ’
‘ \\     / ’
 ’ \`---\´ ’
   ‘ ’ ‘`
      const emptyString = 
`        
          
           
           
          
        `;

	return {
		x,
        y,
        string,
        emptyString,
	};
}

export default AsciiSun;
