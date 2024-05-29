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

export function getTranslationMatrices (settings, repeat) {

    console.log('settings', settings)

    let translations = [];
    let matricesX = [];
    let matricesY = [];
    if (settings.params['x-mode']==='Fixed') matricesX = [...getTranslationFixed(repeat, settings.params['offset-x'])];
    if (settings.params['x-mode']==='Bezier') matricesX = [...getTranslationBezier(settings.params['bezier-controls-x'],repeat, settings.params['offset-x'])];
    if (settings.params['y-mode']==='Fixed') matricesY = [...getTranslationFixed(repeat, settings.params['offset-y'])];
    if (settings.params['y-mode']==='Bezier') matricesY = [...getTranslationBezier(settings.params['bezier-controls-y'],repeat, settings.params['offset-y'])];

    let tx=0;
    let ty=0;
    for (let i=0; i<repeat; i++){
        tx=matricesX[i];
        ty=matricesY[i];
        let matrix = translate(tx,ty);
        translations.push(matrix);
    }

    return translations;
    
}



// Calculates on 1 dimension the translations for a fixed spacing between 2 steps
export function getTranslationFixed (repeat, offset) { // dimension is the size of the shape on that axis
    let tx=0;
    let translations=[];
    for(var i=0; i<repeat; i++) {
        tx = offset*i;
        translations.push(tx);
    }
    return translations;
}


export function getTranslationBezier (controls,repeat, offset) {

    let bezierMatrix = getNormalizedBezier(controls,repeat);
    console.log('bezier matrix', bezierMatrix)
    let translations = [];
    let totalSoFar = 0;
    for(var i=0; i<repeat; i++) {
        // Calculations for the spacing
        let stepSize = bezierMatrix[i].normalizedGap*offset;
        let stepTranslation = stepSize;
        totalSoFar = totalSoFar + stepTranslation;
        translations.push(totalSoFar)
    }
    return translations;
}

// ******************** ROTATIONS 
// ***********************************************

export function getRotationMatrices (settings, repeat, nodeInfo) {
    let rotations = [];
    if (settings.params['angle-mode']==='Fixed') rotations = [...getFixedRotation(repeat, settings.params.angle, nodeInfo.width, nodeInfo.height, settings.params.origin)];
    if (settings.params['angle-mode']==='Bezier') rotations = [...getBezierRotation(settings.params['bezier-controls-angle'], repeat, settings.params.angle, nodeInfo.width, nodeInfo.height, settings.params.origin)];
    console.log('rotations',rotations)
    return rotations;
}

// Calculating the rotation matrix
export function getFixedRotation (repeat, angle, width, height, origin) {
    let matrix = [];
    let x=0; // We define the original positions on x and y as =0 as we will combine the matrices with the original matrix that defines the object rotation and position
    let y=0;
    console.log('origin', origin)
    // First we get the center of the object
    let cx = x - (origin.zoom-1)/2*width+origin.x*origin.zoom*width;
    let cy = y - (origin.zoom-1)/2*height+origin.y*origin.zoom*height;
        for(var j=0; j<repeat; j++) {
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
export function getBezierRotation (controls,repeat, angle, width, height, origin) {
    let x=0; // We define the original positions on x and y as =0 as we will combine the matrices with the original matrix that defines the object rotation and position
    let y=0;

    // First we get the center of the object
    let cx = x - (origin.zoom-1)/2*width+origin.x*origin.zoom*width;
    let cy = y - (origin.zoom-1)/2*height+origin.y*origin.zoom*height;
    let nbSteps = repeat > 0 ? repeat : 1;
    let bezierMatrix = getNormalizedBezier(controls,nbSteps);
    let matrix = [];
    let angleSoFar = 0;
        for(var j=0; j<repeat; j++) {
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



// ******************** SCALE 
// ***********************************************

export function getScaleMatrices (settings, repeat, nodeInfo) {
    if (settings.params['scale-mode']==='Fixed') {
        return getFixedScale(repeat, settings, nodeInfo);
    }
    if (settings.params['scale-mode']==='Bezier') {
         return getBezierScale(settings.params['bezier-controls-scale'], repeat, settings, nodeInfo);
        }
}

// Calculating the rotation matrix
export function getFixedScale (repeat, settings, nodeInfo) {
    let result={
        'translations':[],
        'scale':[]
    };
    // Init the first step
    let sc = settings.params.scale/100;
    let newScale = 1;
    result.scale.push(newScale);

    let tx=0;
    let ty=0;
    let matrix = translate(tx,ty);
    result.translations.push(matrix);

    for(var i=0; i<repeat-1; i++) {

        // First we generate the scales
        newScale = newScale * sc;
        result.scale.push(newScale);

        // We translate to adapt to the origin

        // FOR NOW: MOVE TO THE CENTER

        tx=nodeInfo.width*(1-newScale)*settings.params.origin.x;
        ty=nodeInfo.height*(1-newScale)*settings.params.origin.y;
        let matrix = translate(tx,ty);
        result.translations.push(matrix);
    }
    return result;
}


// Returns a matrix with the angles based on the values of the control points
export function getBezierScale (controls,repeat, settings, nodeInfo) {
    let result={
        'translations':[],
        'scale':[]
    };
    let sc = settings.params.scale/100 - 1;
    let bezierMatrix = getNormalizedBezier(controls,repeat);

    let totalSoFar = sc;

    let tx=0;
    let ty=0;
    let matrix = translate(tx,ty);

    for(var i=0; i<repeat; i++) {
        // Calculations for the spacing
        let stepSize = bezierMatrix[i].normalizedGap;
        totalSoFar = totalSoFar + stepSize*sc;
        result.scale.push(1+totalSoFar);

        tx=nodeInfo.width*(1-(1+totalSoFar))*settings.params.origin.x;
        ty=nodeInfo.height*(1-(1+totalSoFar))*settings.params.origin.y;

        let matrix = translate(tx,ty);
        result.translations.push(matrix);
    }
    return result;

}



// ******************** OPACITY 
// ***********************************************

export function getOpacityMatrices (settings, repeat, nodeInfo) {
    if (settings.params['opacity-mode']==='Fixed') {
        return getFixedOpacity(repeat, settings);
    }
    if (settings.params['opacity-mode']==='Bezier') {
         return getBezierOpacity(settings.params['bezier-controls-opacity'], repeat, settings, nodeInfo);
        }
}

// Calculating the opacity matrix for this step
export function getFixedOpacity (repeat, settings) {
    let matrix=[];
    // Init the first step
    let sc = settings.params.opacity/100;

    for(var i=0; i<repeat; i++) {
        matrix.push(sc);
    }
    return matrix;
}


// Returns a matrix with the angles based on the values of the control points
export function getBezierOpacity (controls,repeat, settings, nodeInfo) {
    let matrix=[];

    let val = settings.params.opacity/100 - 1;
    let bezierMatrix = getNormalizedBezier(controls,repeat);

    for(var i=0; i<repeat; i++) {
        // Calculations for the opacity
        let stepSize = bezierMatrix[i].normalizedGap * val;
        matrix.push(1+stepSize);
    }
    console.log(matrix);
    return matrix;
}

// Returns a matrix with the angles based on the values of the control points
// export function getBezierOpacity (controls,repeat, settings, nodeInfo) {
//     let matrix=[];

//     let val = settings.params.opacity/100 - 1;
//     let bezierMatrix = getNormalizedBezier(controls,repeat);
//     console.log(bezierMatrix);
//     let totalSoFar = val;


//     for(var i=0; i<repeat; i++) {
//         // Calculations for the spacing
//         let stepSize = bezierMatrix[i].normalizedGap;
//         totalSoFar = totalSoFar + stepSize*val;
//         console.log(totalSoFar)
//         matrix.push(1+totalSoFar);
//     }
//     return matrix;

// }




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
            };
            matrix.push(translation);
    }
    for(var i=0; i<nbClones; i++) {
        matrix[i].normalizedGap = (maxGap > 0) ? matrix[i].gap/maxGap : 0;
    }
    return matrix;
}

export function getIdentityMatrices (repeat) {
    let matrices = [];
    for (let i =0; i< repeat; i++){
        let matrix = {
            a: 1, c: 0, e: 0,
            b: 0, d: 1, f: 0
            };
            matrices.push(matrix);
        }
    return matrices;
    
}
