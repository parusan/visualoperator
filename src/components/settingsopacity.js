
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>

  .section {padding: 8px 0; width: 100%; box-sizing: border-box;}
  .row {
    padding: 0 8px;
    display: flex;
    flex-direction: row;
    gap: 8px;
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


  <div class="section section-opacity spacer-bottom">
    <div class="row">
      <div class="label sublabel">Opacity</div>
    </div>
    <div class="row">
      <figma-select values="Fixed|Bezier" values-icons="fixed-space|curve" id="opacity-mode" role="opacity-mode" class='figma-select' tooltip="Select the % opacity for each step">
      </figma-select>
      <text-input id="opacity" role="opacity" tooltip="Scale" default-value="0" icon="alpha" unit="%">
      </text-input>
    </div>
    <div class="row">
      <bezier-input id="bezier-controls-opacity" role="bezier-controls-opacity" height="100" width="176"></bezier-input>
    </div>
  </div>
`; 

class SettingsOpacity extends HTMLElement {
    constructor() {
      super();
      this.type='Opaopacitycity';
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
            if (e.detail.param==="opacity-mode") this.switchMode('#bezier-controls-opacity', e.detail.data);
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
      this.shadowRoot.querySelector('#opacity-mode').setAttribute('parent', parentId);
      this.shadowRoot.querySelector('#opacity').setAttribute('parent', parentId);
      this.shadowRoot.querySelector('#bezier-controls-opacity').setAttribute('parent', parentId);
    }

    initParams(params){

      let mode = params['opacity-mode'] !== '' ? params['opacity-mode'] : refs.scaleDefault['opacity-mode'];
      this.shadowRoot.querySelector('#opacity-mode')._value = mode ;
      this.switchMode('#bezier-controls-opacity', mode);

      let controls = {... params['bezier-controls-opacity'] ? params['bezier-controls-opacity'] : refs.scaleDefault['bezier-controls-opacity']};
      this.shadowRoot.querySelector('#bezier-controls-opacity')._controlsValue = controls;

      let opacity = params['opacity']>=0 ? params['opacity'] : refs.scaleDefault['opacity'];
      this.shadowRoot.querySelector('#opacity')._val = opacity;

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

window.customElements.define('opacity-settings', SettingsOpacity);