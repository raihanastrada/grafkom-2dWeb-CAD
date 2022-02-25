var mouseXPos = 0
var mouseYPos = 0
var canvas = document.querySelector("#my-canvas");

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

var persegiPanjang = []
var garis = []
var polygon = []

/**
 * Function to render drawing
 */
function drawCanvas() {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
        
    // Set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    if (garis.length != 0) {
        // Draw Line
        console.log(garis)
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
    for (let j = 0; j < persegiPanjang.length; j++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var x1 = persegiPanjang[j].position[0]
        var x2 = persegiPanjang[j].position[1]
        var y1 = persegiPanjang[j].position[2]
        var y2 = persegiPanjang[j].position[3]
        var r = persegiPanjang[j].color[0]
        var g = persegiPanjang[j].color[1]
        var b = persegiPanjang[j].color[2]
        
        createPersegiPanjang(gl, x1, x2, y1, y2)
        gl.uniform4f(colorUniformLocation, r, g, b, 1);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
    
}

// Fungsionalitas Geser Persegi Panjang
var secondClickMove = false
var chosen = []

canvas.addEventListener("click",function(event) {
    var isWantToMove = false
    var isWantToCreate = false
    var isWantToChangeColor = false
    var isWantToChangeSize = false
    
    var shape = getShape()
    var color = getColor()
    var option = getOption()
    var size = getShapeSize()
    var color = getColor()

    var jumlahSisiPolygon = 0

    console.log("Ini shape: ", shape)
    console.log("Ini color: ", color)
    console.log("Option: ", option)

    if (option === "create") {
        isWantToCreate = true
    } else if (option === "move") {
        isWantToMove = true
        
    } else if (option === "changeColor") {
        isWantToChangeColor = true
    } else if (option === "changeSize") {
        isWantToChangeSize = true
    }

    if (isWantToCreate) {
        console.log('create')
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
            
            persegiPanjang.push({
                position: [x1, x2, y1, y2],
                color: [color[0], color[1], color[2]],
                middlePoint: [midPointX, midPointY]
            })
            console.log(persegiPanjang) 
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
            console.log("INSERT TO ARRAY OF POLYGON OBJECT")
        }

    }

    if (isWantToMove) {
        if (shape === "rectangle" || shape === "square") {
            if (!secondClickMove) {
                // The first click, check if user click inside a rectangle
                var posX = event.pageX
                var posY = event.pageY
                for (let i = 0; i < persegiPanjang.length; i++) {
                    if (checkInsidePersegiPanjang(persegiPanjang[i].position, posX, posY)) {
                        chosen.push(i)
                        secondClickMove = true
                    }
                }
                
            } else {
                // Second Click, move the rectangular
                var posX = event.pageX
                var posY = event.pageY
                chosen.forEach(idx => {
                    var deltaX = posX - persegiPanjang[idx].middlePoint[0]
                    var deltaY = posY - persegiPanjang[idx].middlePoint[1]
                    var temp = translasiPersegiPanjang(persegiPanjang[idx].position, persegiPanjang[idx].middlePoint, deltaX, deltaY)
                    persegiPanjang[idx].position = temp[0]
                    persegiPanjang[idx].middlePoint = temp[1]
                });
                drawCanvas()
                secondClickMove = false
                chosen = []
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
        }

    }

    if (isWantToChangeColor) {
        if (shape === "rectangle" || shape === "square") {
            // Change Color for chosen rectangle or square
            var posX = event.pageX
            var posY = event.pageY
            for (let i = 0; i < persegiPanjang.length; i++) {
                if (checkInsidePersegiPanjang(persegiPanjang[i].position, posX, posY)) {
                    chosen.push(i)
                    persegiPanjang[i].color =  changeColor(persegiPanjang[i].color, color[0], color[1], color[2])
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
        }
    }

    if (isWantToChangeSize) {
        if (shape === "square") {
            // Change Color for chosen rectangle or square
            var posX = event.pageX
            var posY = event.pageY
            for (let i = 0; i < persegiPanjang.length; i++) {
                if (checkInsidePersegiPanjang(persegiPanjang[i].position, posX, posY)) {
                    chosen.push(i)
                    proporsiX = 10
                    proporsiY = 10
                    persegiPanjang[i].position[0] = persegiPanjang[i].position[0] - (size * proporsiX)
                    persegiPanjang[i].position[1] = persegiPanjang[i].position[1] + (size * proporsiX)
                    persegiPanjang[i].position[2] = persegiPanjang[i].position[2] - (size * proporsiY)
                    persegiPanjang[i].position[3] = persegiPanjang[i].position[3] + (size * proporsiY)
                    persegiPanjang[i].middlePoint[0] = (persegiPanjang[i].position[0] + persegiPanjang[i].position[1]) / 2
                    persegiPanjang[i].middlePoint[1] = (persegiPanjang[i].position[2] + persegiPanjang[i].position[3]) / 2
                }
            }
            drawCanvas()
        } else if (shape === "line") {
            if (!secondClickMove) {
                let x1 = false
                let x2 = false
                var posX = event.pageX
                var posY = event.pageY
                for (let i = 0; i < garis.length; i++) {
                    if (checkNearGaris(garis[i].position, posX, posY)) {
                        chosen.push(i)
                        secondClickMove = true
                        if(checkJarak(garis[i].position, posX)) {
                            x1 = true
                        } else { x2 = true }
                    }
                }
            } else { //secondClickMove = true
                var posX = event.pageX
                var posY = event.pageY
                chosen.forEach(idx => {
                    if (x1) { //x1 true
                        garis[idx].position[0] = posX
                        garis[idx].position[2] = posY
                    } else { //x2 true
                        garis[idx].position[1] = posX
                        garis[idx].position[3] = posY
                    }
                });
                drawCanvas()
                secondClickMove = false
                chosen = []
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