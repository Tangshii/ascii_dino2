<script lang="ts">
	import AsciiGame from './AsciiGame';
	import { onMount } from 'svelte';
	import jumpMp3 from '$lib/sounds/jump.mp3'; 

	const minFontPx = 2
	const maxFontPx = 20

	let gameStarted = false;

	let string = ""
	// $: string = asciiGame.getString();

	onMount(() => {
		let jumpAudio = new Audio(jumpMp3)

		function updateCallback() {
			string = asciiGame.getString();
		}

		// const num = parseInt(document.body.style.fontSize );
		document.body.style.fontSize = "8px"
		let newFontSize = Math.floor(window.screen.height / 100) + "px"
		document.body.style.fontSize = newFontSize

		let rowCharCount = Math.floor(getCharsPerLine()*.96);
		if(rowCharCount % 2 != 0) {
			rowCharCount--
		}
		
		let asciiGame = AsciiGame(rowCharCount, 16, updateCallback);

		let frameCount = 0;
		function loop() {
			frameCount++;
			asciiGame.onTick(frameCount);
			string = asciiGame.getString();
			if(frameCount >= Number.MAX_VALUE) { // reset just in case
				frameCount = 0;
			}
			window.requestAnimationFrame(loop);
		}

		document.addEventListener('keydown', (event) => {
			callJump()
		});

		document.addEventListener('touchstart', (event) => {
			callJump()
		});

		document.addEventListener('click', (event) => {
			callJump()
		});

		function callJump() {
			if(!gameStarted) {
				window.requestAnimationFrame(loop);
				gameStarted = true;
			}
			if(asciiGame.jump()) {
				jumpAudio.play()
			}
		}

		asciiGame.paintInitialDino()
		string = asciiGame.getString()
	});

	function getCharsPerLine() {
		const testElement = document.createElement('pre');
		testElement.style.position = 'absolute';
		testElement.style.visibility = 'hidden';
		testElement.style.whiteSpace = 'nowrap';
		testElement.innerText = 'MMMM';
		document.body.appendChild(testElement);
		const charWidth = testElement.offsetWidth;
		const screenWidth = window.innerWidth;
		document.body.removeChild(testElement);
		return Math.floor(screenWidth / charWidth)*4;
	}
	
</script>

<main>
	<pre class="unselectable">{string}</pre>
</main>

<style>
	:global(body) {
		background-color: #151515;
		color: #fff;
		font-size: 8px;
		padding: 0px;
		margin: 0px;
	}
	:global(html),
	:global(body) {
		touch-action: none;
	}
	.unselectable {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	pre {
		display: flex;
		justify-content: center;
		line-height: 1.2em;
		padding: 0px;
		margin: 1em;
		font-family: "Cousine";

	}
	
	@font-face {
		font-family: 'Cousine';
		font-style: normal;
		font-display: swap;
		font-weight: 400;
		src: url($lib/fonts/Cousine-Regular.ttf);
	}

	@font-face {
		font-family: 'SourceCode';
		font-style: normal;
		font-display: swap;
		font-weight: 400;
		src: url($lib/fonts/SourceCodePro-VariableFont_wght.ttf);
	}
</style>
