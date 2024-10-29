'use strict';

import opentype from './node_modules/opentype.js/dist/opentype.module.js'
import { addGlow, setColor, getAvailableColors } from './styler.js'

class LogoGenerator {
	constructor() {

        this.layer = new Layer()
        this.layer.name = 'logo'
        paper.project.addLayer(this.layer)
        this.layer.activate()

        //this.loadFont();
        const buffer = fetch('./Beon-Regular.ttf').then(res => res.arrayBuffer())
        buffer.then(buffer => {
            


            this.font = opentype.parse(buffer);

            this.radius = 400
            this.colors = getAvailableColors()
            this.angle = -20
            this.textMaxHeight = this.radius/3
            this.templateCircle = new Path.Circle(paper.view.center, this.radius)
            this.templateCircle.fillColor = 'black'
            this.templateCircle.remove()

            this.gap = this.templateCircle.bounds.height/20
            
            this.generate('why', '2025')
            this.activateBackground()
            this.layer.fitBounds(paper.view.bounds)
            this.layer.scale(0.8)
        })

		

	}

    hide(){
        this.layer.visible = false
    }

    show(){
        this.layer.visible = true
    }

    activateBackground(){
        this.templateCircle.insertBelow(this.planet)
    }

    async loadFont() {
        const buffer = await fetch('./Beon-Regular.ttf').then(res => res.arrayBuffer());
        this.font = opentype.parse(await buffer);
        console.log(this.font);
    }

    generate(topText, bottomText){
        
        if(topText && bottomText){
            this.topText = topText
            this.bottomText = bottomText
            console.log("generate")
            paper.project.activeLayer.removeChildren()
            this.circleGroup = this.createCircles(this.templateCircle)

            this.assembleText(topText, bottomText)

            //this.createCircles(this.templateCircle)
            this.createRings()
            this.setAngle(this.angle)
            this.setColors(this.colors)
        }
        return [this.colors, this.angle, this.topText, this.bottomText]
    }

    setScale(scale){
        this.layer.applyMatrix = false
        this.layer.scaling = scale
    }

    setAngle(angle){
        this.planet.applyMatrix = false
        this.planet.rotation = 0
        this.planet.rotate(angle, this.templateCircle.position)
        this.rings.applyMatrix = false
        this.rings.rotation = 0
        this.rings.rotate(-angle)

        this.angle = angle
    }

    setColors(colors){
        setColor(this.planet.children[0], colors[0])
        setColor(this.planet.children[1], colors[1])
        setColor(this.planet.children[2], colors[1])
        setColor(this.planet.children[3], colors[0])
        setColor(this.planet.children[4], colors[0])
        setColor(this.planet.children[5], colors[1])

        setColor(this.rings.children[0], colors[2])
        setColor(this.rings.children[1], colors[2])

        this.colors = colors
    }

    createCircles(templateCircle) {
        let mainCirc = templateCircle.clone()
        mainCirc.fillColor = 'red'
        
        let cutout = new Path.Rectangle(new Point(0, 0), new Size(templateCircle.bounds.width, this.gap))
        cutout.position = templateCircle.position

        mainCirc = mainCirc.subtract(cutout)
        //paper.project.activeLayer.addChild(mainCirc)

        let upperCircle = PaperOffset.offset(mainCirc, -this.gap, { join: 'round' })
        upperCircle.fillColor = 'blue'
        upperCircle.remove()
        //paper.project.activeLayer.addChild(upperCircle)

        let circleHalfs = []
        circleHalfs.push(mainCirc.firstChild)
        circleHalfs.push(upperCircle.firstChild)
        circleHalfs.push(mainCirc.lastChild)
        circleHalfs.push(upperCircle.lastChild)
        
        
        return circleHalfs
    }

    createRings(){
        let ring1 = new Path.Ellipse([0,0], [this.radius*2*1.3, this.radius*0.3])
        ring1.strokeColor = 'green'
        ring1.position = this.templateCircle.position.add([0, this.gap/2])
        ring1.translate([0, ring1.bounds.height/2])

        let ring2 = ring1.clone()
        ring2.position = this.templateCircle.position.add([0, -this.gap/2])
        ring2.translate([0, ring2.bounds.height/2])
        let cutCircle = new Path.Circle([0,0], this.radius+this.gap/2)
        cutCircle.position = this.templateCircle.position
        cutCircle.fillColor = 'red'

        let inters1 = ring1.getIntersections(cutCircle)
        ring1.splitAt(inters1[0])
        let leftover1 = ring1.splitAt(inters1[1])

        let inters2 = ring2.getIntersections(cutCircle)
        ring2.splitAt(inters2[0])
        let leftover2 = ring2.splitAt(inters2[1])

        cutCircle.remove()
        ring1.remove()
        ring2.remove()

        this.rings = new Group()
        this.rings.addChild(addGlow(leftover1))
        this.rings.addChild(addGlow(leftover2))
        console.log(this.rings.children)
        this.rings.pivot = this.templateCircle.position

        //addGlow(leftover1)
        return this.rings
    }

    assembleText(text1, text2){
        let [textpath1, w1] = this.createText(text1)
        let [textpath2, w2] = this.createText(text2)
        
        textpath1.bounds.bottomRight = this.circleGroup[0].bounds.bottomCenter.add([w1, 0])
        textpath2.rotate(180)
        textpath2.bounds.topLeft = this.circleGroup[2].bounds.topCenter.add([-w2, 0])

        this.planet = new Group()
        this.planet.addChild(addGlow(this.cutCircle(this.circleGroup[0], textpath1)))
        this.planet.addChild(addGlow(this.cutCircle(this.circleGroup[1], textpath1)))
        this.planet.addChild(addGlow(this.cutCircle(this.circleGroup[2], textpath2)))
        this.planet.addChild(addGlow(this.cutCircle(this.circleGroup[3], textpath2)))
        this.planet.addChild(addGlow(textpath1, null, 0.5))
        this.planet.addChild(addGlow(textpath2, null, 0.5))

    }

    cutCircle(circle, textpath){
        let outer = PaperOffset.offset(textpath, this.gap/2)
        outer.fillColor = "blue"
        
        let c = circle.clone()
        c.insertAbove(outer)
        let inters = c.getIntersections(outer)
        //inters.sort((a, b) => a.point.x - b.point.x)
        console.log(inters)
        
        c.splitAt(inters[0])
        let leftover = c.splitAt(inters[inters.length-1])
        leftover.strokeWidth = 2
        leftover.strokeColor = 'red'
        
        c.remove()
        outer.remove()
        return leftover
    }

    createText(text){
        text = text.toUpperCase()
        let plainPath = this.font.getPath(text, 0, 0, 200)
        

        let textpath = paper.project.importSVG(plainPath.toSVG())
        textpath.position = this.templateCircle.position
        textpath.fillColor = 'red'

        //let q = (textpath1.bounds.height + this.gap*1.5) / (textpath1.bounds.width/2)
        let hv = textpath.bounds.height 
        let bv = textpath.bounds.width/2
        let q = hv/bv
        let g = this.gap*1.5
        let r = this.radius - this.gap
        //let arcHeight = fontHeight + this.gap*1.5

        let a = (q*q + 1)
        let b = 2*g*q
        let c = g*g - r*r
        let w = (-b + Math.sqrt(b*b - 4*a*c))/(2*a)

       
        textpath.scale( w / (textpath.bounds.width/2) )
        
        if(textpath.bounds.height > this.textMaxHeight){
            console.log('scaling', this.textMaxHeight , textpath.bounds.height)
            textpath.scale(this.textMaxHeight / textpath.bounds.height)
        }
        return [textpath, w]
    }
        
}

export default LogoGenerator;