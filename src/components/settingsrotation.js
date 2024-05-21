
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>

  .section {padding: 8px 0; width: 100%; box-sizing: border-box;}
  .row {
    padding: 0 8px;
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
  .row > * {
    flex:1;
  }
  .row > .small-flex {
    flex: 0;
  }
  .label {
    color: var(--figma-color-text-secondary)
  }
  .sublabel {
    padding: 8px;
  }
  .label-main {
    font-weight: 600;
    line-height: 32px;
    padding-left: 8px;
    color: var(--figma-color-text-secondary)
  }
  .spacer-bottom {
    border-bottom: 1px solid var(--figma-color-border);
  }
  .spacer-top {
    border-top: 1px solid var(--figma-color-border);
  }

  #main-row {
    position: relative;
  }
  </style>


  <div class="section section-rotation spacer-bottom">
    <div class="row">
      <div class="label sublabel">Rotation spacing</div>
    </div>
    <div class="row">
      <figma-select values="Fixed|Bezier" values-icons="fixed-space|curve" id="angle-mode" role="angle-mode" class='figma-select' tooltip="Select the rotation for each clone">
      </figma-select>
      <text-input id="angle" role="angle" tooltip="Angle" default-value="0" icon="angle" unit="°">
      </text-input>
    </div>
    <div class="row">
      <bezier-input id="bezier-controls-angle" role="bezier-controls-angle" height="100" width="184"></bezier-input>
    </div>
  </div>
  <div class="section section-spacing spacer-bottom">
    <div class="row">
      <div class="label sublabel">Rotation origin</div>
    </div>
    <div class="row">
      <origin-input id="origin" role="origin" size="100"></origin-input>
    </div>
  </div>
`; 

class SettingsRotation extends HTMLElement {
    constructor() {
      super();
      this.type='rotation';
      this.componentId='';
      this.parent = '';
      this.params={};
      this.flow='';

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.addEventListener("update-param", function(e) {
        // When we receive a request to update the params
        // If it is inside this component, we update them, and then send all the params at once to the plugin

        if (e.detail.target===this.parent) 
        { 
          console.log(e.detail)
            this.params[e.detail.param]= e.detail.data;
            this.register();
            // If we are changing the mode, we have to update the view
            if (e.detail.param==="angle-mode") this.switchMode('#bezier-controls-angle', e.detail.data);
            // update the origin thingy with the angle
            if (e.detail.param==="angle") this.shadowRoot.querySelector('#origin')._angle = e.detail.data;
        }
        });
  }

  set _params(params){
    // If we are here, we know that the type is ok
    this.params={...params};
    this.initParams(params);
  }

  get _params(){
    return this.params;
  }

    setId(val) {
      this.componentId = val;
    }

    setFlow(flow) {
      this.flow = flow;
    }

    switchMode(item, mode) {
      if (mode==='Bezier') {this.showCurve(item); return 0;}
      this.hideCurve(item)
    }

    showCurve(item) {
      this.shadowRoot.querySelector(item).style.display = "block";
    }

    hideCurve(item) {
      this.shadowRoot.querySelector(item).style.display = "none";
    }

    setParentId(parentId) {
      this.parent = parentId;
      this.shadowRoot.querySelector('#angle-mode').setAttribute('parent', parentId);
      this.shadowRoot.querySelector('#angle').setAttribute('parent', parentId);
      this.shadowRoot.querySelector('#bezier-controls-angle').setAttribute('parent', parentId);
      this.shadowRoot.querySelector('#origin').setAttribute('parent', parentId);
    }

    initParams(params){

      let modeangle = params['angle-mode'] !== '' ? params['angle-mode'] : refs.rotationDefault['angle-mode'];
      this.shadowRoot.querySelector('#angle-mode')._value = modeangle ;
      this.switchMode('#bezier-controls-angle', modeangle);

      let controlsangle = {... params['bezier-controls-angle'] ? params['bezier-controls-angle'] : refs.rotationDefault['bezier-controls-angle']};
      this.shadowRoot.querySelector('#bezier-controls-angle')._controlsValue = controlsangle;

      let angle = params['angle']>=0 ? params['angle'] : refs.rotationDefault['angle'];
      this.shadowRoot.querySelector('#angle')._val = angle;
      this.shadowRoot.querySelector('#origin')._angle = angle;

      let origin = (params['origin'].zoom>=0 && params['origin'].x>=0 && params['origin'].y>=0) ? params['origin'] : refs.rotationDefault['origin'];
      this.shadowRoot.querySelector('#origin')._origin = origin;

    }

    register(){
      this.shadowRoot.dispatchEvent(new CustomEvent("update-params", {
        detail: { data: this.params, type:this.type, id: this.componentId, flow: this.flow, target:this.parent},
      composed: true,
      bubbles: true
    }));
    } 

    connectedCallback(){ // Called when inserted into DOM
      // Initialization of the attributes
      this.setId(this.getAttribute('id'));
      this.setParentId(this.getAttribute('op'));  
      this.setFlow(this.getAttribute('flow'));
  }


}

window.customElements.define('rotation-settings', SettingsRotation);