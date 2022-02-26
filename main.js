var mouseXPos = 0
var mouseYPos = 0

// Fungsionalitas Geser Persegi Panjang
var secondClickMove = false
var chosen = []

var isCreatingPolygon = false;
var polygonPoints = [];
var polygonColor = [];
var polygonNodes;

// Get A WebGL context
var canvas = document.querySelector("#my-canvas");
var gl = canvas.getContext("webgl")
if (!gl) {
    console.log("Your browser not supported webgl, retry experimental-webgl")
    gl = canvas.getContext("experimental-webgl")
}

// Setup GLSL program
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
var program = createProgram(gl, vertexShader, fragmentShader);

// Look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");

// Look up uniform locations
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");

// Create a buffer to put 2d clip space points in
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

var garis = []
var persegi = []
var persegiPanjang = []
var polygon = []

/**
 * Function to render drawing
 */
function drawCanvas() {
    // Clear the canvas
    gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
        
    // Set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    if (garis.length != 0) {
        // Draw each Line
        for (let i = 0; i < garis.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            var x1 = garis[i].position[0]
            var x2 = garis[i].position[1]
            var y1 = garis[i].position[2]
            var y2 = garis[i].position[3]
            var r = garis[i].color[0]
            var g = garis[i].color[1]
            var b = garis[i].color[2]
    
            createGaris(gl, x1, x2, y1, y2)
            gl.uniform4f(colorUniformLocation, r, g, b, 1);
            gl.drawArrays(gl.LINES, 0, 2);
        }
    }

    if (persegi.length != 0) {
        // Draw each Square
        for (let i = 0; i < persegi.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            var x1 = persegi[i].position[0]
            var y1 = persegi[i].position[1]
            var x2 = persegi[i].position[2]
            var y2 = persegi[i].position[3]
            var x3 = persegi[i].position[4]
            var y3 = persegi[i].position[5]
            var x4 = persegi[i].position[6]
            var y4 = persegi[i].position[7]
            var r = persegi[i].color[0]
            var g = persegi[i].color[1]
            var b = persegi[i].color[2]
            
            // createPersegiPanjang(gl, x1, x2, y1, y2)
            createPersegiPanjang(gl, x1, y1, x2, y2, x3, y3, x4, y4)
            gl.uniform4f(colorUniformLocation, r, g, b, 1);
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    if (persegiPanjang.length != 0) {
        // Draw each Rectangle
        for (let i = 0; i < persegiPanjang.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            var x1 = persegiPanjang[i].position[0]
            var y1 = persegiPanjang[i].position[1]
            var x2 = persegiPanjang[i].position[2]
            var y2 = persegiPanjang[i].position[3]
            var x3 = persegiPanjang[i].position[4]
            var y3 = persegiPanjang[i].position[5]
            var x4 = persegiPanjang[i].position[6]
            var y4 = persegiPanjang[i].position[7]
            var r = persegiPanjang[i].color[0]
            var g = persegiPanjang[i].color[1]
            var b = persegiPanjang[i].color[2]
            
            // createPersegiPanjang(gl, x1, x2, y1, y2)
            createPersegiPanjang(gl, x1, y1, x2, y2, x3, y3, x4, y4)
            gl.uniform4f(colorUniformLocation, r, g, b, 1);
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    if (polygon.length != 0) {
        // Draw each Polygon
        for (let i = 0; i < polygon.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            var r = polygon[i].color[0]
            var g = polygon[i].color[1]
            var b = polygon[i].color[2]
            
            createPolygon(gl, polygon[i].position)
            gl.uniform4f(colorUniformLocation, r, g, b, 1);

            var primitiveType = gl.TRIANGLE_FAN;
            var offset = 0;
            var count = polygon[i].position.length/2;

            gl.drawArrays(primitiveType, offset, count);
        }
    }
    
}

// Fungsionalitas Geser Persegi Panjang
var secondClickMove = false
var chosen = []
var chosenIdx = -1
var isX1Change = false
var isX2Change = false
var geserTitikPersegi = []

var isCreatingPolygon = false;
var polygonPoints = [];
var polygonColor = [];
var polygonNodes;

canvas.addEventListener("click",function(event) {
    var isWantToMove = false
    var isWantToCreate = false
    var isWantToChangeColor = false
    var isWantToChangeSize = false
    var isWantToMoveNode = false
    
    var shape = getShape()
    var color = getColor()
    var option = getOption()
    var size = getShapeSize()
    var color = getColor()
    var jumlahSisiPolygon = getPolygonSisi()

    if (option === "create") {
        isWantToCreate = true
    } else if (option === "move") {
        isWantToMove = true
    } else if (option === "changeColor") {
        isWantToChangeColor = true
    } else if (option === "changeSize") {
        isWantToChangeSize = true
    } else if (option === "moveNode") {
        isWantToMoveNode = true
    }

    if (isWantToCreate) {
        if (shape !== "polygon" && size <= 0) {
            alert("Ukuran tidak boleh <= 0")
            return
        }
        var posX = event.pageX
        var posY = event.pageY
        if (shape === "rectangle" || shape === "square") {
            var proporsiRectangle = getProporsiXYRectangle()
            var proporsiX = proporsiRectangle[0]
            var proporsiY = proporsiRectangle[1]
            if (shape==="square") {
                proporsiX = 10
                proporsiY = 10
            } else {
                if (proporsiX === 0 || proporsiY === 0 || !proporsiX || !proporsiY) {
                    alert("Proporsi X atau Y tidak boleh 0!")
                    return
                }
            }

            var x1 = posX - (size * proporsiX)
            var x2 = posX + (size * proporsiX)
            var y1 = posY - (size * proporsiY)
            var y2 = posY + (size * proporsiY)
            var midPointX = (x1 + x2) / 2
            var midPointY = (y1 + y2) / 2
            
            if (shape === "rectangle") {
                persegiPanjang.push({
                    position: [x1, y1, x2, y1, x1, y2, x2, y2],
                    color: [color[0], color[1], color[2]],
                    middlePoint: [midPointX, midPointY]
                })
            } else {
                persegi.push({
                    position: [x1, y1, x2, y1, x1, y2, x2, y2],
                    color: [color[0], color[1], color[2]],
                    middlePoint: [midPointX, midPointY]
                })
            }
            
            drawCanvas()
        } else if (shape === "line") {
            var x1 = posX - (size * 20)
            var x2 = posX + (size * 20)
            var y1 = posY 
            var y2 = posY
            var midPointX = (x1 + x2) / 2
            var midPointY = (y1 + y2) / 2

            garis.push({
                position: [x1, x2, y1, y2],
                color: [color[0], color[1], color[2]],
                middlePoint: [midPointX, midPointY]
            })
            drawCanvas()
        } else if (shape === "polygon") {
            if (!isCreatingPolygon) {
                polygonNodes = jumlahSisiPolygon;
                polygonPoints.push(posX);
                polygonPoints.push(posY);
                polygonColor = [color[0], color[1], color[2]]
                isCreatingPolygon = true;  
            }
            else {
                polygonPoints.push(posX);
                polygonPoints.push(posY);

                if (polygonPoints.length == polygonNodes*2) {
                    // Push to polygon array & reset
                    polygon.push({
                        position: polygonPoints,
                        color: polygonColor
                    })

                    polygonNodes = 0;
                    polygonPoints = [];
                    polygonColor = [];
                    isCreatingPolygon = false;
                    drawCanvas()
                }    
            }
        }

    }

    if (isWantToMoveNode) {
        if (shape === "rectangle" || shape === "square") {
            if (!secondClickMove) {
                // The first click, check if user click inside a rectangle
                var posX = event.pageX
                var posY = event.pageY
                var objToUse = []
                if (shape === "rectangle") {
                    objToUse = persegiPanjang
                } else {
                    objToUse = persegi
                }
                for (let i = 0; i < objToUse.length; i++) {
                    geserTitikPersegi = checkNearNode(objToUse[i].position, posX, posY)
                    if (geserTitikPersegi[0]) {
                        geserTitikPersegi.push(i)
                        chosen.push(geserTitikPersegi)
                        secondClickMove = true    
                    }
                }             
            } else {
                // Second Click, move the rectangular or square
                var posX = event.pageX
                var posY = event.pageY
                if (shape === "rectangle") {
                    chosen.forEach(geserTitik => {
                        persegiPanjang[geserTitik[3]].position[geserTitik[1]] = posX
                        persegiPanjang[geserTitik[3]].position[geserTitik[2]] = posY
                    })
                
                } else {
                    chosen.forEach(geserTitik => {
                        persegi[geserTitik[3]].position[geserTitik[1]] = posX
                        persegi[geserTitik[3]].position[geserTitik[2]] = posY
                    });
                }
                drawCanvas()
                secondClickMove = false
                chosen = []
            }
        } else if (shape === "line") {
            isWantToChangeSize = true
        } else if (shape === "polygon") {
            if (!secondClickMove) {
                // The first click, check if user click near polygon nodes
                var posX = event.pageX
                var posY = event.pageY
                for (let i = polygon.length-1; i >= 0; i--) {
                    geserTitikPolygon = checkNearNode(polygon[i].position, posX, posY)
                    if (geserTitikPolygon[0]) {
                        geserTitikPolygon.push(i)
                        chosen = geserTitikPolygon
                        secondClickMove = true
                        break
                    }
                }
            } else {
                // Second Click, move the node
                var posX = event.pageX
                var posY = event.pageY
                polygon[geserTitikPolygon[3]].position[geserTitikPolygon[1]] = posX
                polygon[geserTitikPolygon[3]].position[geserTitikPolygon[2]] = posY
                
                drawCanvas()
                secondClickMove = false
                chosen = []
            }
        }
    }

    if (isWantToMove) {
        if (shape === "rectangle" || shape === "square") {
            if (!secondClickMove) {
                // The first click, check if user click inside a rectangle
                var posX = event.pageX
                var posY = event.pageY
                var objToUse = []
                if (shape === "rectangle") {
                    objToUse = persegiPanjang
                } else {
                    objToUse = persegi
                }
                for (let i = 0; i < objToUse.length; i++) {
                    if (checkInsidePersegiPanjang(objToUse[i].position, posX, posY)) {
                        chosen.push(i)
                        secondClickMove = true
                    } 
                    else {
                        if (checkInPolygon(objToUse[i].position, posX, posY)) {
                            secondClickMove = true
                            chosenIdx = i;
                            break
                        }
                    }
                }             
            } else {
                // Second Click, move the rectangular or square
                var posX = event.pageX
                var posY = event.pageY
                if (shape === "rectangle") {
                    chosen.forEach(idx => {
                        var deltaX = posX - persegiPanjang[idx].middlePoint[0]
                        var deltaY = posY - persegiPanjang[idx].middlePoint[1]
                        var temp = translasiPersegiPanjang(persegiPanjang[idx].position, persegiPanjang[idx].middlePoint, deltaX, deltaY)
                        persegiPanjang[idx].position = temp[0]
                        persegiPanjang[idx].middlePoint = temp[1]
                    });
                    if (chosenIdx !== -1) {
                        translasiPolygon(persegiPanjang[chosenIdx].position, posX, posY)
                    }
                    drawCanvas()
                    secondClickMove = false
                } else {
                    chosen.forEach(idx => {
                        var deltaX = posX - persegi[idx].middlePoint[0]
                        var deltaY = posY - persegi[idx].middlePoint[1]
                        var temp = translasiPersegiPanjang(persegi[idx].position, persegi[idx].middlePoint, deltaX, deltaY)
                        persegi[idx].position = temp[0]
                        persegi[idx].middlePoint = temp[1]
                    });
                    if (chosenIdx !== -1) {
                        translasiPolygon(persegi[chosenIdx].position, posX, posY)
                    }
                }

                drawCanvas()
                secondClickMove = false
                chosen = []
                chosenIdx = -1
            }
        } else if (shape === "line") {
            if (!secondClickMove) {
                var posX = event.pageX
                var posY = event.pageY
                for (let i = 0; i < garis.length; i++) {
                    if (checkNearGaris(garis[i].position, posX, posY)) {
                        chosen.push(i)
                        secondClickMove = true
                    }
                }
            } else { // secondCliceMove = true
                var posX = event.pageX
                var posY = event.pageY
                chosen.forEach(idx => {
                    var deltaX = posX - garis[idx].middlePoint[0]
                    var deltaY = posY - garis[idx].middlePoint[1]
                    var temp = translasiGaris(garis[idx].position, garis[idx].middlePoint, deltaX, deltaY)
                    garis[idx].position = temp[0]
                    garis[idx].middlePoint = temp[1]
                });
                drawCanvas()
                secondClickMove = false
                chosen = []
            }
        } else if (shape === "polygon") {
            if (!secondClickMove) {
                // The first click, check if user click inside a polygon
                var posX = event.pageX
                var posY = event.pageY
                for (let i = polygon.length-1; i >= 0; i--) {
                    if (checkInPolygon(polygon[i].position, posX, posY)) {
                        secondClickMove = true
                        chosenIdx = i;
                        break
                    }
                }
            } else {
                // Second Click, move the polygon
                var posX = event.pageX
                var posY = event.pageY
                translasiPolygon(polygon[chosenIdx].position, posX, posY)
                
                drawCanvas()
                secondClickMove = false
                chosen = []
            }
        }

    }

    if (isWantToChangeColor) {
        if (shape === "rectangle" || shape === "square") {
            // Change Color for chosen rectangle or square
            var posX = event.pageX
            var posY = event.pageY
            
            if (shape === "rectangle") {
                for (let i = 0; i < persegiPanjang.length; i++) {
                    if (checkInsidePersegiPanjang(persegiPanjang[i].position, posX, posY)) {
                        chosen.push(i)
                        persegiPanjang[i].color =  changeColor(persegiPanjang[i].color, color[0], color[1], color[2])
                    } else {
                        if (checkInPolygon(persegiPanjang[i].position, posX, posY)) {
                            persegiPanjang[i].color = changeColor(persegiPanjang[i].color, color[0], color[1], color[2])
                        }
                    }
                }
            } else {
                for (let i = 0; i < persegi.length; i++) {
                    if (checkInsidePersegiPanjang(persegi[i].position, posX, posY)) {
                        chosen.push(i)
                        persegi[i].color =  changeColor(persegi[i].color, color[0], color[1], color[2])
                    }
                    else {
                        if (checkInPolygon(persegi[i].position, posX, posY)) {
                            persegi[i].color = changeColor(persegi[i].color, color[0], color[1], color[2])
                        }
                    }
                }
            }

            drawCanvas()
        } else if (shape === "line") {
            var posX = event.pageX
            var posY = event.pageY
            for (let i = 0; i < garis.length; i++) {
                if (checkNearGaris(garis[i].position, posX, posY)) {
                    chosen.push(i)
                    garis[i].color =  changeColor(garis[i].color, color[0], color[1], color[2])
                }
            }
            drawCanvas()
        } else if (shape === "polygon") {
            var posX = event.pageX
            var posY = event.pageY
            for (let i = polygon.length-1; i >= 0; i--) {
                if (checkInPolygon(polygon[i].position, posX, posY)) {
                    chosen.push(i)
                    polygon[i].color =  changeColor(polygon[i].color, color[0], color[1], color[2])
                    break
                }
            }
            drawCanvas()
        }
    }

    if (isWantToChangeSize) {
        if (shape === "square") {
            // Change size for chosen square
            var posX = event.pageX
            var posY = event.pageY
            for (let i = 0; i < persegi.length; i++) {
                if (checkInsidePersegiPanjang(persegi[i].position, posX, posY)) {
                    proporsiX = 10
                    proporsiY = 10
                    persegi[i].position[0] = persegi[i].position[0] - (size * proporsiX)
                    persegi[i].position[2] = persegi[i].position[2] + (size * proporsiX)
                    persegi[i].position[4] = persegi[i].position[4] - (size * proporsiX)
                    persegi[i].position[6] = persegi[i].position[6] + (size * proporsiX)
                    persegi[i].position[1] = persegi[i].position[1] - (size * proporsiY)
                    persegi[i].position[3] = persegi[i].position[3] - (size * proporsiY)
                    persegi[i].position[5] = persegi[i].position[5] + (size * proporsiY)
                    persegi[i].position[7] = persegi[i].position[7] + (size * proporsiY)
                    persegi[i].middlePoint[0] = (persegi[i].position[0] + persegi[i].position[2]) / 2
                    persegi[i].middlePoint[1] = (persegi[i].position[1] + persegi[i].position[5]) / 2
                }
            }
            drawCanvas()
        } else if (shape === "line") {
            if (!secondClickMove) {
                var posX = event.pageX
                var posY = event.pageY
                for (let i = 0; i < garis.length; i++) {
                    if (checkNearGaris(garis[i].position, posX, posY)) {
                        chosen.push(i)
                        secondClickMove = true
                        if(checkJarak(garis[i].position, posX, posY)) {
                            isX1Change = true
                        } else { 
                            isX2Change = true 
                        }
                    }
                }
            } else { //secondClickMove = true
                var posX = event.pageX
                var posY = event.pageY
                chosen.forEach(idx => {
                    if (isX1Change) { //x1 true
                        garis[idx].position[0] = posX
                        garis[idx].position[2] = posY
                    } else { //isX2Change true
                        garis[idx].position[1] = posX
                        garis[idx].position[3] = posY
                    }
                    garis[idx].middlePoint[0] = (garis[idx].position[0] + garis[idx].position[1]) / 2
                    garis[idx].middlePoint[1] = (garis[idx].position[2] + garis[idx].position[3]) / 2
                });
                drawCanvas()
                secondClickMove = false
                chosen = []
                isX1Change = false
                isX2Change = false
            }
        }
    }
}, false)

const radioButtons = document.querySelectorAll('input[name="shape"]');
for (const radioButton of radioButtons) {
    radioButton.addEventListener('change', function (e) {
        if (e.target.value == 'polygon') {
            document.getElementById('polygonSisi').disabled = false;
            document.getElementById('proporsiXRectangle').disabled = true;
            document.getElementById('proporsiYRectangle').disabled = true;
        }
        else if (e.target.value == 'rectangle') {
            document.getElementById('polygonSisi').disabled = true;
            document.getElementById('proporsiXRectangle').disabled = false;
            document.getElementById('proporsiYRectangle').disabled = false;
        }
        else if (e.target.value == 'line' | e.target.value == 'square') {
            document.getElementById('polygonSisi').disabled = true;
            document.getElementById('proporsiXRectangle').disabled = true;
            document.getElementById('proporsiYRectangle').disabled = true;
        }
    })
}

drawCanvas()