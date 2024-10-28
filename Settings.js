'use strict';

import { PaperCanvas } from "./PaperCanvas.js";
import { ColorPicker } from "./ColorPicker.js";
import { shuffleArray, getAvailableColors } from "./styler.js";

export class Settings extends HTMLElement {
	constructor(n) {
		
		super();
	
		this.shadow = this.attachShadow({ mode: 'open' });

		const container = document.createElement('template');
		this.colors = getAvailableColors()
		this.selectedColors = [this.colors[0], this.colors[1], this.colors[2]]

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<style>
				#content {
					display: flex;
					flex-direction: row-reverse;
					width: 100%;
					height: 100%;
				}
				paper-canvas {
					width: 70%;
					height: 100%;
				}
				#settings {
					width: 30%;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}	
				.settings-section {
					margin: 0 1vh;
				}
				select {
					width: 3vh;
					height: 3vh;
					--webkit-appearance: none;
					-moz-appearance: none;
					appearance: none;	
					background-color: blue;
					border: 2px solid black;
					border-radius: 5px;
				}
				option {
					--webkit-appearance: none;
					-moz-appearance: none;
					appearance: none;
					background-color: red;
					width: 3vh;
					height: 3vh;
					border: 2px solid black;
					border-radius: 5px;
					margin: 5px;
				}
				button{
					background-color: transparent;
					border: 2px solid white;
					border-radius: 5px;
				}
				#download-buttons {
					display: flex;
					flex-direction: row;
					justify-content: space-around;
				}
				.angle-slider {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
				}
				input[type="text"] {
					background-color: transparent;
					border: 2px solid white;
					border-radius: 5px;
					color: white;
					width: 100%;
					font-size: 2em;
				}
				.generator-type {
					width: min(7vh, 7vw);
					height: min(7vh, 7vw);
				}
				input[type="radio"] {
					display: none;
				}
				.type-selection label {
					cursor: pointer;
					opacity: 0.5;
				}
				input:not(:checked) + label:hover {
					opacity: 0.8;
				}
				input:checked + label {
					opacity: 1;
				}
				#settings-type {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-around;
				}
				#settings-pattern {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-around;
				}
			</style>
			<div id="content">
				<paper-canvas id="paperCanvas"></paper-canvas>
				<div id="settings">

					<div id="settings-type" class="settings-section">
						<div class="type-selection">
							<input id="logo-select" type="radio" name="type" value="logo" checked>
							<label for="logo-select">
								<svg class="generator-type" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm-.27-60q142.38 0 241.19-99.5T820-480v-13q-6 26-27.41 43.5Q771.19-432 742-432h-80q-33 0-56.5-23.5T582-512v-40H422v-80q0-33 23.5-56.5T502-712h40v-22q0-16 13.5-40t30.5-29q-25-8-51.36-12.5Q508.29-820 480-820q-141 0-240.5 98.81T140-480h150q66 0 113 47t47 113v40H330v105q34 17 71.7 26t78.3 9Z"/></svg>
							</label>
							<input id="pattern-select" type="radio" name="type" value="pattern">
							<label for="pattern-select">
								<svg class="generator-type" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Zm183 470 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133Z"/></svg>
							</label>
						</div>
					</div>


					<div id="settings-logo" class="settings-section">
						<div class="color-pickers">
							<color-picker id="colorPicker1" checkedColor="0"></color-picker>
							<color-picker id="colorPicker2" checkedColor="1"></color-picker>
							<color-picker id="colorPicker3" checkedColor="2"></color-picker>
						</div>
						<div class="angle-slider">
							<label for="angleSlider">
								<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M444-53q-55-6-106.5-29.5T244-148l51-51q32 31 70 49t79 24v73Zm72 0v-73q100-14 164-87t64-174q0-110-76.5-186.5T481-650h-27l77 76-51 51-170-169 170-170 51 51-90 89h39q70 0 131 26t106.5 71.5Q763-579 789.5-518T816-387q0 131-85.5 225.5T516-53ZM198-204q-29-45-41.5-94.5T144-399h73q0 37 8 73t27 69l-54 53Zm-43-267q11-42 32.5-81t54.5-72l51 50q-23 23-38 49t-24 54h-76Z"/></svg>
							</label>
							<input type="range" id="angleSlider" min="-45" max="45" value="-20" step="1">
							<span>
								<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M516-53v-73q41-6 79-24t70-49l51 51q-42 42-93.5 65.5T516-53Zm-72 0Q315-67 229.5-161.5T144-387q0-70 26.5-131t72-106.5Q288-670 349-696t131-26h39l-90-89 51-51 170 170-170 169-51-51 77-76h-27q-110 0-186.5 76.5T216-387q0 101 64 174t164 87v73Zm318-151-54-53q19-33 27-69t8-73h73q0 51-12.5 100.5T762-204Zm43-267h-76q-9-28-24-54t-38-49l51-50q33 33 54.5 72t32.5 81Z"/></svg></span>
						</div>
						<div class="text-inputs">
							<input type="text" id="top-text" placeholder="Enter top text" value="WHY">
							<input type="text" id="bottom-text" placeholder="Enter bottom text" value="2025">
						</div>
					</div>

					<div id="settings-pattern" class="settings-section">
						<button id="generatePattern">
							<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M196-331q-20-36-28-72.5t-8-74.5q0-131 94.5-225.5T480-798h43l-80-80 39-39 149 149-149 149-40-40 79-79h-41q-107 0-183.5 76.5T220-478q0 29 5.5 55t13.5 49l-43 43ZM476-40 327-189l149-149 39 39-80 80h45q107 0 183.5-76.5T740-479q0-29-5-55t-15-49l43-43q20 36 28.5 72.5T800-479q0 131-94.5 225.5T480-159h-45l80 80-39 39Z"/></svg>
						</button>
					</div>

					<div id="download-buttons" class="settings-section">
						<button id="downloadSvg">
							<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M480-313 287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193ZM220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Z"/></svg>
							<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M620-80v-95L310-330H120v-220h175l125-140v-190h220v220H474L340-510v129l280 139v-58h220v220H620ZM480-720h100v-100H480v100ZM180-390h100v-100H180v100Zm500 250h100v-100H680v100ZM530-770ZM230-440Zm500 250Z"/></svg>
						</button>
						<button id="downloadPng">
							<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M480-313 287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193ZM220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Z"/></svg>
							<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm56-97h489L578-473 446-302l-93-127-117 152Zm-56 97v-600 600Z"/></svg>
						</button>
					</div>
				</div>
			</div>	
		`;
		this.shadow.appendChild(container.content.cloneNode(true));
	}
	
	
	connectedCallback() {
		this.paperCanvas = this.shadow.getElementById('paperCanvas')

		this.shadow.getElementById('colorPicker1').addEventListener('color-selected', (e) => {
			this.selectedColors[0] = e.detail
			this.paperCanvas.setColors(this.selectedColors)
		})

		this.shadow.getElementById('colorPicker2').addEventListener('color-selected', (e) => {
			this.selectedColors[1] = e.detail
			this.paperCanvas.setColors(this.selectedColors)
		})

		this.shadow.getElementById('colorPicker3').addEventListener('color-selected', (e) => {
			this.selectedColors[2] = e.detail
			this.paperCanvas.setColors(this.selectedColors)
		})

		

		this.shadow.getElementById('angleSlider').addEventListener('input', (e) => {
			this.paperCanvas.setAngle(e.target.value)
		})

		let topTextDebounceTimer;
		this.shadow.getElementById('top-text').addEventListener('input', (e) => {
			clearTimeout(topTextDebounceTimer);
			console.log("type")
			topTextDebounceTimer = setTimeout(() => {
				console.log("set")
				this.paperCanvas.setText(this.shadow.getElementById('top-text').value, this.shadow.getElementById('bottom-text').value);
			}, 500); // 300ms debounce delay
		});

		this.shadow.getElementById('bottom-text').addEventListener('input', (e) => {
			clearTimeout(topTextDebounceTimer);
			console.log("type")
			topTextDebounceTimer = setTimeout(() => {
				console.log("set")
				this.paperCanvas.setText(this.shadow.getElementById('top-text').value, this.shadow.getElementById('bottom-text').value);
			}, 500); // 300ms debounce delay
		});

		this.shadow.getElementById('downloadSvg').addEventListener('click', () => {
			this.paperCanvas.exportSVG()
		})

		this.shadow.getElementById('downloadPng').addEventListener('click', () => {
			this.paperCanvas.exportPNG()
		})

		this.shadow.getElementById('logo-select').addEventListener('click', () => {
			this.paperCanvas.setType('logo')
		})

		this.shadow.getElementById('pattern-select').addEventListener('click', () => {
			this.paperCanvas.setType('pattern')
		})

		this.shadow.getElementById('generatePattern').addEventListener('click', () => {
			this.paperCanvas.generatePattern()
		})
	}

}

customElements.define('why-settings', Settings);