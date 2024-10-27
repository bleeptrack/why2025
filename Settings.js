'use strict';

import { PaperCanvas } from "./PaperCanvas.js";
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
					
			</style>
			<div id="content">
				<paper-canvas id="paperCanvas"></paper-canvas>
				<div id="settings">

					<div id="settings-type" class="settings-section">
						<div class="type-selection">
							<label>
								<input id="logo-select" type="radio" name="type" value="logo" checked>
								Logo
							</label>
							<label>
								<input id="pattern-select" type="radio" name="type" value="pattern">
								Pattern
							</label>
						</div>
					</div>


					<div id="settings-logo" class="settings-section">
						<div class="color-pickers">
							<div class="color-picker">
								<label for="color1">Color 1:</label>
								<select id="color1">
									${this.colors.map(color => `<option value="${color}" ${color === this.selectedColors[0] ? 'selected' : ''}>${color}</option>`).join('')}
								</select>
							</div>
							<div class="color-picker">
								<label for="color2">Color 2:</label>
								<select id="color2">
									${this.colors.map(color => `<option value="${color}" ${color === this.selectedColors[1] ? 'selected' : ''}>${color}</option>`).join('')}
								</select>
							</div>
							<div class="color-picker">
								<label for="color3">Color 3:</label>
								<select id="color3">
									${this.colors.map(color => `<option value="${color}" ${color === this.selectedColors[2] ? 'selected' : ''}>${color}</option>`).join('')}
								</select>
							</div>
						</div>
						<div class="angle-slider">
							<label for="angleSlider">Angle:</label>
							<input type="range" id="angleSlider" min="-45" max="45" value="0" step="1">
							<span id="angleValue">0°</span>
						</div>
						<div class="text-inputs">
							<div class="text-input">
								<label for="top-text">Top Text:</label>
								<input type="text" id="top-text" placeholder="Enter top text">
							</div>
							<div class="text-input">
								<label for="bottom-text">Bottom Text:</label>
								<input type="text" id="bottom-text" placeholder="Enter bottom text">
							</div>
						</div>
					</div>

					<div id="settings-pattern" class="settings-section">
						<button id="generatePattern">new pattern</button>
					</div>

					<div id="download-buttons" class="settings-section">
						<button id="downloadSvg">Download SVG</button>
						<button id="downloadPng">Download PNG</button>
					</div>
				</div>
			</div>	
		`;
		this.shadow.appendChild(container.content.cloneNode(true));
	}
	
	
	connectedCallback() {
		this.paperCanvas = this.shadow.getElementById('paperCanvas')

		this.shadow.getElementById('color1').addEventListener('change', (e) => {
			this.selectedColors[0] = e.target.value
			this.paperCanvas.setColors(this.selectedColors)
		})

		this.shadow.getElementById('color2').addEventListener('change', (e) => {
			this.selectedColors[1] = e.target.value
			this.paperCanvas.setColors(this.selectedColors)
		})

		this.shadow.getElementById('color3').addEventListener('change', (e) => {
			this.selectedColors[2] = e.target.value
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