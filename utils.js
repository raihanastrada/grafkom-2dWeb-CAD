function hexToRGB(value) {
    // #XXXXXX -> ["XX", "XX", "XX"]
    var value = value.match(/[A-Za-z0-9]{2}/g);

    // ["XX", "XX", "XX"] -> [n, n, n]
    value = value.map(function(v) { return parseInt(v, 16) });
    value = value.map(function(v) { return (v/255).toFixed(3)})
    return value
}

function getColor() {
    var colorChoice = document.getElementById("color").value
    colorChoice = hexToRGB(colorChoice)
    return colorChoice;
}

function getOption(){
    var options = document.getElementsByName("option")
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return options[i].value
        }
    }
}

function getPolygonSisi() {
    var polygonSisi = document.getElementById("polygonSisi").value
    return polygonSisi
}

function getShapeSize() {
    var shapeSize = document.getElementById("widthSlide").value
    return shapeSize
}

function getProporsiXYRectangle() {
    var proporsiXInput = parseInt(document.getElementById("proporsiXRectangle").value)
    var proporsiYInput = parseInt(document.getElementById("proporsiYRectangle").value)
    return [proporsiXInput, proporsiYInput]
}

function saveFile(params) {
    console.log("Save button clicked")
    // TODO    
}

function loadFile(params) {
    console.log("Load button clicked")
    // TODO
}

function getShape() {
    var shapeChoice = document.getElementsByName("shape");
    for (let i = 0; i < shapeChoice.length; i++) {
        if (shapeChoice[i].checked) {
            return shapeChoice[i].value
        }
    }
}