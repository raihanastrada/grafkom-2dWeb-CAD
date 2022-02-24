var mouseXPos = 0
var mouseYPos = 0
var canvas = document.querySelector("#my-canvas");

var gl = canvas.getContext("webgl")
if (!gl) {
    console.log("Your browser not supported webgl, retry experimental-webgl")
    gl = canvas.getContext("experimental-webgl")
}

var positionBuffer = gl.createBuffer();

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
var program = createProgram(gl, vertexShader, fragmentShader)


var positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.8, 0.8, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(titik), gl.STATIC_DRAW);
 
// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer


gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)


// Ini karena masih hardcode, nantinya bakalan dari user
var persegiPanjang = [
    {
        position: [29, 586, 404, 555],
        color: [0.5, 0.5, 0.5],
        middlePoint: [0, 0],
    },
    {
        position: [426, 679, 105, 167],
        color: [1, 0, 0],
        middlePoint: [0, 0],
    },
];

var garis = [
    {
        position: [10, 100, 30, 200],
        color: [0.5, 0.5, 0.5],
        middlePoint: [0, 0],
    },
    {
        position: [20, 400, 100, 400],
        color: [1, 0, 0],
        middlePoint: [0, 0],
    },
];

for (let i = 0; i < persegiPanjang.length; i++) {
    var x1 = persegiPanjang[i].position[0]
    var x2 = persegiPanjang[i].position[1]
    var y1 = persegiPanjang[i].position[2]
    var y2 = persegiPanjang[i].position[3]
    var titikTengah = []
    titikTengah.push((x1 + x2)/2)
    titikTengah.push((y1 + y2)/2)
    persegiPanjang[i].middlePoint = titikTengah
}

function drawCanvas() {

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Bind the position buffer.
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    // var m = 0;
    for (var i = 0; i < garis.length; i++) {
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
    for (var j = 0; j < persegiPanjang.length; j++) {
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

drawCanvas()

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
        }
    }
}, false)

