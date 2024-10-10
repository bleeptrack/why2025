'use strict';

import LogoGenerator from './LogoGenerator.js';

export class PaperCanvas extends HTMLElement {
	constructor(n) {
		
		super();
	
		this.shadow = this.attachShadow({ mode: 'open' });

		const container = document.createElement('template');

		// creating the inner HTML of the editable list element
		container.innerHTML = `
			<style>
				
				canvas[resize] {
					width: 100%;
					height: 100%;
				}	
			</style>
			
			<canvas id="paperCanvas" resize="true"></canvas>
				
		`;
		this.shadow.appendChild(container.content.cloneNode(true));
	}
	
	
	connectedCallback() {
		paper.install(window)
		let canvas = this.shadow.getElementById('paperCanvas');
		paper.setup(canvas);
		
		let rect = new Path.Rectangle(new Point(0, 0), new Size(100, 100));
        rect.fillColor = 'red';

        this.logo = new LogoGenerator();
	}

}

customElements.define('paper-canvas', PaperCanvas);
