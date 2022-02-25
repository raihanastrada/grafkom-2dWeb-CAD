function createGaris(gl, x1, x2, y1, y2) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y2,]), gl.STATIC_DRAW)
}

function checkNearGaris(arrPosObject, x, y) {
    if ((x >= arrPosObject[0]-10 && x <= arrPosObject[1]+10) && (y >= arrPosObject[2]-10 && y <= arrPosObject[3]+10)) {
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

function checkJarak(arrPosObject, x) {
    let jarakX1 = Math.abs(x - arrPosObject[0])
    let jarakX2 = Math.abs(x - arrPosObject[1])
    if (Math.min(jarakX1, jarakX2) == jarakX1) {
        return true
    }
}