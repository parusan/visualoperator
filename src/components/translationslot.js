
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

  #main-row {
    position: relative;
  }

  #dialog{
    position: absolute;
    top: 90%;
    left:8px;
    background: var(--figma-color-bg);
    border: 1px solid var(--figma-color-border);
    border-radius: 4px;
    width: calc(100% - 24px);
    z-index: 2;
    padding: 8px 8px 8px 4px;
    box-shadow: var(--elevation-500-modal-window, 0px 2px 14px rgba(0, 0, 0, .15), 0px 0px 0px .5px rgba(0, 0, 0, .2));
    visibility: hidden;
  }

  #dialog.open {
    visibility: visible;
  }

  </style>
  <div class="section section-spacing spacer-bottom">
    <div class="row" id='main-row'>
      <icon-switch class="small-flex" id="open-dialog" icon="translation-horizontal" tooltip="Translation settings"></icon-switch>
      <div class="label-main">Translation</div>
      <div id='dialog'>
        <div class="row">
          <figma-select values="Smooth|Fixed" values-icons="curve|fixed-space" id="mode" class='figma-select' tooltip="Type of spacing">
          </figma-select>
          <icon-toggle class="small-flex" id="origin" values="side|center" icon-0="side-to-side" icon-1="center-to-center" tooltip-0="side to side" tooltip-1="center to center"></icon-toggle>
        </div>
        <div class="row">
          <text-input id="x-base" tooltip="Horizontal gap" default-value="16" icon="horizontal-arrows" unit="px">
          </text-input>
          <text-input id="y-base" tooltip="Vertical gap" default-value="0" icon="vertical-arrows" unit="px">
          </text-input>
        </div>
        <div class="row" id="canvascontainer">
          <bezier-input id="curve-controls" height="100" width="200"></bezier-input>
        </div>
      </div>
    </div>
  </div>
`; 

class TranslationSlot extends HTMLElement {
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


      // We listen for events to close the dialog from the dialog
      this.addEventListener("trigger", function(e) { 
        if (e.detail.parent===this.componentId && e.detail.action==="close-dialog") {
          // We trigger the switch that manages the dialog
          this.shadowRoot.querySelector('#open-dialog').dispatchEvent(new CustomEvent("reset-switch", {
            detail: {parent: this.componentId},
            composed: true,
            bubbles: true
          }));         
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
      this.shadowRoot.querySelector('#origin').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#x-base').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#y-base').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#curve-controls').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#open-dialog').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#close-dialog').setAttribute('parent', this.componentId);
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
      this.register(this.val);       
  }


}

window.customElements.define('translation-slot', TranslationSlot);