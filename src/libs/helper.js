import {rotate, translate,isAffineMatrix, rotateDEG, applyToPoint, compose, decomposeTSR} from 'transformation-matrix';

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


// Calculates on 1 dimension the translations for a fixed spacing between 2 steps
export function getTranslationFixed (params, step) { // dimension is the size of the shape on that axis
    let offset=params.offset;
    let direction = params.direction;
    let tx=0;
    let ty=0;

    if (direction === 'Horizontal') tx=offset;
    if (direction === 'Vertical') ty=offset;

    let matrix = translate(tx,ty);
    let result = {
        't': matrix,
        'r': getIdentityMatrix()
    }
    return result;
}


export function getTranslationBezier (params,step) {
    let offset = params.offset;
    let direction = params.direction;
    let bzmatrix = params['curve-values'];
    let tx=0;
    let ty=0;
    if (direction === 'Horizontal') tx=offset*bzmatrix[step].normalizedGap;
    if (direction === 'Vertical') ty=offset*bzmatrix[step].normalizedGap;

    let matrix = translate(tx,ty);
    let result = {
        't': matrix,
        'r': getIdentityMatrix()
    }
    return result;
}

// ******************** ROTATIONS 
// ***********************************************

// Calculating the rotation matrix
export function getRotationFixed (params, nodeInfo, shift) {

    let angle=params.angle*(Math.PI/180);
    console.log('new angle', angle)
    return getRotation(angle, params, nodeInfo, shift);

}


// Returns a matrix with the angles based on the values of the control points
export function getRotationBezier (params, nodeInfo, step, shift) {

    let angle = params.angle * params['curve-values'][step].normalizedGap*(Math.PI/180);
    console.log('new angle', angle, 'step', step)
    return getRotation(angle, params, nodeInfo, shift);
}

// Calculating the rotation matrix
export function getRotation (angle, params, nodeInfo, shift) {
    console.log(shift);
    let width = nodeInfo.width;
    let height= nodeInfo.height;
    let origin = params.origin;
    let result = {
        't': {},
        'r': {}
    }
    result.r=rotate(angle);


    // We calculate the original position of the center
    let o = { 'x':nodeInfo.x, 'y':nodeInfo.y}
    let o2 = { 'x':nodeInfo.x+shift.x, 'y':nodeInfo.y+shift.y} // we include the shift due to scale

    // First we get the center of rotation of the object, accounting for a possible scaling
    let c2 = { 
        'x' : o2.x - (origin.zoom-1)/2*width*shift.s+origin.x*origin.zoom*width*shift.s,
        'y' : o2.y - (origin.zoom-1)/2*height*shift.s+origin.y*origin.zoom*height*shift.s
    }

    // We rotate the center around the origin as it is how the Transform matrix is stored in Figma
    // We use here the original object rotation, not the one we want to apply now
    let rorigin = rotate(-nodeInfo.angle, o.x, o.y)
    c2 = applyToPoint(rorigin, c2);
    console.log(nodeInfo.angle);

    // We also rotate the origin of the scaled up version (if any) 
    let o2r = applyToPoint(rorigin, o2);

    // And calculate the new position of the origin of the rotated scaled object
    // We apply here the new rotation for that step
    // Note: we dont account for the translation between non scaled and scaled object as it is covered in the original scale transformation
    let no = { // The distance to the new center
        'x': (o2r.x-c2.x)*Math.cos(angle) + (o2r.y-c2.y)* Math.sin(angle) + c2.x,
        'y': -(o2r.x-c2.x)*Math.sin(angle) + (o2r.y-c2.y)* Math.cos(angle) + c2.y
    }
    // TODO: BETTER CALCULATE ORIGIN POSITION IF ALREADY ROTATED AT FIRST
    // Finally we get the distance between the original position of the scaled up origin and the rotated version with the new angle
    result.t=translate(no.x - o2.x, no.y - o2.y); // Usually the difference between the initial origin and the new one

    return result;
}





// ******************** SCALE 
// ***********************************************


// Calculating the rotation matrix
export function getScaleFixed (params, nodeInfo) {

    let scale = params.scale/100;
    console.log('Scaling by', scale)
    return getScale(scale, params, nodeInfo);
}


// Returns a matrix with the angles based on the values of the control points
export function getScaleBezier (params, nodeInfo, step) {

    let scale = 1 + ((params.scale - 100) / 100 * params['curve-values'][step].normalizedGap);
    console.log('step scale', scale, 'step', step)
    return getScale(scale, params, nodeInfo);

}

export function getScale (scale, params, nodeInfo) {
    let result={
        'translation': {},
        'scale': 1
    };

    result.scale = scale;

    // Then we calculate the necessary translation
    let tx=0;
    let ty=0;
    console.log(params.origin)
    tx=nodeInfo.width*(1-scale)*params.origin.x;
    ty=nodeInfo.height*(1-scale)*params.origin.y;
    let matrix = translate(tx,ty);
    result.translation = matrix;

    console.log('scale', result)

    return result;
}

// ******************** OPACITY 
// ***********************************************


// Calculating the opacity matrix for this step
export function getOpacityFixed (params, step) {
    let alpha = Math.pow((params.opacity)/100,step);
    return alpha;
}


// Returns a matrix with the angles based on the values of the control points
export function getOpacityBezier (params, step) {
    let alpha  = 1;
    for (let i = 0; i<step; i++){

        alpha = alpha * (1 + (params.opacity / 100 - 1) * params['curve-values'][i].normalizedGap);
        console.log(i, alpha);
    }
    console.log(alpha)
    return alpha;
}



// Returns a matrix with the position of the clones in the case of a bezier curve on the Y axis
// We always use the Y value of the curve
export function getNormalizedBezier (controls,nbClones) {

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

            bezier = cubic(t, 1-controls.start.y, 1-controls.cp1.y, 1-controls.cp2.y, 1-controls.end.y); // calculate the value between 0 and 1

            beziergap = (bezier - prevbezier); // We take the normalized space since the last dot and apply to gap;
            if (beziergap>maxGap) maxGap = beziergap
            prevbezier = bezier;

            let translation = {
                time: t, // Time position
                gap: beziergap, // Distance 0-1 calculated from previous point
                normalizedGap: 0, // Distance calculated
                total: bezier, // Total
                normalizedGap: 0,
                normalizedTotal: 0
            };
            matrix.push(translation);
    }
    let normTotal = 0;
    for(var i=0; i<nbClones; i++) {
        matrix[i].normalizedGap = (maxGap > 0) ? matrix[i].gap/maxGap : 0;
        normTotal = normTotal + matrix[i].normalizedGap;
        matrix[i].normalizedTotal = normTotal;
    }
    return matrix;
}

export function getIdentityMatrix () {
        let matrix = {
            a: 1, c: 0, e: 0,
            b: 0, d: 1, f: 0
            };
    return matrix;
    
}

export function testCombine (){

    // !!!! The first operation must best last in the chain (from last to first in compose)
    // If Rotate > Translate, then it will be translated and rotated around the original position
    let o={
        'x': 40, 'y': 20
    }
    let c={
        'x': 60, 'y': 40
    }
    let c2={
        'x': 60, 'y': 200
    }

    // Original translate
    let ot = translate(o.x, o.y);

    // Simulated rotations angles
    let a = 20*(Math.PI/180);
    let b = 10*(Math.PI/180);

    // Rotate
    let r = rotate(a);
    let r2 = rotate(b);

    // Calculates the new position of the center after rotation
    let no={
        'x': (o.x-c.x)*Math.cos(a) + (o.y-c.y)* Math.sin(a) + c.x,
        'y': -(o.x-c.x)*Math.sin(a) + (o.y-c.y)* Math.cos(a) + c.y
    }

    let no2={
        'x': (o.x-c2.x)*Math.cos(b) + (o.y-c2.y)* Math.sin(b) + c2.x,
        'y': -(o.x-c2.x)*Math.sin(b) + (o.y-c2.y)* Math.cos(b) + c2.y
    }   
    console.log('no', no)
    console.log('no', no2)

    // We calculate the translation necessary to adjust the position of the object
    // It will be combined with the original translation of the object, so no need to use the full value
   let mto2 = translate(no2.x-o.x, no2.y-o.y);

    let tr = compose(mto2, r2)

    // Combine, from Right to Left (in this case: rotation - translation - translation)
   let mr = compose(ot, tr, rr);
   console.log(mr)
   return mr;
}
