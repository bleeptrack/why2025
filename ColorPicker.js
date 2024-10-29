'use strict';

import { getAvailableColors } from "./styler.js";

export class ColorPicker extends HTMLElement {
	constructor(n) {
		
		super();
	
		this.shadow = this.attachShadow({ mode: 'open' });

		const container = document.createElement('template');
		this.colors = getAvailableColors()

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<style>
				#content {
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: space-around;
					margin: 1vh 0;
				}
				.color-option {
					width: 14%;
					height: max(4vh, 4vw);
					border-radius: 5px;
                    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
					-moz-box-sizing: border-box;    /* Firefox, other Gecko */
					box-sizing: border-box; 
				}
				input[type="radio"]:not(:checked) + label {
					background-color: transparent !important;
				}
                input[type="radio"]:not(:checked) + label:hover {
					border-width: max(1vh, 1vw) !important;
				}
				input[type="radio"]:disabled + label {
					cursor: not-allowed !important;
					opacity: 0.5 !important;
				}
			</style>
			<div id="content">
				
			</div>	
		`;
		this.shadow.appendChild(container.content.cloneNode(true));
	}
	
	disable() {
		this.shadow.querySelectorAll('input[type="radio"]').forEach(input => {
			input.disabled = true
		})
	}

	enable() {
		this.shadow.querySelectorAll('input[type="radio"]').forEach(input => {
			input.disabled = false
		})
	}
	
	connectedCallback() {
		let content = this.shadow.querySelector('#content')
        let groupName = `colorPicker${this.id}`
        let checkedColor = this.getAttribute('checkedColor')
		this.colors.forEach( (color, index) => {
			let colorDiv = document.createElement('input')
			colorDiv.type = 'radio'
			colorDiv.name = groupName
			colorDiv.value = color
			colorDiv.autocomplete = 'off'
			colorDiv.id = `color${index}`
            colorDiv.style.display = 'none'
			content.appendChild(colorDiv)
            if(index == checkedColor){
                colorDiv.checked = true
            }

            let label = document.createElement('label')
            label.htmlFor = colorDiv.id
            label.classList.add('color-option')

            label.style.backgroundColor = color
			label.style.border = `2px solid ${color}`
            content.appendChild(label)

			colorDiv.addEventListener('click', () => {
				this.dispatchEvent(new CustomEvent('color-selected', { detail: color }))
			})
		})
	}

    activateColor(color) {
        let colorDiv = this.shadow.querySelector(`#color${this.colors.indexOf(color)}`)
        colorDiv.checked = true
    }

}

customElements.define('color-picker', ColorPicker);
