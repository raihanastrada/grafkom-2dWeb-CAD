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
gl.bufferData(gl.ARRAY_BUFFER, 8 * 20000, gl.STATIC_DRAW);
 
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
        position: [586, 29, 404, 555],
        color: [0.5, 0.5, 0.5],
        middlePoint: [0, 0],
    },
    {
        position: [679, 426, 105, 167],
        color: [1, 0, 0],
        middlePoint: [0, 0],
    },

]

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
    var m = 0;
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

var isWantToMove = true
var secondClick = false
var chosen = []

canvas.addEventListener("click",function(event) {
    if (isWantToMove) {
        if (!secondClick) {
            // The first click, check if user click inside a rectangle
            var posX = event.pageX
            var posY = event.pageY
            for (let i = 0; i < persegiPanjang.length; i++) {
                if (checkInsidePersegiPanjang(persegiPanjang[i].position, posX, posY)) {
                    chosen.push(i)
                    secondClick = true
                }
            }
            
        } else {
            // Second Click, move the rectangular
            var posX = event.pageX
            var posY = event.pageY
            chosen.forEach(idx => {
                var deltaX = posX - persegiPanjang[idx].middlePoint[0]
                var deltaY = posY - persegiPanjang[idx].middlePoint[1]
                persegiPanjang[idx].position, persegiPanjang[idx].middlePoint = translasiPersegiPanjang(persegiPanjang[idx].position, persegiPanjang[idx].middlePoint, deltaX, deltaY)
            });
            drawCanvas()
            secondClick = false
            chosen = []
        }
    }
}, false)

