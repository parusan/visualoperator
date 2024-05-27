// Tests webcomponents

const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
  #container {
    padding: 0 16px;
    box-sizing: border-box;
  }
  #dragarea {
    position: relative;
    display: block;
  }

  .control {
    position: absolute;
    border-radius: 2px;
    background: var(--figma-color-bg);
    border: 1px solid var(--color-accent11);
    pointer-events: none;   
  }
  .control.draggable {
    cursor: grab;
     z-index: 2;
  }
  .control.dragging {
    cursor: grabbing !important;  
  }

  #guide {
    border-right: 1px solid var(--color-accent7);
    position: absolute;
    width: 50%;
    height: 100%;
    pointer-events: none; 
  }

  #display, #title {
    box-sizing: border-box;
    height: 20px;
    padding: 0 0 4px;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: var(--figma-color-text-secondary);
  }
  #display {
    padding: 4px 0 0;
    color: var(--color-accent11);
  }
  #title {
    font-size: 12px;
  }
  
  </style>
  <div id="title">ZOOM</div>
  <div id="container">
    <div id="dragarea">
      <div id="guide">
      </div>
    </div>
  </div>
  <div id="display">2X</div>

`; 

class ZoomInput extends HTMLElement {
  static get observedAttributes() {return ['parent']; }
  
    constructor() {
      super();
      this.componentId='';
      this.parent='default';
      this.height = 0;
      this.width = 32;
      this.zoom = 2;
      this.minZoom = 1;
      this.maxZoom = 5;
      // drag related variables
      this.dragok = false;
      this.startX=0;
      this.startY=0;
      this.anchored=false;

      // Then the points that can be moved
      this.control = { x: 0, y: 0, w: 32, h: 4, isDragging: false};
      this.controlElement = '';

     // Attach a shadow root to <bezier-input>.
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this.dragArea = shadowRoot.querySelector("#dragarea");

  }

  connectedCallback(){ // Called when inserted into DOM
    // Initialization of the attributes
    this.setDimensions(this.getAttribute('height'));
    this.componentId=this.getAttribute('id');


    // Then we initialize the control
    const optionTemplate = document.createElement('template');
    optionTemplate.innerHTML = `<div class="control draggable" id="control"></div>`;
    this.dragArea.append(...optionTemplate.content.children);
    this.controlElement=this.shadowRoot.querySelector('#control');
    // And then we update its coordinates
    let ctrlY = this.control.y*this.height-this.control.h;
    this.controlElement.setAttribute('style', `width: ${this.control.w}; height: ${this.control.h}; left: 0;top: ${ctrlY}`)   

    this.draw();

    // listen for mouse events
    this.dragArea.onmousedown = (e) => this.myDown(e, this.control) ;
    this.dragArea.onmouseup = (e) => this.myUp(e, this.control) ;
    this.dragArea.onmousemove = (e) => this.myMove(e, this.control) ;
    this.dragArea.onmouseout = (e) => this.myMoveOut(e, this.control) ;
} 

set _zoom(zoom) {
  this.initZoom(zoom);
}

get _zoom() {
  return this.zoom;
}

attributeChangedCallback(name, oldValue, newValue) {
  if(name==='parent') { this.setParent(newValue);}
}

  setParent(val) {
    // We initialize the selection value the first time we set the parent of the component
    this.parent=val;
  }

      // redraw the scene
    draw() {
        // redraw the control
        this.controlElement.setAttribute('style', `width: ${this.width}; height: ${this.control.h}; left: 0;top: ${this.control.y*this.height-this.control.h/2}`)    
        let displayZoom = Math.round(10 * (1/this.zoom))/10;
        this.shadowRoot.querySelector('#display').innerHTML = displayZoom + "X";
      } 


    setDimensions(val) {
      this.height = val - 40; 
       this.dragArea.setAttribute('style', `height: ${this.height}px; width: ${this.width}px;`)
    }

    updateView(control){
      this.zoom = Math.round(10 * (1+(this.control.y*(this.maxZoom-1))))/10;
      this.shadowRoot.dispatchEvent(new CustomEvent("update-zoom-view", {
      detail: { zoom: this.zoom, parent:this.parent  },
      composed: true,
      bubbles: true
      }));
    }
    register(control){
      this.shadowRoot.dispatchEvent(new CustomEvent("update-zoom", {
      detail: { zoom: 1+(this.control.y*(this.maxZoom-1)), parent:this.parent  },
      composed: true,
      bubbles: true
      }));
    }

    initZoom(zoom){
      this.zoom= Math.round(zoom*10)/10;
      if (this.zoom<1) this.zoom=1;
      if (this.zoom>this.maxZoom) this.maxZoom=this.zoom;
      this.control.y=this.zoom/this.maxZoom;
      this.draw();
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

    var s = this.control;
    // calculate the distance between the mouse click and the objects
    const dy = s.y*this.height + this.dragArea.getBoundingClientRect().y - my;

    // test if the mouse is inside this circle
    if (!this.dragok && dy * dy < ((s.h*2) * (s.h*2))) {
      this.dragok = true;
      s.isDragging = true;
      this.setDragging();
    }
    // save the current mouse position
    this.startX = mx;
    this.startY = my;
  }

  setDragging() {
    this.controlElement.classList.add('dragging');
  }
  removeDragging() { 
    this.controlElement.classList.remove('dragging');
  }

  // handle mouseup events
  myUp(e, control) {
    // tell the browser we're handling this mouse event
    if (this.control.isDragging) {
      e.preventDefault();
      e.stopPropagation();

      // clear all the dragging flags
      this.dragok = false;
      control.isDragging = false;
      this.removeDragging();
      this.register(control);
    }
  }

  // // handle events when the mouse leaves the canvas
  myMoveOut(e, control) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    if (this.dragok) this.register(control);
    this.dragok = false;
    control.isDragging = false;
    this.removeDragging();
  }

  // handle mouse moves
  myMove(e, control) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    this.checkMouse(e, control);
    // if we're dragging anything...
    if (this.dragok) {

      // get the current mouse position
      const mx = parseInt(e.clientX);
      const my = parseInt(e.clientY);

      // calculate the distance the mouse has moved
      // since the last mousemove
      const dx = mx - this.startX;
      const dy = my - this.startY;


      // move the control by the distance the mouse has moved
      // since the last mousemove
        const s = control;
        if (s.isDragging) {
          this.dragArea.style.cursor='grabbing';
            s.y += dy/this.height; // We move only vertically
            if (s.y > this.height) s.y=this.height;
            if (s.y < 0) s.y=0;
        }
      // redraw the scene with the new rect positions
      this.updateView(s);
      this.draw();

      // reset the starting mouse position for the next mousemove
      this.startX = mx;
      this.startY = my;
    }

  }

  checkMouse(e, controls) {
    // get the current mouse position
    const mx = parseInt(e.clientX);
    const my = parseInt(e.clientY);
    this.dragArea.style.cursor='default';
    // test each shape to see if mouse is inside

      var s = this.control;
    // calculate the distance between the mouse click and the objects
    const dy = s.y*this.height + this.dragArea.getBoundingClientRect().y - my;

      // test if the mouse is close enough to the shape
      if (!this.dragok && dy * dy < ((s.h*2) * (s.h*2))) {
        this.dragArea.style.cursor='grab';
      }
  }


}


window.customElements.define('zoom-input', ZoomInput);