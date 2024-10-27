export function addGlow(element, col, strokeCorrection) {
    let color = col ? col : element.strokeColor
    if(!color) color = 'red'
    console.log("strokeCorrection", strokeCorrection)
    element.strokeWidth = strokeCorrection ? 15 * strokeCorrection : 15
    element.strokeColor = color
    element.fillColor = null

    let highlight = element.clone()
    highlight.strokeWidth = element.strokeWidth * 0.1
    highlight.strokeColor = 'white'
    highlight.opacity = 0.3
    highlight.strokeCap = 'round'
    highlight.name = 'highlight'

    let dropshadow = element.clone()
    dropshadow.shadowColor = 'black'
    dropshadow.shadowBlur = 4
    dropshadow.shadowOffset = new Point(-element.strokeWidth/2, element.strokeWidth/2)
    dropshadow.opacity = 0.5
    dropshadow.name = 'dropshadow'

    let glow = element.clone()
    glow.shadowColor = color
    glow.shadowBlur = element.strokeWidth * 2
    glow.name = 'glow'

    //make the main line slightlyfuzzy
    element.shadowColor = color
    element.shadowBlur = 4
    element.name = 'line'

    let group = new Group()
    group.addChild(glow)
    group.addChild(dropshadow)
    group.addChild(element)
    group.addChild(highlight)

    return group
    
}

export function getAvailableColors(){
    return [
        '#F25E95',
        '#B03BBF',
        '#5234BF',
        '#FFFB96',
        '#F24535',
        '#61F2FF'
    ]
}

export function setColor(group, col){
    console.log("setting color", group)
    group.children['line'].strokeColor = col
    group.children['line'].shadowColor = col
    group.children['glow'].shadowColor = col
    group.children['glow'].strokeColor = col
}

// Fisher-Yates shuffle algorithm
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}





