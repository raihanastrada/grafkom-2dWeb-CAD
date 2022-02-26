// function createPersegiPanjang(gl, x1, x2, y1, y2) {

//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//         x1, y1,
//         x2, y1,
//         x1, y2,
//         x1, y2,
//         x2, y1,
//         x2, y2]), gl.STATIC_DRAW)
// }

function createPersegiPanjang(gl, x1, y1, x2, y2, x3, y3, x4, y4) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y2,
        x3, y3,
        x3, y3,
        x2, y2,
        x4, y4,
    ]), gl.STATIC_DRAW)
}

function checkInsidePersegiPanjang(arrPosObject, x, y) {
    if ((x >= arrPosObject[0] && x <= arrPosObject[2]) && (y >= arrPosObject[1] && y <= arrPosObject[5])) {
        return true
    }
}

function checkNearPersegiPanjang(arrPosObject, x, y) {
    var jarak2Titik = 0
    for (let i = 0; i < arrPosObject.length; i = i + 2) {
        jarak2Titik = Math.pow(x - arrPosObject[i], 2) + Math.pow(y - arrPosObject[i+1], 2)
        if (jarak2Titik <= 200) {
            return [true, i, i+1]
        }    
    }
     return [false, -1, -1]

}


function translasiPersegiPanjang(arrPos, arrMidPoint, deltaX, deltaY) {
    arrPos[0] = arrPos[0] + deltaX
    arrPos[2] = arrPos[2] + deltaX
    arrPos[4] = arrPos[4] + deltaX
    arrPos[6] = arrPos[6] + deltaX
    arrPos[1] = arrPos[1] + deltaY
    arrPos[3] = arrPos[3] + deltaY
    arrPos[5] = arrPos[5] + deltaY
    arrPos[7] = arrPos[7] + deltaY
    arrMidPoint[0] = (arrPos[0] + arrPos[2]) / 2
    arrMidPoint[1] = (arrPos[1] + arrPos[5]) / 2
    return [arrPos, arrMidPoint]
}

function changeColor(arrColor, r, g, b) {
    arrColor[0] = r
    arrColor[1] = g
    arrColor[2] = b
    return arrColor
}