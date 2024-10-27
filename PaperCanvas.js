'use strict';

import LogoGenerator from './LogoGenerator.js';
import PatternGenerator from './PatternGenerator.js';

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

        this.logo = new LogoGenerator();
        //this.pattern = new PatternGenerator();
		//this.setSVGasBackground()
	}

	generatePattern(){
		this.pattern = new PatternGenerator();
	}

	setType(type){
		if(type === 'logo'){
			this.logo.show()
			this.pattern.hide()
		}else if(type === 'pattern'){
			if(!this.pattern){
				this.pattern = new PatternGenerator();
			}
			this.logo.hide()
			this.pattern.show()
		}
	}

	setColors(colors){
		this.logo.setColors(colors)
	}

	setAngle(angle){
		this.logo.setAngle(angle)
	}

	setText(topText, bottomText){
		this.logo.generate(topText, bottomText)
	}

	async exportPNG(){
		paper.view.draw();
		//paper.view.element.toBlob((blob) => { this.saveAs(blob, "image.png");});
		let blob = await this.trimTransparentPixels()
		this.saveAs(blob, "image.png")
	}

	exportSVG(){
		//this.setSVGasBackground()
		// Get the SVG representation of the current paper.js project
		const svg = paper.project.exportSVG({ asString: true });

		// Create a Blob with the SVG content
		const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });

		// Create a temporary URL for the Blob
		const url = URL.createObjectURL(blob);

		// Create a temporary anchor element
		const link = document.createElement('a');
		link.href = url;
		link.download = 'image.svg';

		// Append the link to the body, click it, and remove it
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Release the URL object
		URL.revokeObjectURL(url);
	}

	trimTransparentPixels() {
		// Create a temporary canvas to work with
		const tempCanvas = document.createElement('canvas');
		const tempCtx = tempCanvas.getContext('2d');

		// Get the current canvas content
		const originalCanvas = paper.view.element;
		tempCanvas.width = originalCanvas.width;
		tempCanvas.height = originalCanvas.height;
		tempCtx.drawImage(originalCanvas, 0, 0);

		// Get image data
		const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
		const data = imageData.data;

		// Find the boundaries of non-transparent pixels
		let minX = tempCanvas.width, minY = tempCanvas.height, maxX = 0, maxY = 0;
		for (let y = 0; y < tempCanvas.height; y++) {
			for (let x = 0; x < tempCanvas.width; x++) {
				const alpha = data[(y * tempCanvas.width + x) * 4 + 3];
				if (alpha !== 0) {
					minX = Math.min(minX, x);
					minY = Math.min(minY, y);
					maxX = Math.max(maxX, x);
					maxY = Math.max(maxY, y);
				}
			}
		}

		// Calculate new dimensions
		const trimmedWidth = maxX - minX + 1;
		const trimmedHeight = maxY - minY + 1;

		// Create a new canvas with trimmed size
		const trimmedCanvas = document.createElement('canvas');
		trimmedCanvas.width = trimmedWidth;
		trimmedCanvas.height = trimmedHeight;

		// Draw the trimmed image
		const trimmedCtx = trimmedCanvas.getContext('2d');
		trimmedCtx.drawImage(tempCanvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);

		// Convert to blob and return
		return new Promise(resolve => {
			trimmedCanvas.toBlob(blob => {
				resolve(blob);
			});
		});
	}

	saveAs(blob, fileName) {
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = fileName;
		link.click();
		URL.revokeObjectURL(link.href);
	}

	setSVGasBackground(){
		paper.view.draw()
		let svg = paper.project.exportSVG({asString: true, bounds: this.pattern.baseRectangle.bounds})
		// Create a data URL from the SVG string
		const svgBlob = new Blob([svg], {type: 'image/svg+xml'});
		const url = URL.createObjectURL(svgBlob);

		// Set the SVG as the background image of the body
		document.body.style.backgroundImage = `url(${url})`;
		//document.body.style.backgroundRepeat = 'no-repeat';
		//document.body.style.backgroundPosition = 'center';
		//document.body.style.backgroundSize = 'cover';

		//paper.project.activeLayer.removeChildren()

		// Clean up the object URL to free memory
		//URL.revokeObjectURL(url);
	}

}

customElements.define('paper-canvas', PaperCanvas);
