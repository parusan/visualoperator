export const translationDefault = {
    "offset-x-type":"Bezier", // Bezier or Fixed
    "offset-x":100,
    "offset-y-type":"Fixed", // Bezier or Fixed
    "offset-y":0,
    "bezier-controls-x":[{name:"start", x: 0, y: 1},{ name:"cp1", x: 0.25, y: 0.75},{name:"cp2", x: 0.75, y: 0.25},{name:"end", x: 1, y: 0}],
    "bezier-controls-y":[{name:"start", x: 0, y: 1},{ name:"cp1", x: 0.25, y: 0.75},{name:"cp2", x: 0.75, y: 0.25},{name:"end", x: 1, y: 0}],
}

export const rotationDefault = {
    "offset-x-type":"Bezier", // Bezier or Fixed
    "angle":100,
    "bezier-controls":[{name:"start", x: 0, y: 1},{ name:"cp1", x: 0.25, y: 0.75},{name:"cp2", x: 0.75, y: 0.25},{name:"end", x: 1, y: 0}],
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