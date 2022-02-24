function createPersegiPanjang(gl, x1, x2, y1, y2) {

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2]), gl.STATIC_DRAW)
}

function checkInsidePersegiPanjang(arrPosObject, x, y) {
    if ((x >= arrPosObject[0] && x <= arrPosObject[1]) && (y >= arrPosObject[2] && y <= arrPosObject[3])) {
        return true
    }
}

function translasiPersegiPanjang(arrPos, arrMidPoint, deltaX, deltaY) {
    arrPos[0] = arrPos[0] + deltaX
    arrPos[1] = arrPos[1] + deltaX
    arrPos[2] = arrPos[2] + deltaY
    arrPos[3] = arrPos[3] + deltaY
    arrMidPoint[0] = (arrPos[0] + arrPos[1]) / 2
    arrMidPoint[1] = (arrPos[2] + arrPos[3]) / 2
    return [arrPos, arrMidPoint]
}

function changeColor(arrColor, r, g, b) {
    arrColor[0] = r
    arrColor[1] = g
    arrColor[2] = b
    return arrColor
}