import AsciiCatus from "./AsciiCactus";
import AsciiGrid from "./AsciiGrid";

function AsciiCactusGroup(x: number, y: number) {
    let cactus = AsciiCatus()
    let cactusAmount = randomNum(1, 3);
    let cactusGrid = AsciiGrid( (cactusAmount * cactus.width)-cactusAmount+1, cactus.height-1)
    // row amount is to account for 2nd and 3rd cactus being overlapped by one

    for(let i = 0; i < cactusAmount; i++) {
        cactusGrid.replaceStringAt2dWithLineBrake(AsciiCatus().string, i * (cactus.width-1), 0, true)
    }

    function randomNum(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} 

    function getEmptyString() {
        return cactusGrid.getString().replaceAll(/[^\s-]/g, " ") // regex not space and hyphen
    }
    
	return {
		x,
        y,
        string: cactusGrid.getString(),
        emptyString: getEmptyString(),
        rowCount: cactusGrid.rowAmount
	};
}

export default AsciiCactusGroup;
