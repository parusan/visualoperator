
import * as refs from '../res/refs.js';
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
  <div class="section section-spacing">
    <div class="row">
      <div class="label sublabel">Horizontal</div>
    </div>
    <div class="row">
        <figma-select values="Bezier|Fixed" values-icons="curve|fixed-space" id="mode" role="mode" class='figma-select' tooltip="Type of spacing"></figma-select>
        <figma-select values="Horizontal|Vertical" values-icons="horizontal-arrows|vertical-arrows" id="direction" role="direction" class='figma-select' tooltip="Diretion"></figma-select>
      </div>
    <div class="row">
    <text-input id="offset" role="offset" tooltip="Horizontal gap" icon="horizontal-arrows" unit="px"> </text-input>
    </div>
    <div class="row">
      <bezier-input id="bezier-controls" role="bezier-controls" height="100" width="176"></bezier-input>
    </div>
  </div>
`; 

class SettingsTranslation extends HTMLElement {
    constructor() {
      super();
      this.type='Translation';
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
            this.params[e.detail.param]= e.detail.data;
            this.register();
            // If we are changing the mode, we have to update the view
            if (e.detail.param==='mode') this.setDisplay('#bezier-controls', e.detail.data);
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

    setParentId(opId) {
      this.parent = opId;
      this.shadowRoot.querySelector('#mode').setAttribute('parent', opId);
      this.shadowRoot.querySelector('#direction').setAttribute('parent', opId);
      // // this.shadowRoot.querySelector('#origin').setAttribute('parent', opId);
      this.shadowRoot.querySelector('#offset').setAttribute('parent', opId);
      this.shadowRoot.querySelector('#bezier-controls').setAttribute('parent', opId);
    }

    initParams(params) {
      // for each field, we check if we are passed a value and if not we set to 0 or default defined in refs
      let offx = params['offset']>=0 ? params['offset'] : refs.translationDefault['offset'];
      this.shadowRoot.querySelector('#offset')._val = offx;

      let modex = params['mode'] !== '' ? params['mode'] : refs.translationDefault['mode'];
      this.shadowRoot.querySelector('#mode')._value = modex;
      this.setDisplay('#bezier-controls', modex);

      let dir = params['direction'] !== '' ? params['direction'] : refs.translationDefault['direction'];
      this.shadowRoot.querySelector('#direction')._value = dir;

      let controlsx = {... params['bezier-controls'] ? params['bezier-controls'] : refs.translationDefault['bezier-controls']};
      this.shadowRoot.querySelector('#bezier-controls')._controlsValue = controlsx;
    }

    setDisplay(item, mode){
      if (mode==='Bezier') {
        this.shadowRoot.querySelector(item).style.display = 'block';
        return 0;
      }
      this.shadowRoot.querySelector(item).style.display = 'none';
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

window.customElements.define('translation-settings', SettingsTranslation);