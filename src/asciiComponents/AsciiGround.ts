function AsciiGround() {

  const flat = [`-`,`-`,`-`] //---

  const rock = [`'`,`‾`,`'`] //'‾'

  const hole = [`.`,`_`,`.`] //._.

  const grass = [`-`,`"`,`-`] //-"-

  function randomNum(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} 
  let string = [];

  switch(randomNum(0,30)) {
    case 0:
      string = rock
      break;
    case 1:
      string = hole
      break;
    default: // 3 to 20
      string = flat
  }
  
	return {
    string
  };
}

export default AsciiGround;
