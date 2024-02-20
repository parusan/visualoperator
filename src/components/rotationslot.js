
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
  </style>
  <div class="section section-rotation">
  <div class="row">
    <div class="label-main">Rotation</div>
  </div>
  <div class="row">
    <figma-select values="Fixed|Smooth" values-icons="fixed-space|curve" id="mode" class='figma-select' tooltip="Select the rotation for each clone">
    </figma-select>
  </div>
  <div class="row">
    <text-input id="angle" tooltip="Angle" default-value="0" icon="angle" unit="°">
    </text-input>
  </div>
    <div class="row" id="canvascontainer">
      <bezier-input id="curve-controls" height="100" width="200"></bezier-input>
    </div>
    <div class="row">
      <origin-input id="origin" size="100"></origin-input>
    </div>
  </div>
`; 

class RotationSlot extends HTMLElement {
    constructor() {
      super();
      this.type='rotation';
      this.componentId='';
      this.params={};

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.addEventListener("update-params", function(e) {
        // When we receive a request to update the params
        // If it is inside this component, we update them, and then send all the params at once to the plugin
        if (e.detail.parent===this.componentId) 
        { 
            this.params[e.detail.param]= {
              value: e.detail.data,
              label: e.detail['data-label']
            } 
            this.register();
            // If we are changing the mode, we have to update the view
            if (e.detail.param==="mode") {
              this.switchMode(e.detail)
            }
            // If the param is angle, we also send that to update the view in the origin selector
            if (e.detail.param==='angle') {
              this.shadowRoot.querySelector('#origin').setAttribute('angle', e.detail.data )
            }
        }
        });
  }

    setId(val) {
      this.componentId = val;
    }

    switchMode(val) {
      if (val['data-label']==='Smooth') {this.showCurve(); return 0;}
      this.hideCurve()
    }

    showCurve() {
      this.shadowRoot.querySelector('#canvascontainer').style.display = "block";
    }

    hideCurve() {
      this.shadowRoot.querySelector('#canvascontainer').style.display = "none";
    }

    setParentId() {
      this.shadowRoot.querySelector('#mode').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#angle').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#curve-controls').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#origin').setAttribute('parent', this.componentId);
    }

    register(){
      this.shadowRoot.dispatchEvent(new CustomEvent("update-controls", {
        detail: { data: this.params, type:this.type, id: this.componentId},
      composed: true,
      bubbles: true
    })); 
    } 

    connectedCallback(){ // Called when inserted into DOM
      // Initialization of the attributes
      this.setId(this.getAttribute('id'));
      this.componentId=this.getAttribute('id');
      this.setParentId();  
  }


}

window.customElements.define('rotation-slot', RotationSlot);