// Tests webcomponents

const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
  #container {
    padding: 0 8px;
    box-sizing: border-box;
    overflow: hidden;
  }
  #dragarea {
    position: relative;
    overflow: hidden;
    display: block;
    width: 8px;
  }

  .control {
    position: absolute;
    border-radius: 50%;
    background: var(--figma-color-bg-secondary);
    cursor: grab;
  }
  .control.draggable {
    box-shadow: var(--elevation-500-modal-window, 0px 2px 14px rgba(0, 0, 0, .15), 0px 0px 0px .5px rgba(0, 0, 0, .2));
    z-index: 2;
  }
  .control.dragging {
    cursor: grabbing !important;
  }

  #guide {
    border-right: 1px solid var(--figma-color-border);
    position: absolute;
    width: 50%;
    height: 100%;
  }
  
  </style>
  <div id="container">
    <div id="dragarea">
      <div id="guide">
      </div>
    </div>
  </div>
`; 

class ZoomInput extends HTMLElement {
  static get observedAttributes() {return ['parent']; }
  
    constructor() {
      super();
      this.componentId='';
      this.parent='default';
      this.height = 0;
      this.width = 8;
      this.zoom = 2;
      this.maxZoom = 6;
      // drag related variables
      this.dragok = false;
      this.startX=0;
      this.startY=0;
      this.anchored=false;

      // Then the points that can be moved
      this.control = { x: 0, y: 0, r: 4, isDragging: false};
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
    this.initZoom(this.getAttribute('default'));


    // Then we initialize the control
    const optionTemplate = document.createElement('template');
    optionTemplate.innerHTML = `<div class="control draggable" id="control"></div>`;
    this.dragArea.append(...optionTemplate.content.children);
    this.controlElement=this.shadowRoot.querySelector('#control');
    // And then we update its coordinates
    let ctrlY = this.control.y*this.height-this.control.r;
    let radius = this.control.r*2;
    this.controlElement.setAttribute('style', `width: ${radius}; height: ${radius}; left: 0;top: ${ctrlY}`)   

    this.draw();

    // listen for mouse events
    this.dragArea.onmousedown = (e) => this.myDown(e, this.control) ;
    this.dragArea.onmouseup = (e) => this.myUp(e, this.control) ;
    this.dragArea.onmousemove = (e) => this.myMove(e, this.control) ;
    // this.shadowRoot.querySelector("#container").onmouseleave = (e) => this.myMoveOut(e, this.control) ;
} 

attributeChangedCallback(name, oldValue, newValue) {
  if(name==='parent') { this.setParent(newValue);}
}

  setParent(val) {
    // We initialize the selection value the first time we set the parent of the component
    this.parent=val;
    // We register the component a first time in the whole plugin
    this.register(this.control); 
  }

      // redraw the scene
    draw() {
        // redraw the control
        this.controlElement.setAttribute('style', `width: ${this.control.r*2}; height: ${this.control.r*2}; left: 0;top: ${this.control.y*this.height-this.control.r}`)    
    } 


    setDimensions(val) {
      this.height = val; 
       this.dragArea.setAttribute('style', `height: ${val}px;`)
    }

    register(control){
      this.shadowRoot.dispatchEvent(new CustomEvent("update-zoom", {
      detail: { zoom: 1+(this.control.y*(this.maxZoom-1)), parent:this.parent  },
      composed: true,
      bubbles: true
      }));
    }

    initZoom(zoom){
      this.zoom= parseInt(zoom,10);
      this.control.y=this.zoom/this.maxZoom;
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
    const dx = s.x*this.width + this.dragArea.getBoundingClientRect().x - mx;
    const dy = s.y*this.height + this.dragArea.getBoundingClientRect().y - my;

    //  console.log('Mouse: ', e.clientX, e.clientY,'Shape: ', s.x + this.shadowCanvas.getBoundingClientRect().x, s.y+ this.shadowCanvas.getBoundingClientRect().y,'Distance: ', dx, dy);

    // test if the mouse is inside this circle
    if (!this.dragok && dx * dx + dy * dy < (s.r*2) * (s.r*2)) {
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
    // if we're dragging anything...
    console.log('moving')
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
            s.y += dy/this.height; // We move only vertically
            if (s.y > this.height) s.y=this.height;
            if (s.y < 0) s.y=0;
        }
      // redraw the scene with the new rect positions
      this.register(s);
      this.draw();

      // reset the starting mouse position for the next mousemove
      this.startX = mx;
      this.startY = my;
    }

  }


}


window.customElements.define('zoom-input', ZoomInput);