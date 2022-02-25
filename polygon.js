function createPolygon(gl, polygonArray) {
    const points = new Float32Array(polygonArray);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
}

function getMiddlePoint(arrPos) {
    let sumX = 0;
    let sumY = 0;
    let n = arrPos.length/2

    for (let i = 0; i < arrPos.length; i++) {
        if (i % 2 == 0) {
            sumX += arrPos[i]
        } else {
            sumY += arrPos[i]
        }
    }
    return [sumX/n, sumY/n]
}

function translasiPolygon(arrPos, posX, posY) {
    let middlePoint = getMiddlePoint(arrPos)
    let deltaX = posX - middlePoint[0]
    let deltaY = posY - middlePoint[1]

    for (let i = 0; i < arrPos.length; i++) {
        if (i % 2 == 0) {
            arrPos[i] = arrPos[i] + deltaX    
        } else {
            arrPos[i] = arrPos[i] + deltaY
        }
    }
}

/* orientation, onLine, checkIntersect, & checkInPolygon function was referenced & modified from 
https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon/#:~:text=1)%20Draw%20a%20horizontal%20line,true%2C%20then%20point%20lies%20outside.*/

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
    let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
    if (val == 0) {
        return 0;
    }
    return (val > 0) ? 1 : 2;
}

// Given three collinear points p, q, r,
// the function checks if point q lies
// on line 'pr'
function onLine(p,q,r) {
    return (q[0] <= Math.max(p[0], r[0]) && 
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) && 
    q[1] >= Math.min(p[1], r[1]))
}

function checkIntersect(p1, q1, p2, q2) {
    // Find the four orientations needed for
    // general and special cases
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);
  
    // General case
    if (o1 != o2 && o3 != o4) {
        return true;
    }
  
    // Special Cases
    // p1, q1 and p2 are collinear and
    // p2 lies on segment p1q1
    if (o1 == 0 && onLine(p1, p2, q1)) {
        return true;
    }
  
    // p1, q1 and p2 are collinear and
    // q2 lies on segment p1q1
    if (o2 == 0 && onLine(p1, q2, q1)) {
        return true;
    }
  
    // p2, q2 and p1 are collinear and
    // p1 lies on segment p2q2
    if (o3 == 0 && onLine(p2, p1, q2)) {
        return true;
    }
  
    // p2, q2 and q1 are collinear and
    // q1 lies on segment p2q2
    if (o4 == 0 && onLine(p2, q1, q2)) {
        return true;
    }
  
    // Doesn't fall in any of the above cases
    return false;
}

function checkInPolygon(arrPosObject, x, y) {
    var INF = canvas.width;
    // Count intersections of infinity line
    // with sides of polygon
    let count = 0, i = 0;
    do {
        let next = (i + 2) % arrPosObject.length;
      
        // Check if the line segment intersects with 
        // the line segment from polygon
        if (checkIntersect([arrPosObject[i],arrPosObject[i+1]], 
            [arrPosObject[next], arrPosObject[next+1]], 
            [x, y], 
            [INF, y])) {
                // If the point 'p' is collinear with line
                // segment 'i-next', then check if it lies
                // on segment. If it lies, return true, otherwise false
                if (orientation([arrPosObject[i],arrPosObject[i+1]], 
                    [x, y], 
                    [arrPosObject[next], arrPosObject[next+1]]) == 0) {
                    return onLine([arrPosObject[i],arrPosObject[i+1]], 
                        [x, y], 
                        [arrPosObject[next], arrPosObject[next+1]]);
                }      
                count++;
            }
        i = next;
    } while (i != 0);
      
    // Return true if count is odd, false otherwise
    return (count % 2 == 1); // Same as (count%2 == 1)
}    
