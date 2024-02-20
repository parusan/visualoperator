import {rotate, translate,isAffineMatrix} from 'transformation-matrix';

// Calculates the coordinate (X or Y depending on the weights) of a point in time on a Cubic Bézier curve
export function cubic(t, x0, x1, x2, x3) {
    return Math.pow(1 - t, 3) * x0 + 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x3;
}

export function toMatrixObject(figmaMatrix){
    let objectMatrix = {a:1, b:0, c:0, d:1, e:0, f:0}
    if(figmaMatrix.length === 2 && figmaMatrix[0].length===3 && figmaMatrix[1].length===3) {
        objectMatrix.a=figmaMatrix[0][0];
        objectMatrix.b=figmaMatrix[0][1];
        objectMatrix.e=figmaMatrix[0][2];
        objectMatrix.c=figmaMatrix[1][0];
        objectMatrix.d=figmaMatrix[1][1];
        objectMatrix.f=figmaMatrix[1][2];
    }
    return objectMatrix;
}

export function toFigmaMatrix(matrixObject){
    let figmaMatrix = [[1, 0, 0], [0, 1, 0]];
    if((typeof matrixObject.a !== 'undefined') && (typeof matrixObject.b !== 'undefined') && (typeof matrixObject.c !== 'undefined') && (typeof matrixObject.d !== 'undefined') && (typeof matrixObject.e !== 'undefined') && (typeof matrixObject.f !== 'undefined')) {
        figmaMatrix = [[matrixObject.a, matrixObject.b, matrixObject.e], [matrixObject.c, matrixObject.d, matrixObject.f]]
    }
    else {
        console.log('Impossible to convert object to Figma matrix');
    }
    return figmaMatrix;
}

// Returns a matrix with the position of the clones in the case of a bezier curve on the Y axis
// If XorY = 0: X, if 1: Y
export function getNormalizedBezier (XorY,controls,nbClones) {

    // We initialize time itself
    const time = 1; // Here we set up the time interval used for Bézier curve spacing
    const timeInterval = nbClones >1 ? 1/(nbClones-1) : 0;
    let t=0; // Time on the x axis

    // Variables used at each step to calculate the distances
    let bezier = 0; // Used to modulate the spacing according to the bezier curve
    let beziergap = 0; // Used to modulate the spacing according to the bezier curve
    let prevbezier = 0;

    let maxGap=0;

    let matrix = [];
    for(var i=0; i<nbClones; i++) {
            t = timeInterval*i; 
            if (XorY > 0) {
                bezier = cubic(t, 1-controls[0].y, 1-controls[1].y, 1-controls[2].y, 1-controls[3].y); // calculate the value between 0 and 1
            } else {
                bezier = cubic(t, controls[0].x, controls[1].x, controls[2].x, controls[3].x); // calculate the value between 0 and 1
            }
            beziergap = (bezier - prevbezier); // We take the normalized space since the last dot and apply to gap;
            if (beziergap>maxGap) maxGap = beziergap
            prevbezier = bezier;

            let translation = {
                time: t, // Time position
                gap: beziergap, // Distance 0-1 calculated from previous point
                normalizedGap: 0, // Distance calculated
            };
            matrix.push(translation);
    }
    for(var i=0; i<nbClones; i++) {
        matrix[i].normalizedGap = (maxGap > 0) ? matrix[i].gap/maxGap : 0;
    }
    return matrix;
}


// Calculates on 1 dimension the translations for a fixed spacing between 2 steps
export function getTranslationFixed (nbClones, spacingX, spacingY, dimensionX, dimensionY, includeSize) { // dimension is the size of the shape on that axis
    let tx=0;
    let ty=0;
    let translations=[];
    for(var i=0; i<nbClones; i++) {
        tx = (includeSize===0) ? (spacingX + dimensionX)*i : spacingX*i;
        ty = (includeSize===0) ? (spacingY + dimensionY)*i : spacingY*i;
        let matrix = translate(tx,ty);
        translations.push(matrix);
    }
    return translations;
}


// Returns a matrix with the position of the clones in the case of a bezier curve on the X axis
export function getTranslationBezier (controls,nbClones, spacingX, spacingY, width, height,includeSize) {

    let bezierMatrixX = getNormalizedBezier(0,controls,nbClones);
    let bezierMatrixY = getNormalizedBezier(1,controls,nbClones);
    let translations = [];
    let totalSoFarX = 0;
    let totalSoFarY = 0;
    for(var i=0; i<nbClones; i++) {
        // Calculations for X
        let stepSizeX = bezierMatrixX[i].normalizedGap*spacingX;
        let stepTranslationX = (includeSize===0) ? (stepSizeX + width) : stepSizeX;
        totalSoFarX = totalSoFarX + stepTranslationX;
        // Calculations for Y
        let stepSizeY = bezierMatrixY[i].normalizedGap*spacingY;
        let stepTranslationY = (includeSize===0) ? (stepSizeY + height) : stepSizeY;
        totalSoFarY = totalSoFarY + stepTranslationY;
        let matrix = translate(totalSoFarX,totalSoFarY);
        translations.push(matrix);
    }
    return translations;
}

// Calculating the rotation matrix
export function getFixedRotation (nbClonesX, angle, width, height, x, y, origin) {
    let matrix = [];
    // First we get the center of the object
    let cx = x - (origin.zoom-1)/2*width+origin.x*origin.zoom*width;
    let cy = y - (origin.zoom-1)/2*height+origin.y*origin.zoom*height;
        for(var j=0; j<nbClonesX; j++) {
            //switching to radians
            let newAngle = angle*j*(Math.PI/180);
            if(newAngle>360) newAngle= newAngle % 360; // Getting the remainder in case we are over 360 degrees
            // The rotation happens around the top left corner, so we translate the object. Here are the new coordinates
            let newx = Math.cos(newAngle) * x + y * Math.sin(newAngle) - cy * Math.sin(newAngle) - cx * Math.cos(newAngle) + cx
            let newy = - Math.sin(newAngle) * x + cx * Math.sin(newAngle) + y * Math.cos(newAngle) - cy * Math.cos(newAngle) + cy
            
            // let transform = [[Math.cos(newAngle), Math.sin(newAngle), newx],[-Math.sin(newAngle), Math.cos(newAngle), newy ]]
            let transform = {a:Math.cos(newAngle), b: Math.sin(newAngle), e:newx, c:-Math.sin(newAngle), d:Math.cos(newAngle),f: newy }
            matrix.push(transform);
        }
    return matrix;
}


// Returns a matrix with the angles based on the values of the control points
export function getBezierRotation (controls,nbClonesX, angle, width, height, x, y, origin) {
    // First we get the center of the object
    let cx = x - (origin.zoom-1)/2*width+origin.x*origin.zoom*width;
    let cy = y - (origin.zoom-1)/2*height+origin.y*origin.zoom*height;
    let nbSteps = nbClonesX > 0 ? nbClonesX : 1;
    let bezierMatrix = getNormalizedBezier(1,controls,nbSteps);
    let matrix = [];
    let angleSoFar = 0;
        for(var j=0; j<nbClonesX; j++) {
            let newAngle = bezierMatrix[j].normalizedGap*angle*(Math.PI/180);
            angleSoFar = angleSoFar + newAngle;
            // The rotation happens around the top left corner, so we translate the object. Here are the new coordinates
            let newx = Math.cos(angleSoFar) * x + y * Math.sin(angleSoFar) - cy * Math.sin(angleSoFar) - cx * Math.cos(angleSoFar) + cx
            let newy = - Math.sin(angleSoFar) * x + cx * Math.sin(angleSoFar) + y * Math.cos(angleSoFar) - cy * Math.cos(angleSoFar) + cy
            
            // let transform = [[Math.cos(angleSoFar), Math.sin(angleSoFar), newx],[-Math.sin(angleSoFar), Math.cos(angleSoFar), newy ]]
            let transform = {a:Math.cos(angleSoFar), b: Math.sin(angleSoFar), e:newx, c:-Math.sin(angleSoFar), d:Math.cos(angleSoFar),f: newy }
            matrix[j] = transform;
        }
    return matrix;
}

