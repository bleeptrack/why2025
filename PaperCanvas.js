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

	generatePattern(text, includeLogo = false){
		this.pattern = new PatternGenerator(text);
		if(includeLogo){
			this.logo.show()
		}
	}

	setType(type){
		if(type === 'logo'){
			this.logo.setScale(1)
			this.logo.setBackgroundSpacer(false)
			this.logo.show()
			this.pattern.hide()
			document.body.style.background = 'black'
		}else if(type === 'pattern'){
			if(!this.pattern){
				this.pattern = new PatternGenerator();
			}
			this.logo.hide()
			this.pattern.show()
		}else{
			if(!this.pattern){
				this.pattern = new PatternGenerator();
			}
			this.logo.setScale(0.5)
			this.logo.setBackgroundSpacer(true)
			this.logo.show()
			this.pattern.show()
			this.logo.layer.bringToFront()
		}
	}

	setMonochrome(){
		this.logo.setMonochrome()
	}

	setLogoSize(size){
		this.logo.setScale(size)
	}

	setLogoRotation(rotation){
		this.logo.setRotation(rotation)
	}

	setColors(colors){
		this.logo.setColors(colors)
	}

	setAngle(angle){
		this.logo.setAngle(angle)
	}

	setText(topText, bottomText, flipText = false){
		this.logo.generate(topText, bottomText, flipText)
		let vis = this.pattern ? this.pattern.isVisible() : false
		
		this.pattern = new PatternGenerator(topText+bottomText);
		if(!vis){
			this.pattern.hide()
		}
	}

	async exportPNG(colored){
		
			paper.view.draw();
			//paper.view.element.toBlob((blob) => { this.saveAs(blob, "image.png");});
			let blob = await this.trimTransparentPixels()
			this.saveAs(blob, "image.png")

			if(!colored){
				// Create a temporary canvas for inverting colors
				const invCanvas = document.createElement('canvas');
				const invCtx = invCanvas.getContext('2d');

				// Convert blob to image to work with
				const img = new Image();
				const blobUrl = URL.createObjectURL(blob);

				return new Promise((resolve) => {
					img.onload = () => {
						invCanvas.width = img.width;
						invCanvas.height = img.height;

						// Draw original image
						invCtx.drawImage(img, 0, 0);

						// Get image data and invert colors
						const imageData = invCtx.getImageData(0, 0, invCanvas.width, invCanvas.height);
						const data = imageData.data;
						for (let i = 0; i < data.length; i += 4) {
							data[i] = 255 - data[i];         // Red
							data[i + 1] = 255 - data[i + 1]; // Green 
							data[i + 2] = 255 - data[i + 2]; // Blue
						}

						// Put inverted image data back
						invCtx.putImageData(imageData, 0, 0);

						// Convert to blob and save
						invCanvas.toBlob(invBlob => {
							this.saveAs(invBlob, "image-inverted.png");
							URL.revokeObjectURL(blobUrl);
							resolve();
						});
					};
					img.src = blobUrl;
				});
			}
		
	}

	exportSVG(colored){

			let dropShadow = `
			<filter id="dropShadow">
			<feGaussianBlur in="SourceAlpha" stdDeviation="4" />
			<feOffset dx="-4" dy="4" />
			<feMerge>
			<feMergeNode />
			<feMergeNode in="SourceGraphic" />
			</feMerge>
			</filter>
			<filter id="glow">
				<feGaussianBlur in="SourceGraphic" stdDeviation="12" />
			</filter>
			`
		
			
			

			//this.setSVGasBackground()
			// Get the SVG representation of the current paper.js project
			let svg = paper.project.exportSVG({ asString: true });

			
			svg = svg.replaceAll('id="dropshadow"', 'id="dropshadow" filter="url(#dropShadow)"');
			svg = svg.replaceAll('id="glow"', 'id="glow" filter="url(#glow)"');
			svg = svg.replace('><g', '>' + dropShadow + '<g');

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
		trimmedCanvas.width = trimmedWidth-1;
		trimmedCanvas.height = trimmedHeight-1;

		// Draw the trimmed image
		const trimmedCtx = trimmedCanvas.getContext('2d');
		trimmedCtx.drawImage(tempCanvas, minX, minY, trimmedWidth-1, trimmedHeight-1, 0, 0, trimmedWidth-1, trimmedHeight-1);

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
		this.logo.hide()
		this.pattern.hide()
		//document.body.style.backgroundRepeat = 'no-repeat';
		//document.body.style.backgroundPosition = 'center';
		//document.body.style.backgroundSize = 'cover';

		//paper.project.activeLayer.removeChildren()

		// Clean up the object URL to free memory
		//URL.revokeObjectURL(url);
	}

	async setPNGasBackground(){
		
		paper.view.draw()
		let blob = await this.trimTransparentPixels()
		document.body.style.backgroundImage = `url(${URL.createObjectURL(blob)})`
		document.body.style.backgroundSize = '30%'
		this.logo.hide()
		this.pattern.hide()
	}

}

customElements.define('paper-canvas', PaperCanvas);
