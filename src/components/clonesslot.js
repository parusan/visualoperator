
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
  <div class="section spacer-bottom">
  <div class="row">
    <div class="label-main">Clones</div>
  </div>
  <div class="row ">
    <text-input id="clones-x" tooltip="Number of horizontal clones" default-value="6" icon="horizontal-dots">
    </text-input>
  </div>
</div>
`; 

class ClonesSlot extends HTMLElement {
    constructor() {
      super();
      this.type='clones';
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
        }

        });
  }

    setId(val) {
      this.componentId = val;
    }

    setParentId() {
      this.shadowRoot.querySelector('#clones-x').setAttribute('parent', this.componentId);
      // this.shadowRoot.querySelector('#clones-y').setAttribute('parent', this.componentId);
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

window.customElements.define('clones-slot', ClonesSlot);