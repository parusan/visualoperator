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

export const flowDefault = {
    id: '',
    name: '',
    ops: [],
    repeat:5
  };

export const types=['Translation', 'Rotation'];