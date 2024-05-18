
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
  <div class="section section-spacing spacer-bottom">
    <div class="row">
      <div class="label sublabel">Horizontal</div>
    </div>
    <div class="row">
        <figma-select values="Smooth|Fixed" values-icons="curve|fixed-space" id="mode-x" class='figma-select' tooltip="Type of spacing"></figma-select>
        <text-input id="x-base" tooltip="Horizontal gap" default-value="16" icon="horizontal-arrows" unit="px"> </text-input>
    </div>
    <div class="row" id="canvascontainer">
      <bezier-input id="curve-controls" height="100" width="184"></bezier-input>
    </div>
  </div>
  <div class="section section-spacing spacer-bottom">
    <div class="row">
      <div class="label sublabel">Vertical</div>
    </div>
    <div class="row">
        <figma-select values="Smooth|Fixed" values-icons="curve|fixed-space" id="mode-y" class='figma-select' tooltip="Type of spacing">   </figma-select>
        <text-input id="y-base" tooltip="Vertical gap" default-value="0" icon="vertical-arrows" unit="px">  </text-input>
    </div>
    <div class="row" id="canvascontainer">
    <bezier-input id="curve-controls-y" height="100" width="184"></bezier-input>
  </div>
  </div>
`; 

class SettingsTranslation extends HTMLElement {
    constructor() {
      super();
      this.type='translation';
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
        }

      });


  }

  set _params(params){
    console.log(params);
    // If we are here, we know that the type is ok
    this.params={...params};
    this.initParams(params);
  }

  get _deta_paramsils(){
    return this.params;
  }


    setId(val) {
      this.componentId = val;
    }
    switchMode(val) {
      if (val['data-label']==='Smooth') {this.showCurve(); return 0;}
      this.hideCurve();
    }

    showCurve() {
      this.shadowRoot.querySelector('#canvascontainer').style.display = "block";
    }

    hideCurve() {
      this.shadowRoot.querySelector('#canvascontainer').style.display = "none";
    }
    setParentId(opId) {
      this.shadowRoot.querySelector('#mode-x').setAttribute('parent', opId);
      this.shadowRoot.querySelector('#mode-y').setAttribute('parent', opId);
      // // this.shadowRoot.querySelector('#origin').setAttribute('parent', opId);
      this.shadowRoot.querySelector('#x-base').setAttribute('parent', opId);
      this.shadowRoot.querySelector('#y-base').setAttribute('parent', opId);
      this.shadowRoot.querySelector('#curve-controls').setAttribute('parent', opId);
    }

    initParams(params){

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
      this.setParentId(this.getAttribute('op'));
      this.register(this.val);
  }


}

window.customElements.define('translation-settings', SettingsTranslation);