function createPolygon(gl, polygonArray) {
    const points = new Float32Array(polygonArray);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
}