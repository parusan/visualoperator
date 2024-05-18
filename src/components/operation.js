
import * as refs from '../res/refs.js';
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>

  .operation-preview {
    padding: 0 8px 0 16px;
    display: flex;
    gap: 4px;
  }
  .operation-preview > .figma-select{
    flex:1;
    width: 10px;
  }
  .operation-preview > .label {
    width: 40px;
  }

  .label-row {
    display: flex;
    padding: 0 8px;
  }
  .label-row > .label {
    flex: 1;
  }
  .label {
    color: var(--figma-color-text-secondary)
  }
  .label-main {
    font-weight: 600;
    line-height: 24px;
  }
  #settings{
    position: fixed;
    top: 24px;
    left:8px;
    right: 8px;
    bottom: 0px;
    background: var(--figma-color-bg);
    border: 1px solid var(--figma-color-border);
    border-radius: 4px;
    z-index: 2;
    padding: 8px 8px 8px 4px;
    box-shadow: var(--elevation-500-modal-window, 0px 2px 14px rgba(0, 0, 0, .15), 0px 0px 0px .5px rgba(0, 0, 0, .2));
    visibility: hidden;
  }

  #settings.open {
    visibility: visible;
  }

  #overview {
    line-height: 32px;
    overflow: hidden;
  }

  .spacer-bottom {
    border-bottom: 1px solid var(--figma-color-border);
  }
  </style>
  <div class="operation-container">
    <div class="operation-preview">
      <icon-button class="small-flex" id="open" action="open-settings" icon="translation" tooltip="Open settings"></icon-button>
      <figma-select values="Translation|Rotation" default-value="Translation" id="type" class='figma-select' size="S" tooltip="Select type of transformation">
      </figma-select>
      <div class="label" id="overview">Bézier</div>
      <icon-button class="small-flex" id="del" action="del" icon="remove" tooltip="Remove operation"></icon-button>
    </div>
    <div id="settings">
      <div id="settings-header spacer-bottom">
        <div class="label-row">
          <div class="label label-main" id="title">Settings</div>
          <icon-button class="small-flex" id="close" action="close-settings" icon="close" tooltip="Close"></icon-button>
        </div>
      </div>
      <div id="settings-body">
      </div>
    </div>
  </div>
`; 

class Operation extends HTMLElement {
    constructor() {
      super();
      this.componentId='';
      this.details={};
      this.params={};
      this.type="Translation";
      this.parent="";

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

        // We listen for events from buttons
        this.addEventListener("trigger", function(e) { 
          if (e.detail.parent===this.componentId && e.detail.action==="open-settings") {
            console.log('test')
            if (e.detail.parent===this.componentId) this.openSettings();             
          }
          if (e.detail.parent===this.componentId && e.detail.action==="close-settings") {
            console.log('test')
            if (e.detail.parent===this.componentId) this.closeSettings();             
          }
        }); 

        // We listen to changes of the settings of the flow
        this.addEventListener("update-params", function(e) {
          // When we receive a request to update the params
          // If it is inside this component, we update them, and then send all the params at once to the plugin
          if (e.detail.parent===this.componentId) 
          { 
              if (e.detail.param==='type') {
                this.setType(e.detail['data-label'])
                // this.register();
              }
          }
  
        });
  }

  set _details(details){
    console.log(details);
    // If we are here, we know that the type is ok
    this.details={...details};
    this.params={...details.params};
    this.setType(details.type);
  }

  get _details(){
    return this.details;
  }


  openSettings(){this.shadowRoot.querySelector('#settings').classList.add('open'); }
  closeSettings(){this.shadowRoot.querySelector('#settings').classList.remove('open');}


    setId(val) {
      this.componentId = val;
      // Setting the parent of the UI elements with actions
      this.shadowRoot.querySelector('#open').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#close').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#type').setAttribute('parent', this.componentId);

      // We also set the action of the del button here
      this.shadowRoot.querySelector('#del').setAttribute('action', "del-op|"+this.componentId);
    }

    setFlow(flowId){
      if(flowId) {
        this.flowId=flowId;
        this.shadowRoot.querySelector('#del').setAttribute('parent', this.flowId);
      }
    }

    setType(type){
      this.type=type;
      this.initView(type);
    }

    initView(type) {
      if (type==="Translation"){
        this.shadowRoot.querySelector('#type').setAttribute('default-value', 'Translation');
        this.shadowRoot.querySelector('#open').setAttribute('icon', 'translation');
        this.shadowRoot.querySelector('#overview').innerHTML=this.getTranslationOverview();
      }
      if (type==="Rotation"){
        this.shadowRoot.querySelector('#type').setAttribute('default-value', 'Rotation');
        this.shadowRoot.querySelector('#open').setAttribute('icon', 'rotation');
        this.shadowRoot.querySelector('#overview').innerHTML=this.getRotationOverview();  
      }
    }
    
    // sets a quick overview of the operation
    getTranslationOverview() {
        let label = "";
        if (this.params.type==="Bezier") label="Bezier";
        if (this.params.type=="Fixed") label=this.params['base-x']+'px'
        return label;
    }

    // sets a quick overview of the operation
    getRotationOverview() {
      let label = "";
      if (this.params.type==="Bezier") label="Bezier";
      if (this.params.type=="Fixed") label=this.params['angle']+'°'
      return label;
    }


    register(){
      this.shadowRoot.dispatchEvent(new CustomEvent("update-flow", {
        detail: { data: this.params, repeat:this.repeat, id: this.componentId},
      composed: true,
      bubbles: true
    }));
    } 

    connectedCallback(){ // Called when inserted into DOM
      // Initialization of the attributes
      this.setFlow(this.getAttribute('flow'));
      this.setId(this.getAttribute('id'));
  }


}

window.customElements.define('op-details', Operation);