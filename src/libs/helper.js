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
        't': matrix
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
        't': matrix
    }
    return result;
}

// ******************** ROTATIONS 
// ***********************************************


// Calculating the rotation matrix
export function getRotationFixed (params, nodeInfo, step) {

    // let angle=params.angle* step;
    let angle=params.angle*(Math.PI/180);
    let width = nodeInfo.width;
    let height= nodeInfo.height;
    let origin = params.origin;
    let result = {
        't': {},
        'r': {}
    }

    console.log('new angle', angle, 'step', step)
    result.r=rotate(angle);

    // We calculate the original position of the center

    // We define the original positions on x and y as =0 as we will combine the matrices with the original matrix that defines the object rotation and position
    let o = { 'x':nodeInfo.x, 'y':nodeInfo.y }
    // First we get the center of the object
    let c = { 
        'x' : o.x - (origin.zoom-1)/2*width+origin.x*origin.zoom*width,
        'y' : o.y - (origin.zoom-1)/2*height+origin.y*origin.zoom*height
    }
    let rorigin = rotate(-nodeInfo.angle, o.x, o.y)
    c = applyToPoint(rorigin, c);
    console.log(nodeInfo.angle)
    console.log('rotated center', c)
    let no = { // The new origin after rotation
        'x': (o.x-c.x)*Math.cos(angle) + (o.y-c.y)* Math.sin(angle) + c.x,
        'y': -(o.x-c.x)*Math.sin(angle) + (o.y-c.y)* Math.cos(angle) + c.y
    }
    // TODO: BETTER CALCULATE ORIGIN POSITION IF ALREADY ROTATED AT FIRST

    result.t=translate(no.x - o.x, no.y - o.y);


    // Then we apply the transformations

    return result;
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

// Returns a matrix with the angles based on the values of the control points
export function getRotationBezier (params, nodeInfo, step) {

    let angle = params.angle * params['curve-values'][step].normalizedTotal;
    let width = nodeInfo.width;
    let height= nodeInfo.height;
    let origin = params.origin;
 
    if(angle>360) angle = angle % 360; 
    console.log('new angle', angle, 'step', step)

    let prevAngle = decomposeTSR(nodeInfo.transform).rotation.angle;
    // We define the original positions on x and y as =0 as we will combine the matrices with the original matrix that defines the object rotation and position
    let o = {
        'x':0,
        'y':0
    }
    let c = {
        'x' : o.x - (origin.zoom-1)/2*width+origin.x*origin.zoom*width,
        'y' : o.y - (origin.zoom-1)/2*height+origin.y*origin.zoom*height
    }
    c = applyToPoint(rotate(prevAngle), c);

    let transform = rotateDEG(angle, c.x, c.y);

   return transform;
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
