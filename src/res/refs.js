export const translationDefault = {
    "x-mode":"Bezier", // Bezier or Fixed
    "offset-x":40,
    "y-mode":"Fixed", // Bezier or Fixed
    "offset-y":0,
    "bezier-controls-x":{
        'start': {'x':0, 'y': 1},
        'cp1': {'x':0.25, 'y': 0.75},
        'cp2': {'x':0.75, 'y': 0.25},
        'end': {'x':1, 'y': 0}
    },
    "bezier-controls-y":{
        'start': {'x':0, 'y': 1},
        'cp1': {'x':0.25, 'y': 0.75},
        'cp2': {'x':0.75, 'y': 0.25},
        'end': {'x':1, 'y': 0}
    },
}

export const rotationDefault = {
    "angle-mode":"Fixed", // Bezier or Fixed
    "angle":20,
    "bezier-controls-angle":{
        'start': {'x':0, 'y': 1},
        'cp1': {'x':0.25, 'y': 0.75},
        'cp2': {'x':0.75, 'y': 0.25},
        'end': {'x':1, 'y': 0}
    },
    "origin": {
        zoom: 2,
        x: 0.5,
        y:0.5
    }
}

export const scaleDefault = {
    "scale-mode":"Bezier", // Bezier or Fixed
    "scale":120, // percents
    "bezier-controls-scale":{
        'start': {'x':0, 'y': 1},
        'cp1': {'x':0.12, 'y': 0.56},
        'cp2': {'x':0.45, 'y': 0.45},
        'end': {'x':1, 'y': 0}
    },
    "origin": {
        zoom: 1,
        x: 0.5,
        y:1
    }
  }

  export const opacityDefault = {
    "opacity-mode":"Bezier", // Bezier or Fixed
    "opacity":200, // percents
    "bezier-controls-opacity":{
        'start': {'x':0, 'y': 1},
        'cp1': {'x':0.12, 'y': 0.56},
        'cp2': {'x':0.45, 'y': 0.45},
        'end': {'x':1, 'y': 0}
    }
  }

export const flowDefault = {
    id: '',
    name: '',
    ops: [],
    repeat:5
  };

export const types=['Translation', 'Rotation', 'Scale', 'Opacity'];