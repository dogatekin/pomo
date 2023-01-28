<script>
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	let paused = true;
	let isWorking = true;
	let play_pause, skip;
	let minutes, seconds;

	let intervals = {
		true: 25 * 60,
		false: 5 * 60
	};

	let time = intervals[isWorking];
	minutes = pad(Math.floor(time / 60), 2);
	seconds = pad(time % 60, 2);

	function pad(string, length) {
		return (new Array(length + 1).join('0') + string).slice(-length);
	}

	onMount(() => {
		const worker = new Worker(`${base}/worker.js`);
		const checkbox = document.querySelector('.checkbox');

		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new AudioContext();

		// get the audio element
		const audioElement = document.querySelector('audio');

		// pass it into the audio context
		const track = audioContext.createMediaElementSource(audioElement);
		track.connect(audioContext.destination);

		function updateDisplay() {
			minutes = pad(Math.floor(time / 60), 2);
			seconds = pad(time % 60, 2);
			document.title = `${isWorking ? 'Work' : 'Break'} | ${minutes}:${seconds}`;
		}

		function updateStatus() {
			if (!checkbox.checked) {
				paused = true;
				worker.postMessage('pause');
			}

			isWorking = !isWorking;
			time = intervals[isWorking];
		}

		updateDisplay();

		play_pause = () => {
			if (paused) {
				if (audioContext.state === 'suspended') {
					audioContext.resume();
				}
				worker.postMessage('play');
			} else {
				worker.postMessage('pause');
			}
			paused = !paused;
		};

		skip = () => {
			updateStatus();
			updateDisplay();
		};

		worker.onmessage = () => {
			time -= 1;

			if (time == 0) {
				audioElement.play();
				updateStatus();
			}

			updateDisplay();
		};
	});
</script>

<audio src="{base}/bell.wav" />

<div class="hero">
	<h1 class="time">{minutes}:{seconds}</h1>

	<div class="controls">
		<button on:click={play_pause}>
			<span class="material-icons" class:hidden={!paused}>play_arrow</span>
			<span class="material-icons" class:hidden={paused}>pause</span>
		</button>
		<button on:click={skip}>
			<span class="material-icons">skip_next</span>
		</button>
	</div>

	<div class="auto-toggle">
		<span>Auto</span>
		<label class="switch">
			<input class="checkbox" type="checkbox" checked />
			<span class="slider round" />
		</label>
	</div>
</div>

<style>
	.hero {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	h1 {
		font-size: 4rem;
	}

	.controls {
		font-size: 3rem;
		display: flex;
		gap: 1rem;
	}

	.auto-toggle {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.hidden {
		display: none;
	}

	/* The switch - the box around the slider */
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgb(100, 100, 100);
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: #498c8a;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #374a67;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
