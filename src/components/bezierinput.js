// Tests webcomponents

const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
  .beziercanvas {
    background: var(--figma-color-bg-secondary);
    border-radius: 4px;
  }
  :host {
    padding: 8px;
    display: block;
  }
  #dragarea {
    position: relative;
    overflow: hidden;
  }
  .control {
    position: absolute;
    border-radius: 50%;
    background: #FFF;
    cursor: grab;
  }
  .control.draggable {
    background: var(--figma-color-bg-brand);
    box-shadow: var(--elevation-500-modal-window, 0px 2px 14px rgba(0, 0, 0, .15), 0px 0px 0px .5px rgba(0, 0, 0, .2));

  }
  .control.dragging:hover {
    cursor: grabbing !important;
  }
  </style>
  <div id="dragarea">
   <canvas class="beziercanvas" id="innercanvas" height="0" width="0"></canvas>
  </div>
`; 

class BezierInput extends HTMLElement {
  static get observedAttributes() {return ['parent']; }
  
    constructor() {
      super();
      this.componentId='';
      this.parent='default'
      this.type='default';
      this.height = 0;
      this.width = 0;
      // drag related variables
      this.dragok = false;
      this.startX=0;
      this.startY=0;

      // Define the points as {x, y}
      // Also default controls // 
      this.controlsValue = {
        'start': {'x':0, 'y': 1},
        'cp1': {'x':0.25, 'y': 0.75},
        'cp2': {'x':0.75, 'y': 0.25},
        'end': {'x':1, 'y': 0} }
      this.start = { x: 0, y: 1, r: 5, fill: "#FFF", isDragging: false, restricted: true };
      this.cp1 = { x: 0.25, y: 0.75, r: 5, fill: "#0c8ce9", isDragging: false, restricted: false };
      this.cp2 = { x: 0.75, y: 0.25, r: 5, fill: "#0c8ce9", isDragging: false, restricted: false };
      this.end = { x: 1, y: 0, r: 5, fill: "#FFF", isDragging: false, restricted: true};

      this.controls = [this.start, this.cp1, this.cp2, this.end];
      this.controlsElements =[];
     // Attach a shadow root to <bezier-input>.
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowCanvas = shadowRoot.querySelector("#innercanvas");
      this.ctx = this.shadowCanvas.getContext("2d");
      this.dragArea = shadowRoot.querySelector("#dragarea");
  }

  set _controlsValue(controls){
    if (controls.start.x>=0 && controls.start.y>=0 && controls.cp1.x>=0 && controls.cp1.y>=0 && controls.cp2.x>=0 && controls.cp2.y>=0 && controls.end.x>=0 && controls.end.y>=0) {
      this.updateControls(controls);
    }
    else {
      console.log("wrong values for new controls")
    }
  }

  get _controlsValue(){
    return this.controls;
  }  

  connectedCallback(){ // Called when inserted into DOM
    // Initialization of the attributes
    this.setHeight(this.getAttribute('height'));
    this.setWidth(this.getAttribute('width'));
    this.componentId=this.getAttribute('id');
    this.type=this.getAttribute('role');

    // We initialize the DOM with the controls
    for (let i=0; i<this.controls.length; i++) {
      // We draw the controls in the DOM
      let thisId =  'control-' + i;
      // if the element doesn't exist yet, we add it
      const optionTemplate = document.createElement('template');
      let isDraggable = this.controls[i].restricted ? '' : 'draggable';
      optionTemplate.innerHTML = `<div class="control ${isDraggable}" id="${thisId}"></div>`;
      this.dragArea.append(...optionTemplate.content.children);
      this.controlsElements.push(this.shadowRoot.querySelector('#'+thisId));
      // And then we update its coordinates
      let ctrlX = this.controls[i].x*this.width-this.controls[i].r;
      let ctrlY = this.controls[i].y*this.height-this.controls[i].r;
      let radius = this.controls[i].r*2;
      this.controlsElements[i].setAttribute('style', `width: ${radius}; height: ${radius}; left: ${ctrlX};top: ${ctrlY}`)    
    }

    this.draw();

    // listen for mouse events
    this.dragArea.onmousedown = (e) => this.myDown(e, this.controls) ;
    this.dragArea.onmouseup = (e) => this.myUp(e, this.controls) ;
    this.dragArea.onmousemove = (e) => this.myMove(e, this.controls) ;
    this.dragArea.onmouseleave = (e) => this.myMoveOut(e, this.controls) ;
}

attributeChangedCallback(name, oldValue, newValue) {
  if(name==='parent') { this.setParent(newValue);}
}

  updateControls (controls){
    this.controlsValue = {...controls};
    this.controls[0].x=controls.start.x;
    this.controls[0].y=controls.start.y;
    this.controls[1].x=controls.cp1.x;
    this.controls[1].y=controls.cp1.y;
    this.controls[2].x=controls.cp2.x;
    this.controls[2].y=controls.cp2.y;
    this.controls[3].x=controls.end.x;
    this.controls[3].y=controls.end.y;

    // We update the controls in the DOM
    for (let i=0; i<this.controls.length; i++) {
      let ctrlX = this.controls[i].x*this.width-this.controls[i].r;
      let ctrlY = this.controls[i].y*this.height-this.controls[i].r;
      let radius = this.controls[i].r*2;
      this.controlsElements[i].setAttribute('style', `width: ${radius}; height: ${radius}; left: ${ctrlX};top: ${ctrlY}`)    
    }
    
    this.draw();
  }

  setParent(val) {
    // We initialize the selection value the first time we set the parent of the component
      this.parent=val;
  }

    // clear the canvas
    clear() { this.ctx.clearRect(0, 0, this.width, this.height); }

      // redraw the scene
    draw() {
      this.clear();
      // diagonal
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "#0000004d";
      this.ctx.beginPath();  
      this.ctx.moveTo(this.start.x*this.width, this.start.y*this.height);
      this.ctx.lineTo(this.end.x*this.width, this.end.y*this.height);
      this.ctx.stroke();
      // Line from start to CP1
      this.ctx.strokeStyle = "#ffffffb2";
      this.ctx.beginPath();  this.ctx.moveTo(this.start.x*this.width, this.start.y*this.height);
      this.ctx.lineTo(this.cp1.x*this.width, this.cp1.y*this.height); this.ctx.stroke();
      // Line from end to CP2
      this.ctx.strokeStyle = "#ffffffb2";
      this.ctx.beginPath();  this.ctx.moveTo(this.end.x*this.width, this.end.y*this.height);
      this.ctx.lineTo(this.cp2.x*this.width, this.cp2.y*this.height); this.ctx.stroke();
      // Cubic Bézier curve
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#b3b3b3";
      this.ctx.beginPath();  
      this.ctx.moveTo(this.start.x*this.width, this.start.y*this.height);
      this.ctx.bezierCurveTo(this.cp1.x*this.width, this.cp1.y*this.height, this.cp2.x*this.width, this.cp2.y*this.height, this.end.x*this.width, this.end.y*this.height);
      this.ctx.stroke();
        // redraw each shape in the shapes[] array
      let thisId = ''
      let control = '';
      for (let i=0; i<this.controls.length; i++) {
        // We draw the controls in the DOM
        this.controlsElements[i].setAttribute('style', `width: ${this.controls[i].r*2}; height: ${this.controls[i].r*2}; left: ${this.controls[i].x*this.width-this.controls[i].r};top: ${this.controls[i].y*this.height-this.controls[i].r}`)    
      }
    }


    setHeight(val) {
      this.height = val; 
       this.shadowCanvas.setAttribute('height', val);
    }
    setWidth(val) {
      this.width = val;
      this.shadowCanvas.setAttribute('width', val);
      }


    register(controls){
      let newControls = {
        'start': {
          'x': this.controls[0].x,
          'y': this.controls[0].y
        },
        'cp1': {
          'x': this.controls[1].x,
          'y': this.controls[1].y
        },
        'cp2': {
          'x': this.controls[2].x,
          'y': this.controls[2].y
        },
        'end': {
          'x': this.controls[3].x,
          'y': this.controls[3].y
        }
      }
      this.shadowRoot.dispatchEvent(new CustomEvent("update-param", {
      detail: { data: newControls, "data-label":'bezier-controls', target: this.parent, param:this.type  },
      composed: true,
      bubbles: true
  }));
    }


  // handle mousedown events
  myDown(e, controls) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    const mx = parseInt(e.clientX);
    const my = parseInt(e.clientY);
    // test each shape to see if mouse is inside
    this.dragok = false;
    for (let i = 0; i < controls.length; i++) {
      var s = controls[i];
      // calculate the distance between the mouse click and the objects
      const dx = s.x*this.width + this.shadowCanvas.getBoundingClientRect().x - mx;
      const dy = s.y*this.height + this.shadowCanvas.getBoundingClientRect().y - my;

        //  console.log('Mouse: ', e.clientX, e.clientY,'Shape: ', s.x + this.shadowCanvas.getBoundingClientRect().x, s.y+ this.shadowCanvas.getBoundingClientRect().y,'Distance: ', dx, dy);

        // test if the mouse is inside this circle
        if (!this.dragok && dx * dx + dy * dy < (s.r*2) * (s.r*2)) {
          this.dragok = true;
          s.isDragging = true;
          this.setDragging(i);
        }
    }
    // save the current mouse position
    this.startX = mx;
    this.startY = my;
  }

  setDragging(index) {
    this.controlsElements[index].classList.add('dragging');
  }
  removeDragging(index) { 
    this.controlsElements[index].classList.remove('dragging');
}

  // handle mouseup events
  myUp(e, controls) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    this.dragok = false;
    for (let i = 0; i < controls.length; i++) {
      controls[i].isDragging = false;
      this.removeDragging(i);
    }
    this.register(controls);
  }

  // handle events when the mouse leaves the canvas
  myMoveOut(e, controls) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    if (this.dragok) this.register(controls);
    this.dragok = false;
    for (let i = 0; i < controls.length; i++) {
      controls[i].isDragging = false;
      this.removeDragging(i);
    }
  }

  // handle mouse moves
  myMove(e, controls) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
    // if we're dragging anything...
    if (this.dragok) {

      // get the current mouse position
      const mx = parseInt(e.clientX);
      const my = parseInt(e.clientY);

      // calculate the distance the mouse has moved
      // since the last mousemove
      const dx = mx - this.startX;
      const dy = my - this.startY;
      // move each rect that isDragging
      // by the distance the mouse has moved
      // since the last mousemove
      for (let i = 0; i < controls.length; i++) {
        const s = controls[i];
        if (s.isDragging) {
          if (!s.restricted) {
            s.x += dx/this.width;// If we restricted the movement of the shape we don't apply the changes
            s.y += dy/this.height;
          }
        }
      }
      // redraw the scene with the new rect positions
      this.draw();

      // reset the starting mouse position for the next mousemove
      this.startX = mx;
      this.startY = my;
    }

  }


}


window.customElements.define('bezier-input', BezierInput);