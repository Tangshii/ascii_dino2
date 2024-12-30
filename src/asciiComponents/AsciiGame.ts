import AsciiDino from './AsciiDino';
import AsciiGrid from './AsciiGrid';
import AsciiCactus from "./AsciiCactus";
import AsciiCactusGroup from "./AsciiCactusGroup";
import AsciiCloud from './AsciiCloud';
import AsciiSun from './AsciiSun';
import AsciiGround from './AsciiGround';

function AsciiGame(rowAmount: number, colAmount: number, updateCallback: Function) {
	let asciiGrid = AsciiGrid(rowAmount, colAmount);
	let dino = AsciiDino(3, colAmount-5);
	let sun = AsciiSun(rowAmount + (rowAmount / 24), 0) // so that sun appears when ground loads

	let cactusGroupList = [AsciiCactusGroup(-50 , colAmount-4)] // so that first cactus does not show 
	let cloudList = [ AsciiCloud(-50) ]

	let cactusNextInteval = rowAmount
	let cloudNextInteval = rowAmount/4

	let jumpCount = 0;
	let jumpCountMod = 1; 
	let score = 0;
	let isCollision = false;
	let ground: string[] = []
	let groundLine: string[] = []

	let gameOverString =
`G A M E  O V E R
     ┌─> ─┐
     │    │
     └────┘`
	 let gameOverEmptyString =
`                
           
           
           `


	function getString() {
		return asciiGrid.getString();
	}

	let frameCount = 0;
	function onTick(frameCountParam: number) {
		frameCount = frameCountParam;
		if(isCollision) {
			return
		}
		paintGroundLine()
		paintGround()
		paintSun()
		paintClouds()
		paintCatusList()
		paintDino()
		checkCollisions()
		paintScore()
		// updateCallback()
	}
	
	function paintSun() {
		paintWithLineBreak(sun.emptyString, sun.x, sun.y)
		if(sun.x > -11) { // 11 to clear frame
			if(frameCount % 24 == 0) {
				sun.x--
			}
		} else {
			sun.x = rowAmount
		}
		paintWithLineBreak(sun.string, sun.x, sun.y,)
	}

	function paintCatusList() {
		let cactiIndexToDelete: number[] = []
		cactusGroupList.forEach((cactusGroup, index) => {
			paintWithLineBreak(cactusGroup.emptyString , cactusGroup.x, cactusGroup.y)
			if(cactusGroup.x > -cactusGroup.rowCount) { 
				cactusGroup.x--
				paintWithLineBreak(cactusGroup.string, cactusGroup.x, cactusGroup.y,)
			} else { 
				score++
				cactiIndexToDelete.push(index);
			}
		});

		cactiIndexToDelete.forEach(index => {
			cactusGroupList.splice(index,1) // remove
		});

		if(cactusNextInteval <= 0) {
			cactusNextInteval = randomNum(60, 120)
			cactusGroupList.push(AsciiCactusGroup(rowAmount , colAmount-4)) 
		} else {
			cactusNextInteval--
		}
	}

	function paintScore() {
		let scoreString = score+""
		asciiGrid.replaceStringAt2d(scoreString, rowAmount-scoreString.length-1, 0)
	}

	function paintInitialDino() {
		paintWithLineBreak(dino.dinoString, dino.x, dino.y)
	}

	function paintDino() {
		let isJumping = dino.y + 5 < colAmount;
		if(isJumping) { 
			paintJumpingDino()
		} else {
			jumpCount = 0
			if(dino.leftLegBent) {
				paintWithLineBreak(dino.dinoStringLeft, dino.x, dino.y)
			} else {
				paintWithLineBreak(dino.dinoStringRight, dino.x, dino.y)
			}
			paintWithLineBreak("--", 3, colAmount-1 ) // paint lines behind dino
			if(frameCount % 12 == 0) {
				dino.leftLegBent = !dino.leftLegBent
			}
		}
	}

	function paintJumpingDino() {
		paintWithLineBreak(dino.dinoEmptyString, dino.x, dino.y)
		jumpCount++
		if(jumpCount % jumpCountMod == 0) {
			if(jumpCount < 5) {
				jumpCountMod = 1
				dino.y--
			} else if (jumpCount < 8) {
				jumpCountMod = 1
				dino.y--
			} else if (jumpCount < 16) {
				jumpCountMod = 4
				dino.y--
			} else if (jumpCount < 20) {
				jumpCountMod = 6
				dino.y--
			}else if (jumpCount < 24) {
				jumpCountMod = 6
				dino.y++
			} else if (jumpCount < 28) {
				jumpCountMod = 4
				dino.y++
			} else if (jumpCount < 32) {
				jumpCountMod = 3
				dino.y++
			}else {
				jumpCountMod = 2
				dino.y++
			}
		}
		paintWithLineBreak(dino.dinoString, dino.x, dino.y)
	}

	// function paintJumpingDino() {
	// 	paintWithLineBreak(dino.dinoEmptyString, dino.x, dino.y)
	// 	if(frameCount % 2 == 0) {
	// 		if(jumpCount > 0 && jumpCount < 11) {
	// 			// going up
	// 			jumpCount++
	// 			dino.y--
	// 		} else {
	// 			// going down
	// 			jumpCount = 0
	// 			dino.y++
	// 		}	
	// 	}
	// 	paintWithLineBreak(dino.dinoString, dino.x, dino.y)
	// }

	function dinoJump() {
		let isJumping = dino.y + 5 < colAmount;
		if(isCollision) {
			restartGame()
		}
		paintWithLineBreak(dino.dinoEmptyString, dino.x, dino.y)
		dino.y -= 1;
		jumpCount++;
		paintWithLineBreak(dino.dinoString, dino.x, dino.y)
		return !isJumping; // return true if we are on the ground
	}

	function restartGame() {
		for(let cactusGroup of cactusGroupList) {
			paintWithLineBreak(cactusGroup.emptyString, cactusGroup.x, cactusGroup.y)
		}
		cactusGroupList = []
		isCollision = false
		score = 0
		for (let i = 0; i < rowAmount; i++) {
			asciiGrid.replaceCharAt2d(' ', i, 0); // clear score row
		}
		paintScore()
		asciiGrid.replaceStringAt2dWithLineBrake(gameOverEmptyString, rowAmount/2-1-8, colAmount/2-1)
		return
	}

	function checkCollisions() {
		let dinoCoords = getCoordsList(dino.dinoString, dino.x, dino.y)
		cactusGroupList.forEach((cactusGroup) => {
			let cactusCoords = getCoordsList(cactusGroup.string, cactusGroup.x, cactusGroup.y)
			if(containsAny(cactusCoords, dinoCoords)) {
				isCollision = true;
				paintWithLineBreak(dino.dinoString, dino.x, dino.y) // paint dino so he's on top of cactus
				asciiGrid.replaceCharAt2d("⚬", dino.x + 4, dino.y + 1 ) // paint dead eyeball
				asciiGrid.replaceStringAt2dWithLineBrake(gameOverString, rowAmount/2-1-8, colAmount/2-1)
			}
		})
	}

	function paintGround() {
		ground.push(generateRandomGroundChar())
		if(ground.length > rowAmount) {
			ground.shift()
		}
		paintWithLineBreak(ground.join(""), 0, colAmount)
	}

	function paintGroundLine() {
		if(frameCount % 3 == 0) {
			groundLine = groundLine.concat(AsciiGround().string)
		}
		if(groundLine.length > rowAmount) {
			groundLine.shift()
		}
		paintWithLineBreak(groundLine.join(""), 0, colAmount-1) //8 is at dino's feet
	}
	
	function paintClouds() {
		let every4thFrame = frameCount % 4 == 0
		cloudList.forEach((cloud, index) => {
			paintWithLineBreak(cloud.emptyString , cloud.x, cloud.y)
			if(every4thFrame) {
				if(cloud.x > -11) { // 6 to clear frame
					cloud.x--
				} else { 
					cloudList.splice(index,1) // remove
				}
			}
			paintWithLineBreak(cloud.string, cloud.x, cloud.y)
		});

		if(every4thFrame) {
			if(cloudNextInteval <= 0) {
				let variance = randomNum(20, 100)
				cloudNextInteval = variance
				cloudList.push(AsciiCloud(rowAmount)) 
			} else {
				cloudNextInteval--
			}
		}
	}

	function generateRandomGroundChar() {
		const chars = "  .  _  -  '  ";
		return chars.charAt(Math.floor(Math.random() * chars.length));
	  }

	function containsAny(arr1: string[], arr2: string[]) {
		return arr1.some(item => arr2.includes(item));
	}

	function randomNum(min: number, max: number) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function paintWithLineBreak(string:string, x:number, y:number) {
		asciiGrid.replaceStringAt2dWithLineBrake(string, x, y)
	}

	function getCoordsList(string: string, x: number, y: number) {
		let coords: string[] = []
		let dervY = y;
		let dervX = x;
		for (let i = 0; i < string.length; i++) {
			dervX++;
			let char = string.charAt(i);
			if(char === "\n") {
				dervY++;
				dervX = x;
			}
			else if(char === " ") {
				// do not count as collsion if white space
			} else {
				coords.push( dervX + "-" + dervY)
			}
		}
		return coords;
	} 

	return {
		onTick,
		getString,
		jump: dinoJump,
		paintInitialDino
	};
}

export default AsciiGame;
