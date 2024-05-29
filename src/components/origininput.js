// Tests webcomponents

const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
  #container {
    display: flex;
    gap: 0px;
    position: relative;
  }
  .origincanvas {
    border-radius: 4px;
    position: relative;
    z-index: 1;
  }
  :host {
    padding: 8px;
    display: block;
  }
  #dragarea {
    position: relative;
    overflow: hidden;
  }
  .anchor, .grid-anchor {
    position: absolute;
    border-radius: 50%;
    background: var(--figma-color-bg-disabled-secondary);
  }
  .anchor.invisible-anchor, .grid-anchor.invisible-anchor {
    background: transparent;
  }

  .control {
    position: absolute;
    border-radius: 50%;
    background: var(--color-accent1);
    cursor: grab;
  }
  .control.draggable {
    background: var(--color-accent1);
    z-index: 2;
  }
  .control.dragging {
    cursor: grabbing !important;
  }

  #objectBg, #bg, .ghost {
    border: 1px solid var(--figma-color-bg-disabled-secondary);
    border-radius: 4px;
    position: absolute;
    box-sizing: border-box;
  }
  #objectBg {
    background: var(--figma-color-bg-secondary);
  }
  #bg {
    border-style: dashed;
    border-color: var(--color-accent11)
  }
  .ghost {
    opacity: 0.6;
  }
  .ghost:has(svg), #objectBg:has(svg) {
    border: none;
  }
  .ghostcontent {
    opacity: 0.4;
  }
  .ghostcontent, .ghostcontent * {
    fill: var(--figma-color-bg-disabled-secondary);
    stroke: var(--figma-color-bg-disabled-secondary);
  }
  
  </style>
  <div id="container">
    <div id="dragarea">
      <canvas class="origincanvas" id="innercanvas" height="0" width="0"></canvas>
    </div>
    <zoom-input id="zoom" parent="" height="100" default="2"></zoom-input>
  </div>
`; 

class OriginInput extends HTMLElement {
  static get observedAttributes() {return ['parent']; }
  
    constructor() {
      super();
      this.componentId='';
      this.parent='default';
      this.type='default';
      this.mode='default';

      this.height = 0;
      this.width = 0;
      this.zoom = 2;
      this.angle=0;
      // drag related variables
      this.dragok = false;
      this.startX=0;
      this.startY=0;
      this.anchored=false;

      // Colors
      this.styles = getComputedStyle(document.documentElement)

      // Define the points as {x, y}
      // First the anchors that will sit around the object
      this.objectTL = { x: 0, y: 0, r:2, show: false};
      this.objectTT = { x: 0.5, y: 0, r: 2, show: false};
      this.objectTR = { x: 1, y: 0, r: 2, show: false};
      this.objectML = { x: 0, y: 0.5, r: 2, show: false};
      this.objectC = { x: 0.5, y: 0.5, r: 2, show: true};
      this.objectMR = { x: 1, y: 0.5, r: 2, show: false};
      this.objectBL = { x: 0, y: 1, r: 2, show: false};
      this.objectBB = { x: 0.5, y: 1, r: 2, show: false};
      this.objectBR = { x: 1, y: 1, r: 2, show: false};

      this.anchors = [this.objectTL, this.objectTT, this.objectTR, this.objectML, this.objectC, this.objectMR, this.objectBL, this.objectBB, this.objectBR];
      this.zoomAnchors = structuredClone(this.anchors);
      this.anchorsElements =[];

      // We add the background elements
      this.objectBg = '';
      this.objectGhost = '';
      this.bg='';

      // Then we initialize the anchors that will sit aound the grid
      this.gridTL = { x: 0, y: 0, r: 2, show: false};
      this.gridTT = { x: 0.5, y: 0, r: 2, show: false};
      this.gridTR = { x: 1, y: 0, r: 2, show: false};
      this.gridML = { x: 0, y: 0.5, r: 2, show: false};
      this.gridC = { x: 0.5, y: 0.5, r: 2, show: true};
      this.gridMR = { x: 1, y: 0.5, r: 2, show: false};
      this.gridBL = { x: 0, y: 1, r: 2, show: false};
      this.gridBB = { x: 0.5, y: 1, r: 2, show: false};
      this.gridBR = { x: 1, y: 1, r: 2, show: false};

      this.gridAnchors = [this.gridTL, this.gridTT, this.gridTR, this.gridML, this.gridC, this.gridMR, this.gridBL, this.gridBB, this.gridBR];
      this.gridAnchorsElements =[];

      // Then the points that can be moved
      this.control = { x: 0.5, y: 0.5, r: 5, isDragging: false, restricted: false };
      this.controlElement = '';

      // We get ready to store and display the svg of the selection if there is one
      this.ghostSvg='';

     // Attach a shadow root to the component
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowCanvas = shadowRoot.querySelector("#innercanvas");
      this.ctx = this.shadowCanvas.getContext("2d");
      this.dragArea = shadowRoot.querySelector("#dragarea");
      this.zoomEl = shadowRoot.querySelector("#zoom");

      // We listen for zoom updates
      this.addEventListener("update-zoom-view", function(e) {
        if (e.detail.parent===(this.parent+'-'+this.componentId)) 
        { 
          this.updateZoom(e.detail.zoom);
        }
        });

      // We listen for zoom updates that trigger sending the data
      this.addEventListener("update-zoom", function(e) {
        if (e.detail.parent===(this.parent+'-'+this.componentId)) 
        { 
          this.updateZoom(e.detail.zoom);
          this.register();
        }
        });

        // Here we listen to updates for the shape of the ghost, eg the selection of Node in figma

      document.addEventListener("update-ghost", e => {
        if (e.detail.svg) 
        { 
          this.setGhost(e.detail.svg);
        }
        });
        document.addEventListener("empty-ghost", e => {
            this.emptyGhost();
        });

  }

  set _angle(angle){
    this.setAngle(angle);
  }

  get _angle() {
    return this.angle;
  }

  set _origin(origin){
    this.control.x=origin.x;
    this.control.y=origin.y;
    this.initZoom(origin.zoom);
    this.updateControl();
  }

  get _origin() {
    let origin= {
      'x': this.origin.x,
      'y': this.origin.y,
      'zoom': this.zoom
    }
    return origin;
  }


  connectedCallback(){ // Called when inserted into DOM
    // Initialization of the attributes
    this.setDimensions(this.getAttribute('size'));
    this.componentId=this.getAttribute('id');
    this.type=this.getAttribute('role');
    this.setMode(this.getAttribute('mode'))

    // We try to request the ghost of the SVG
    this.getGhost();

    //We initialize the background element
    const bgTemplate = document.createElement('template');
    bgTemplate.innerHTML = `<div class="bg" id="bg"></div>`;
    this.dragArea.append(...bgTemplate.content.children);
    this.bg=this.shadowRoot.querySelector('#bg');
    // And then we update its coordinates
    let bgTopLeft = 0;
    let bgSize = this.width;
    this.bg.setAttribute('style', `width: ${bgSize}; height: ${bgSize}; left: ${bgTopLeft};top: ${bgTopLeft}`) 

    const objectBgTemplate = document.createElement('template');
    objectBgTemplate.innerHTML = `<div class="objectBg" id="objectBg"></div>`;
    this.dragArea.append(...objectBgTemplate.content.children);
    this.objectBg=this.shadowRoot.querySelector('#objectBg');
    // And then we update its coordinates
    let objBgTopLeft = (this.zoom-1)/(2*this.zoom)*this.width;
    let objBgSize = this.width/this.zoom;
    this.objectBg.setAttribute('style', `width: ${objBgSize}; height: ${objBgSize}; left: ${objBgTopLeft};top: ${objBgTopLeft}`)  

    const ghostBgTemplate = document.createElement('template');
    ghostBgTemplate.innerHTML = `<div class="ghost" id="ghost"></div>`;
    this.dragArea.append(...ghostBgTemplate.content.children);
    this.objectGhost=this.shadowRoot.querySelector('#ghost');
    // And then we update its coordinates
    let ghostTopLeft = (this.zoom-1)/(2*this.zoom)*this.width;
    let ghostSize = this.width/this.zoom;
    this.objectBg.setAttribute('style', `width: ${ghostSize}; height: ${ghostSize}; left: ${ghostTopLeft};top: ${ghostTopLeft}`)

    // We initialize the DOM with the grid anchors
    // The grid anchors are all around the component and are not affected by the level of zoom
    for (let i=0; i<this.gridAnchors.length; i++) {
      // We draw the anchors in the DOM
      let thisId =  'grid-anchor-' + i;
      const optionTemplate = document.createElement('template');
      let extraClass= !this.gridAnchors[i].show ? 'invisible-anchor' : '';
      optionTemplate.innerHTML = `<div class="grid-anchor ${extraClass}" id="${thisId}"></div>`;
      this.dragArea.append(...optionTemplate.content.children);
      this.gridAnchorsElements.push(this.shadowRoot.querySelector('#'+thisId));
      // And then we update its coordinates
      let ctrlX = this.gridAnchors[i].x*this.width-this.gridAnchors[i].r;
      let ctrlY = this.gridAnchors[i].y*this.height-this.gridAnchors[i].r;
      let radius = this.gridAnchors[i].r*2;
      this.gridAnchorsElements[i].setAttribute('style', `width: ${radius}; height: ${radius}; left: ${ctrlX};top: ${ctrlY}`)    
    }

    // We initialize the DOM with the anchors
    // First we need to normalize the anchors with the zoom
    this.normalizeObjectAnchors();

    // We add the object anchors
    // The object anchors are all around the element and are affected by the level of zoom
    for (let i=0; i<this.zoomAnchors.length; i++) {
      // We draw the anchors in the DOM
      let thisId =  'anchor-' + i;
      let extraClass= !this.gridAnchors[i].show ? 'invisible-anchor' : '';
      const optionTemplate = document.createElement('template');
      optionTemplate.innerHTML = `<div class="anchor ${extraClass}" id="${thisId}"></div>`;
      this.dragArea.append(...optionTemplate.content.children);
      this.anchorsElements.push(this.shadowRoot.querySelector('#'+thisId));
      // And then we update its coordinates
      let ctrlX = this.zoomAnchors[i].x*this.width-this.zoomAnchors[i].r;
      let ctrlY = this.zoomAnchors[i].y*this.height-this.zoomAnchors[i].r;
      let radius = this.zoomAnchors[i].r*2;
      this.anchorsElements[i].setAttribute('style', `width: ${radius}; height: ${radius}; left: ${ctrlX};top: ${ctrlY}`)
    }

    this.initControl();

    // listen for mouse events
    this.dragArea.onmousedown = (e) => this.myDown(e, this.control) ;
    this.dragArea.onmouseup = (e) => this.myUp(e, this.control) ;
    this.dragArea.onmousemove = (e) => this.myMove(e, this.control) ;
    // this.dragArea.onmouseleave = (e) => this.myMoveOut(e, this.control) ;
}

 initControl() {
    // Then we initialize the control
    const optionTemplate = document.createElement('template');
    optionTemplate.innerHTML = `<div class="control draggable" id="control-${this.componentId}"></div>`;
    this.dragArea.append(...optionTemplate.content.children);
    this.controlElement=this.shadowRoot.querySelector('#control-'+this.componentId);
    // And then we update its coordinates
    let ctrlX = this.control.x*this.width-this.control.r;
    let ctrlY = this.control.y*this.height-this.control.r;
    let radius = this.control.r*2;
    this.controlElement.setAttribute('style', `width: ${radius}; height: ${radius}; left: ${ctrlX};top: ${ctrlY}`)    

    this.draw();
 }

 updateControl(){
      // And then we update its coordinates
      let ctrlX = this.control.x*this.width-this.control.r;
      let ctrlY = this.control.y*this.height-this.control.r;
      let radius = this.control.r*2;
      this.controlElement.setAttribute('style', `width: ${radius}; height: ${radius}; left: ${ctrlX};top: ${ctrlY}`)    
  
      this.draw();
      this.drawGhost();
 }

attributeChangedCallback(name, oldValue, newValue) {
  if(name==='parent') { this.setParent(newValue);}
  if(name==='angle') { this.setAngle(newValue);}
}

  normalizeObjectAnchors(){
    let z=this.zoom;
    for (let i=0; i<this.zoomAnchors.length; i++){
      let s = this.anchors[i];
      let zs= this.zoomAnchors[i];
      zs.x = (z-1)/(2*z)+s.x/z;
      zs.y = (z-1)/(2*z)+s.y/z;
    }
  }

  setMode(mode){
    if (mode==="nozoom") {
      this.zoom = 1;
      this.shadowRoot.querySelector('#zoom').style.display='none';
    }
  }

  setGhost(svg){
    this.emptyGhost();
    this.ghostSvg=svg;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const doc2 = parser.parseFromString(svg, 'image/svg+xml');
    let o = this.objectBg.appendChild(doc.documentElement);
    o.removeAttribute('height'); o.removeAttribute('width'); o.classList.add("ghostcontent");
    let g = this.objectGhost.appendChild(doc2.documentElement);
    g.removeAttribute('height'); g.removeAttribute('width'); g.classList.add("ghostcontent");
    o.setAttribute("id", "objContent");
    g.setAttribute("id", "ghostcontent");
  }


  emptyGhost() {
    // We forcefully empty the html content of the node
    this.objectGhost.innerHTML = '';
    this.objectBg.innerHTML = '';
  }

initZoom(zoom){
    this.setZoom(zoom);
    this.zoomEl._zoom=zoom;
}

  setZoom(zoom){
    this.zoom=zoom;
    if (this.mode ==='nozoom') this.zoom = 1; // we bypass the saved parameter just in case
    console.log(this.zoom);
    this.drawAnchors();
    this.drawGhost();
  }

  updateZoom(zoom) {
    this.control.x = (zoom-1)/(2*zoom) + (2*this.control.x*this.zoom-this.zoom+1)/(2*zoom);
    this.control.y = (zoom-1)/(2*zoom) + (2*this.control.y*this.zoom-this.zoom+1)/(2*zoom);
    this.zoom=zoom;
    this.drawAnchors();
    this.updateControl();
  }

  setAngle(angle){
    this.angle=angle;
   this.drawGhost();
  }

  setParent(val) {
    // We initialize the selection value the first time we set the parent of the component
    this.parent=val;
    this.zoomEl.setAttribute('parent', val+'-'+this.componentId);
  }

    // clear the canvas
    clear() { this.ctx.clearRect(0, 0, this.width, this.height); }

      // redraw the scene
    draw() {
      this.clear();
        //  Drawing the line to the center
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.styles.getPropertyValue('--color-accent7');
        this.ctx.setLineDash([8, 8]);
        this.ctx.beginPath();  
        this.ctx.moveTo(this.objectC.x*this.width, this.objectC.y*this.height);
        this.ctx.lineTo(this.control.x*this.width, this.control.y*this.height);
        this.ctx.stroke();
        // redraw the control
        this.controlElement.setAttribute('style', `width: ${this.control.r*2}; height: ${this.control.r*2}; left: ${this.control.x*this.width-this.control.r};top: ${this.control.y*this.height-this.control.r}`)    
    } 

    drawAnchors() {
        // redraw the anchors and the object BG
        let objBgTopLeft = (this.zoom-1)/(2*this.zoom)*this.width;
        let objBgSize = this.width/this.zoom;
        this.objectBg.setAttribute('style', `width: ${objBgSize}; height: ${objBgSize}; left: ${objBgTopLeft};top: ${objBgTopLeft}`) 

        this.normalizeObjectAnchors()
        for (let i=0; i<this.zoomAnchors.length; i++) {
            // And then we update its coordinates
            let ctrlX = this.zoomAnchors[i].x*this.width-this.zoomAnchors[i].r;
            let ctrlY = this.zoomAnchors[i].y*this.height-this.zoomAnchors[i].r;
            let radius = this.zoomAnchors[i].r*2;
            this.anchorsElements[i].setAttribute('style', `width: ${radius}; height: ${radius}; left: ${ctrlX};top: ${ctrlY}`)
          }
    } 

    async drawGhost() {

      // redraw the anchors and the object BG
      let objBgTopLeft = (this.zoom-1)/(2*this.zoom)*this.width;
      let objBgSize = this.width/this.zoom;

      let dx = this.control.x*this.width - objBgTopLeft;
      let dy = this.control.y*this.height -objBgTopLeft;
      this.objectGhost.setAttribute('style', `width: ${objBgSize}; height: ${objBgSize}; left: ${objBgTopLeft};top: ${objBgTopLeft}`);  
      
      // We update the ghost rotation
      this.objectGhost.style.transform=`rotate(-${this.angle}deg)`;
      this.objectGhost.style.transformOrigin=`${dx}px ${dy}px`;
  } 


    setDimensions(val) {
      this.height = val; 
      this.width = val;
       this.shadowCanvas.setAttribute('height', val);
       this.shadowCanvas.setAttribute('width', val);
       this.dragArea.setAttribute('style', `height: ${val}px; width: ${val}px;`)
    }

    register(){
      let newOrigin ={
        x: this.control.x,
        y: this.control.y,
        zoom: this.zoom
      }
      console.log('registering')
      this.shadowRoot.dispatchEvent(new CustomEvent("update-param", {
      detail: { data: newOrigin, "data-label":'origin-controls', target: this.parent, param:this.componentId  },
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

    var s = this.control;
    // calculate the distance between the mouse click and the objects
    const dx = s.x*this.width + this.shadowCanvas.getBoundingClientRect().x - mx;
    const dy = s.y*this.height + this.shadowCanvas.getBoundingClientRect().y - my;

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

  getGhost(){
    parent.postMessage(
      { pluginMessage: 
        { type: 'getselectionsvg',  parent: this.parent, componentId:this.componentId}
      }, '*'
    );
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
      this.register();
    }
  }

  // handle events when the mouse leaves the canvas
  myMoveOut(e, control) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    if (this.dragok) this.register();
    this.dragok = false;
    control.isDragging = false;
    this.removeDragging();
  }

  // handle mouse moves
  myMove(e, control) {
    // if we're dragging anything...
    if (this.dragok) {
      // tell the browser we're handling this mouse event
      e.preventDefault();
      e.stopPropagation();
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
          if (!this.anchored){ // If we are not anchored we move
            s.x += dx/this.width;
            s.y += dy/this.height;
          }
          else { // We leave the anchor if we are far enough
            
            // calculate the distance between the mouse click and the objects
            const mdx = s.x*this.width + this.shadowCanvas.getBoundingClientRect().x - mx;
            const mdy = s.y*this.height + this.shadowCanvas.getBoundingClientRect().y - my;
            if (mdx*mdx + mdy*mdy > s.r*s.r) {
              s.x = (mx-this.shadowCanvas.getBoundingClientRect().x)/this.width;
              s.y = (my-this.shadowCanvas.getBoundingClientRect().y)/this.height; 
              this.anchored=false;             
            }
          }

          // We check if we are over the border of the page
          s.x = s.x <= 0 ? 0 : s.x;
          s.x = s.x >= 1 ? 1 : s.x;
          s.y = s.y <= 0 ? 0 : s.y;
          s.y = s.y >= 1 ? 1 : s.y;


          // We try to add a magnetic effect with the anchors
          for (let i=0; i<this.zoomAnchors.length; i++){
            // calculate the distance between the object and the anchors
            const distx = s.x - this.zoomAnchors[i].x;
            const disty = s.y - this.zoomAnchors[i].y;
            if (!this.anchored) {
              if ((distx * distx) + (disty * disty) < (s.r/this.width*2) * (s.r/this.width*2)) {
                s.x = this.zoomAnchors[i].x;
                s.y = this.zoomAnchors[i].y;
                this.anchored=true; 
              }
            }
          }
          // We try to add a magnetic effect with the grid anchors
          for (let i=0; i<this.gridAnchors.length; i++){
            // calculate the distance between the object and the anchors
            const distx = s.x - this.gridAnchors[i].x;
            const disty = s.y - this.gridAnchors[i].y;
            if (!this.anchored) {
              if ((distx * distx) + (disty * disty) < (s.r/this.width*2) * (s.r/this.width*2)) {
                s.x = this.gridAnchors[i].x;
                s.y = this.gridAnchors[i].y;
                this.anchored=true; 
              }
            }
          }
        }
      // redraw the scene with the new rect positions
      this.draw();
      this.drawGhost();

      // reset the starting mouse position for the next mousemove
      this.startX = mx;
      this.startY = my;
    }

  }


}


window.customElements.define('origin-input', OriginInput);