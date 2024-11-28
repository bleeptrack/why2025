'use strict';

import { addGlow, setColor } from './styler.js'

class PatternGenerator {
	constructor() {

        this.layer = new Layer()
        this.layer.name = 'pattern'
        this.layer.sendToBack()


        if(paper.project.layers['pattern']){
            paper.project.layers['pattern'].remove()
        }

        paper.project.addLayer(this.layer)
        this.layer.activate()

        this.createBaseStars()
        this.createWrappingStars()
        this.makeConnections()
        this.cleanUp()

        this.layer.fitBounds(paper.view.bounds)
        this.layer.scale(0.8)
	}

    hide(){
       this.layer.visible = false
    }

    show(){
       this.layer.visible = true
    }

    createBaseStars() {
        this.baseRectangle = new Path.Rectangle(new Point(0, 0), new Size(800, 800))
        this.baseRectangle.fillColor = 'black'
        this.baseRectangle.position = view.center

        this.patternRectangle = new Path.Rectangle(new Point(0, 0), this.baseRectangle.bounds.size.subtract(new Size(50, 50)))
        this.patternRectangle.position = this.baseRectangle.position
        this.patternRectangle.remove()

        this.stars = []
        for(let i = 0; i < Math.random() * 150 + 80; i++) {
            let star = new Path.Circle(new Point(0, 0), Math.random() * 5 + 3)
            star.scale(0.2)
            star.fillColor = 'white'
            star.position = Point.random().multiply(this.patternRectangle.bounds.size).add(this.patternRectangle.bounds.topLeft)
            this.stars.push(star)
        }
        console.log("created", this.stars.length, "stars")
    }

    createWrappingStars() {
        this.wrappingStars = []
        let s = this.baseRectangle.bounds.width
        for(let star of this.stars) {
            let p1 = star.position.add(new Point(s, 0))
            let p2 = star.position.add(new Point(0, s))
            let p3 = star.position.add(new Point(-s, 0))
            let p4 = star.position.add(new Point(0, -s))
            let p5 = star.position.add(new Point(s, s))
            let p6 = star.position.add(new Point(s, -s))
            let p7 = star.position.add(new Point(-s, s))
            let p8 = star.position.add(new Point(-s, -s))
            
            let positions = [p1, p2, p3, p4, p5, p6, p7, p8]
            for(let p of positions) {
                let wrappingStar = new Path.Circle(p, 10)
                wrappingStar.fillColor = 'red'
                wrappingStar.wrappingStar = true
                wrappingStar.originalPosition = star.position
                if(wrappingStar.position.getDistance(this.baseRectangle.position) < s*0.8) {
                    this.wrappingStars.push(wrappingStar)
                }else{
                    wrappingStar.remove()
                }
            }
        }

        this.stars = this.stars.concat(this.wrappingStars)
    }

    makeConnections() {
        // Create a minimum spanning tree from the stars
        let edges = [];
        let connectedStars = new Set([this.stars[0]]);
        let remainingStars = new Set(this.stars.slice(1));

        while (remainingStars.size > 0) {
            let minEdge = null;
            let minDistance = Infinity;
            let starToAdd = null;

            for (let connectedStar of connectedStars) {
                for (let star of remainingStars) {
                    let distance = connectedStar.position.getDistance(star.position);
                    if (distance < minDistance) {
                        minDistance = distance;
                        minEdge = [connectedStar, star];
                        starToAdd = star;
                    }
                }
            }

            if (minEdge) {
                edges.push(minEdge);
                connectedStars.add(starToAdd);
                remainingStars.delete(starToAdd);
            }
        }

        // Draw the connections
        let connections = []
        for (let [star1, star2] of edges) {
            
            let connection = new Path.Line(star1.position, star2.position);
            connection.strokeColor = 'rgba(255, 255, 255, 0.7)';
            connection.strokeWidth = 3;
            
            if(!connection.intersects(this.baseRectangle)){
                if(!this.baseRectangle.bounds.contains(connection.position)){
                    connection.remove()
                }else{
                    if(Math.random() > 0.3){
                        connections.push(connection)
                    }else{
                        connection.remove()
                    }
                    
                }
            }else{ //these are boundary connections
                let inters = this.baseRectangle.getIntersections(connection)
                if(inters[0].index == 0){
                    let connection2 = connection.clone()
                    connection2.translate([this.baseRectangle.bounds.width, 0])
                    connections.push(connection2)
                    connections.push(connection)
                }
                if(inters[0].index == 1){
                    let connection2 = connection.clone()
                    connection2.translate([0, this.baseRectangle.bounds.height])
                    connections.push(connection2)
                    connections.push(connection)
                }
                if(inters[0].index >= 2){
                    connection.remove()
                }
                
            }
                
                
            
        }
       
       this.patternGroup = new Group()
       this.patternGroup.addChild(this.baseRectangle)
       this.patternGroup.addChild(this.baseRectangle.clone())
       this.patternGroup.addChildren(this.stars)
       this.patternGroup.addChildren(connections)
       this.patternGroup.clipped = true
       console.log(paper.project.activeLayer.children.length, connections.length + this.stars.length)
    }

    cleanUp() {
        for(let star of this.stars) {
            if(star.wrappingStar) {
                star.remove()
            }else{
                addGlow(star, "white", 0.5, 0.1)
            }
        }
    }

    
}



  

export default PatternGenerator;