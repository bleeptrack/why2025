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
		this.selectedColors = [this.colors[0], this.colors[1], this.colors[2], this.colors[3]]

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
					background-color: black;
					box-shadow: 20px 0px 20px 0px rgba(0, 0, 0);
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
				input[type="radio"], input[type="checkbox"] {
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
				input:checked + label > svg {
					fill: #61F2FF !important;
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
				#settings-logo div{
					margin: 3vh 1vh;
				}
				.text-inputs{
					display: flex;
					flex-direction: column;
					align-items: center;
				}
				.text-inputs button{
					width: 5vh;
				}
				input[type="range"] {
					-webkit-appearance: none;
					appearance: none;
					background: transparent;
					cursor: pointer;
					width: 100%;
					margin: 0 1vh;
				}
				input[type="range"]::-webkit-slider-runnable-track {
					background: white;
					height: 0.25rem;
				}
				#color-mode-selector {
					display: flex;
					flex-direction: row;
					justify-content: center;
				}
				#color-mode-selector button {
					border: none;
					opacity: 0.5;
				}
				#color-mode-selector button:hover {
					opacity: 1;
				}
				#bottom-text-container{
					margin: unset !important;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					width: 100%;
				}
				#bottom-text-container input{
					margin-right: 1vh;
				}
				.activeColorMode > svg{
					fill: #61F2FF !important;
				}
				.activeColorMode {
					opacity: 1 !important;
				}

				/******** Firefox ********/
				input[type="range"]::-moz-range-track {
					background: white;
					height: 0.25rem;
				}

				input[type="range"]::-webkit-slider-thumb {
					-webkit-appearance: none; /* Override default look */
					appearance: none;
					margin-top: -12px; /* Centers thumb on the track */
					background-color: white;
					height: 2rem;
					width: 1rem; 
				}

				/******** Firefox ********/
				input[type="range"]::-moz-range-thumb {
					-webkit-appearance: none; /* Override default look */
					appearance: none;
					margin-top: -12px; /* Centers thumb on the track */
					background-color: white;
					height: 2rem;
					width: 1rem; 
				}

				:disabled {
					opacity: 0.5 !important;
					cursor: not-allowed !important;
				}
				:disabled + label{
					opacity: 0.5 !important;
					cursor: not-allowed !important;
				}
				button:hover {
					border-color: #61F2FF !important;
				}
				color-picker{
					margin: 1vh 0;
				}
				input[type="text"] {
					margin: 1vh 0;
				}
			</style>
			<div id="content">
				<paper-canvas id="paperCanvas"></paper-canvas>
				<div id="settings">

					<div id="settings-type" class="settings-section">
						<div class="type-selection">
							<input id="logo-select" type="checkbox" name="type" value="logo" checked>
							<label for="logo-select">
								<svg class="generator-type" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm-.27-60q142.38 0 241.19-99.5T820-480v-13q-6 26-27.41 43.5Q771.19-432 742-432h-80q-33 0-56.5-23.5T582-512v-40H422v-80q0-33 23.5-56.5T502-712h40v-22q0-16 13.5-40t30.5-29q-25-8-51.36-12.5Q508.29-820 480-820q-141 0-240.5 98.81T140-480h150q66 0 113 47t47 113v40H330v105q34 17 71.7 26t78.3 9Z"/></svg>
							</label>
							<input id="pattern-select" type="checkbox" name="type" value="pattern">
							<label for="pattern-select">
								<svg class="generator-type" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e8eaed"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Zm183 470 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133Z"/></svg>
							</label>
						</div>
					</div>


					<div id="settings-logo" class="settings-section">
						<div id="color-mode-selector">
							<button id="setColor" class="activeColorMode">
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>
							</button>
							<button id="setMonochrome">
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120q-133 0-226.5-92.5T160-436q0-66 25-122t69-100l226-222 226 222q44 44 69 100t25 122q0 131-93.5 223.5T480-120Zm0-80v-568L310-600q-35 33-52.5 74.5T240-436q0 97 70 166.5T480-200Z"/></svg>
							</button>
						</div>
						<div class="color-pickers">
							<color-picker id="colorPicker1" checkedColor="0"></color-picker>
							<color-picker id="colorPicker2" checkedColor="1"></color-picker>
							<color-picker id="colorPicker3" checkedColor="2"></color-picker>
							<color-picker id="colorPicker4" checkedColor="3"></color-picker>	
						</div>
						<div class="angle-slider">
							<label for="angleSlider">
								<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M444-53q-55-6-106.5-29.5T244-148l51-51q32 31 70 49t79 24v73Zm72 0v-73q100-14 164-87t64-174q0-110-76.5-186.5T481-650h-27l77 76-51 51-170-169 170-170 51 51-90 89h39q70 0 131 26t106.5 71.5Q763-579 789.5-518T816-387q0 131-85.5 225.5T516-53ZM198-204q-29-45-41.5-94.5T144-399h73q0 37 8 73t27 69l-54 53Zm-43-267q11-42 32.5-81t54.5-72l51 50q-23 23-38 49t-24 54h-76Z"/></svg>
							</label>
							<input type="range" id="angleSlider" min="-45" max="45" value="-20" step="1">
							<span>
								<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M516-53v-73q41-6 79-24t70-49l51 51q-42 42-93.5 65.5T516-53Zm-72 0Q315-67 229.5-161.5T144-387q0-70 26.5-131t72-106.5Q288-670 349-696t131-26h39l-90-89 51-51 170 170-170 169-51-51 77-76h-27q-110 0-186.5 76.5T216-387q0 101 64 174t164 87v73Zm318-151-54-53q19-33 27-69t8-73h73q0 51-12.5 100.5T762-204Zm43-267h-76q-9-28-24-54t-38-49l51-50q33 33 54.5 72t32.5 81Z"/></svg>
							</span>
						</div>
						<div class="text-inputs">
							<input type="text" id="top-text" placeholder="Enter top text" value="WHY">
							<button id="text-swap">
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-440v-287L217-624l-57-56 200-200 200 200-57 56-103-103v287h-80ZM600-80 400-280l57-56 103 103v-287h80v287l103-103 57 56L600-80Z"/></svg>
							</button>
							<div id="bottom-text-container">
							<input type="text" id="bottom-text" placeholder="Enter bottom text" value="2025">
							<input type="checkbox" id="flip-text">
							<label for="flip-text">
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-143 0-253-90T88-400h82q28 106 114 173t196 67q86 0 160-42.5T756-320H640v-80h240v240h-80v-80q-57 76-141 118T480-80Zm0-280q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM80-560v-240h80v80q57-76 141-118t179-42q143 0 253 90t139 230h-82q-28-106-114-173t-196-67q-86 0-160 42.5T204-640h116v80H80Z"/></svg>
							</label>
							</div>
							
						</div>
					</div>

					<div class="angle-slider" id="settings-logosize" class="settings-section">
						<label>
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/></svg>
						</label>
						<input type="range" id="logoSizeSlider" min="0.2" max="0.85" value="0.5" step="0.01">
						<label for="logoSizeSlider">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/></svg>
						</label>
					</div>
					<div class="angle-slider" id="settings-logorotation" class="settings-section">
						<label>
								<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M444-53q-55-6-106.5-29.5T244-148l51-51q32 31 70 49t79 24v73Zm72 0v-73q100-14 164-87t64-174q0-110-76.5-186.5T481-650h-27l77 76-51 51-170-169 170-170 51 51-90 89h39q70 0 131 26t106.5 71.5Q763-579 789.5-518T816-387q0 131-85.5 225.5T516-53ZM198-204q-29-45-41.5-94.5T144-399h73q0 37 8 73t27 69l-54 53Zm-43-267q11-42 32.5-81t54.5-72l51 50q-23 23-38 49t-24 54h-76Z"/></svg>
						</label>
						<input type="range" id="logoRotationSlider" min="-180" max="180" value="0" step="1">
						<label for="logoRotationSlider">
								<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M516-53v-73q41-6 79-24t70-49l51 51q-42 42-93.5 65.5T516-53Zm-72 0Q315-67 229.5-161.5T144-387q0-70 26.5-131t72-106.5Q288-670 349-696t131-26h39l-90-89 51-51 170 170-170 169-51-51 77-76h-27q-110 0-186.5 76.5T216-387q0 101 64 174t164 87v73Zm318-151-54-53q19-33 27-69t8-73h73q0 51-12.5 100.5T762-204Zm43-267h-76q-9-28-24-54t-38-49l51-50q33 33 54.5 72t32.5 81Z"/></svg>
						</label>
					</div>

					<div id="settings-pattern" class="settings-section">
						<button id="generatePattern">
							<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"><path d="M196-331q-20-36-28-72.5t-8-74.5q0-131 94.5-225.5T480-798h43l-80-80 39-39 149 149-149 149-40-40 79-79h-41q-107 0-183.5 76.5T220-478q0 29 5.5 55t13.5 49l-43 43ZM476-40 327-189l149-149 39 39-80 80h45q107 0 183.5-76.5T740-479q0-29-5-55t-15-49l43-43q20 36 28.5 72.5T800-479q0 131-94.5 225.5T480-159h-45l80 80-39 39Z"/></svg>
						</button>
						<input id="preview-toggle" type="checkbox" name="preview">
						<label for="preview-toggle">
							<svg xmlns="http://www.w3.org/2000/svg" height="72px" viewBox="0 -960 960 960" width="72px" fill="#e8eaed"><path d="M180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h600q24.75 0 42.38 17.62Q840-804.75 840-780v600q0 24.75-17.62 42.37Q804.75-120 780-120H180Zm0-60h600v-520H180v520Zm300.04-105Q400-285 337-328.15q-63-43.15-92-112Q274-509 336.96-552q62.96-43 143-43Q560-595 623-551.85q63 43.15 92 112Q686-371 623.04-328q-62.96 43-143 43Zm-.04-50q57 0 104.95-27.83Q632.9-390.65 660-440q-27.1-49.35-75.05-77.17Q537-545 480-545t-104.95 27.83Q327.1-489.35 300-440q27.1 49.35 75.05 77.17Q423-335 480-335Zm0-105Zm.12 50q20.88 0 35.38-14.62 14.5-14.62 14.5-35.5 0-20.88-14.62-35.38-14.62-14.5-35.5-14.5-20.88 0-35.38 14.62-14.5 14.62-14.5 35.5 0 20.88 14.62 35.38 14.62 14.5 35.5 14.5Z"/></svg>
						</label>
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
	
	getType(){
		if(this.shadow.getElementById('logo-select').checked && this.shadow.getElementById('pattern-select').checked){
			return 'combined'
		}else if(this.shadow.getElementById('logo-select').checked){
			return 'logo'
		}
		return 'pattern'
		
	}

	setUIByType(type){
		if(type === 'logo'){
			console.log("UI logo")
			this.shadow.getElementById('settings-logo').style.display = 'block'
			this.shadow.getElementById('settings-pattern').style.display = 'none'	
			this.shadow.getElementById('settings-logosize').style.display = 'none'
			this.shadow.getElementById('settings-logorotation').style.display = 'none'
		}else if(type === 'pattern'){
			console.log("UI pattern")
			this.shadow.getElementById('settings-logo').style.display = 'none'
			this.shadow.getElementById('settings-pattern').style.display = 'flex'	
			this.shadow.getElementById('settings-logosize').style.display = 'none'
			this.shadow.getElementById('settings-logorotation').style.display = 'none'
		}else{
			console.log("UI combined")
			this.shadow.getElementById('settings-logo').style.display = 'block'
			this.shadow.getElementById('settings-pattern').style.display = 'flex'
			this.shadow.getElementById('settings-logosize').style.display = 'flex'
			this.shadow.getElementById('settings-logorotation').style.display = 'flex'
		}
	}

	disableUI(){
		this.shadow.getElementById('logo-select').disabled = true
		this.shadow.getElementById('pattern-select').disabled = true
		this.shadow.getElementById('generatePattern').disabled = true
		this.shadow.getElementById('downloadSvg').disabled = true
		this.shadow.getElementById('downloadPng').disabled = true
		this.shadow.getElementById('logoSizeSlider').disabled = true
		this.shadow.getElementById('angleSlider').disabled = true
		this.shadow.getElementById('top-text').disabled = true
		this.shadow.getElementById('bottom-text').disabled = true
		this.shadow.querySelectorAll('color-picker').forEach(input => {
			console.log(input)
			input.disable()
		})
		
	}

	enableUI(){
		this.shadow.getElementById('logo-select').disabled = false
		this.shadow.getElementById('pattern-select').disabled = false
		this.shadow.getElementById('generatePattern').disabled = false
		this.shadow.getElementById('downloadSvg').disabled = false
		this.shadow.getElementById('downloadPng').disabled = false
		this.shadow.getElementById('logoSizeSlider').disabled = false
		this.shadow.getElementById('angleSlider').disabled = false
		this.shadow.getElementById('top-text').disabled = false
		this.shadow.getElementById('bottom-text').disabled = false
		this.shadow.querySelectorAll('color-picker').forEach(input => {
			input.enable()
		})
	}
	
	connectedCallback() {
		this.paperCanvas = this.shadow.getElementById('paperCanvas')

		this.shadow.getElementById('setMonochrome').addEventListener('click', () => {
			this.paperCanvas.setMonochrome()
			this.shadow.querySelectorAll('color-picker').forEach(input => {
				console.log(input)
				input.disable()
			})
			this.shadow.getElementById('setColor').classList.remove('activeColorMode')
			this.shadow.getElementById('setMonochrome').classList.add('activeColorMode')
		})

		this.shadow.getElementById('setColor').addEventListener('click', () => {
			this.paperCanvas.setColors(this.selectedColors)
			this.shadow.querySelectorAll('color-picker').forEach(input => {
				console.log(input)
				input.enable()
			})
			this.shadow.getElementById('setMonochrome').classList.remove('activeColorMode')
			this.shadow.getElementById('setColor').classList.add('activeColorMode')
		})

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

		this.shadow.getElementById('colorPicker4').addEventListener('color-selected', (e) => {
			this.selectedColors[3] = e.detail
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
				if(this.shadow.getElementById('top-text').value.trim() !== ''){
					this.paperCanvas.setText(this.shadow.getElementById('top-text').value, this.shadow.getElementById('bottom-text').value, this.shadow.getElementById('flip-text').checked);
					this.paperCanvas.setType(this.getType())
				}
			}, 500); // 300ms debounce delay
		});

		this.shadow.getElementById('bottom-text').addEventListener('input', (e) => {
			clearTimeout(topTextDebounceTimer);
			console.log("type")
			topTextDebounceTimer = setTimeout(() => {
				console.log("set")
				if(this.shadow.getElementById('bottom-text').value.trim() !== ''){
					this.paperCanvas.setText(this.shadow.getElementById('top-text').value, this.shadow.getElementById('bottom-text').value, this.shadow.getElementById('flip-text').checked);
					this.paperCanvas.setType(this.getType())
				}
			}, 500); // 300ms debounce delay
		});

		this.shadow.getElementById('flip-text').addEventListener('click', () => {
			this.paperCanvas.setText(this.shadow.getElementById('top-text').value, this.shadow.getElementById('bottom-text').value, this.shadow.getElementById('flip-text').checked)
			this.paperCanvas.setType(this.getType())
		})

		this.shadow.getElementById('text-swap').addEventListener('click', () => {
			let topText = this.shadow.getElementById('top-text').value
			let bottomText = this.shadow.getElementById('bottom-text').value
			this.shadow.getElementById('top-text').value = bottomText
			this.shadow.getElementById('bottom-text').value = topText
			this.paperCanvas.setText(this.shadow.getElementById('top-text').value, this.shadow.getElementById('bottom-text').value, this.shadow.getElementById('flip-text').checked)
			this.paperCanvas.setType(this.getType())
		})

		this.shadow.getElementById('downloadSvg').addEventListener('click', () => {
			let colored = this.shadow.getElementById('setColor').classList.contains('activeColorMode')
			this.paperCanvas.exportSVG(colored)
		})

		this.shadow.getElementById('downloadPng').addEventListener('click', () => {
			let colored = this.shadow.getElementById('setColor').classList.contains('activeColorMode')
			this.paperCanvas.exportPNG(colored)
		})

		this.shadow.getElementById('logo-select').addEventListener('click', () => {
			if(!this.shadow.getElementById('logo-select').checked && !this.shadow.getElementById('pattern-select').checked){
				this.shadow.getElementById('logo-select').checked = true
				console.log("keep logo checked")
			}else{
				this.setUIByType(this.getType())
				this.paperCanvas.setType(this.getType())
			}

		})

		this.shadow.getElementById('pattern-select').addEventListener('click', () => {
			if(!this.shadow.getElementById('logo-select').checked && !this.shadow.getElementById('pattern-select').checked){
				this.shadow.getElementById('pattern-select').checked = true
				console.log("keep pattern checked")
			}else{
				this.setUIByType(this.getType())
				this.paperCanvas.setType(this.getType())
			}
		})

		this.shadow.getElementById('generatePattern').addEventListener('click', () => {
			this.paperCanvas.generatePattern(this.shadow.getElementById('top-text').value+this.shadow.getElementById('bottom-text').value)
			this.paperCanvas.setType(this.getType())
		})

		this.shadow.getElementById('logoSizeSlider').addEventListener('input', (e) => {
			this.paperCanvas.setLogoSize(e.target.value)
		})

		this.shadow.getElementById('logoRotationSlider').addEventListener('input', (e) => {
			this.paperCanvas.setLogoRotation(e.target.value)
		})

		this.shadow.getElementById('preview-toggle').addEventListener('click', () => {
			if(this.shadow.getElementById('preview-toggle').checked){
				this.paperCanvas.setPNGasBackground()
				this.disableUI()
			}else{
				this.enableUI()
				document.body.style.background = 'black'
				if(this.shadow.getElementById('logo-select').checked){
					this.paperCanvas.logo.show()
				}
				if(this.shadow.getElementById('pattern-select').checked){
					this.paperCanvas.pattern.show()
				}
			}
		})

		this.setUIByType(this.getType())
	}

}

customElements.define('why-settings', Settings);