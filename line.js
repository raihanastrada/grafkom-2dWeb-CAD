function createGaris(gl, x1, x2, y1, y2) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y2,]), gl.STATIC_DRAW)
}

function checkNearGaris(arrPosObject, x, y) {
    var maxX = Math.max(arrPosObject[0], arrPosObject[1])
    var minX = Math.min(arrPosObject[0], arrPosObject[1])
    var maxY = Math.max(arrPosObject[2], arrPosObject[3])
    var minY = Math.min(arrPosObject[2], arrPosObject[3])
    if ((x >= minX-35 && x <= maxX+35) && (y >= minY-35 && y <= maxY+35)) {
        return true
    }
}

function translasiGaris(arrPos, arrMidPoint, deltaX, deltaY) {
    arrPos[0] = arrPos[0] + deltaX
    arrPos[1] = arrPos[1] + deltaX
    arrPos[2] = arrPos[2] + deltaY
    arrPos[3] = arrPos[3] + deltaY
    arrMidPoint[0] = (arrPos[0] + arrPos[1]) / 2
    arrMidPoint[1] = (arrPos[2] + arrPos[3]) / 2
    return [arrPos, arrMidPoint]
}

function checkJarak(arrPosObject, x, y) {
    let jarakX1Y1 = Math.pow(x - arrPosObject[0], 2) + Math.pow(y - arrPosObject[2], 2)
    let jarakX2Y2 = Math.pow(x - arrPosObject[1], 2) + Math.pow(y - arrPosObject[3], 2)
    if (Math.min(jarakX1Y1, jarakX2Y2) == jarakX1Y1) {
        return true
    }
}