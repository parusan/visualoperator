
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>

  .flow-container {
    padding: 8px 0;
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
  </style>
  <div class="flow-container">
    <div class="label-row">
      <div class="label label-main" id="title">Target</div>
      <text-input id="repeat" tooltip="Number of repetitions" default-value="5" icon="repeat" size="S">
      </text-input>
      <icon-button class="small-flex" id="add" action='del-t' icon="remove" tooltip="Delete flow"></icon-button>
      <icon-button class="small-flex" id="add" action='add-t' icon="add" tooltip="Add operation to flow"></icon-button>
    </div>
    <div id="transformations-container">
    </div>
  </div>
`; 

class TransformationsFlow extends HTMLElement {
    constructor() {
      super();
      this.componentId='';
      this.params={};
      this.repeat=0;

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

  //     this.addEventListener("update-params", function(e) {
  //       // When we receive a request to update the params
  //       // If it is inside this component, we update them, and then send all the params at once to the plugin
  //       if (e.detail.parent===this.componentId) 
  //       { 
  //           this.params[e.detail.param]= {
  //             value: e.detail.data,
  //             label: e.detail['data-label']
  //           } 
  //           this.register();
  //           // If we are changing the mode, we have to update the view
  //           if (e.detail.param==="mode") {
  //             this.switchMode(e.detail)
  //           }
  //           // If the param is angle, we also send that to update the view in the origin selector
  //           if (e.detail.param==='angle') {
  //             this.shadowRoot.querySelector('#origin').setAttribute('angle', e.detail.data )
  //           }
  //       }
  //       });

        // We listen for events from buttons
        this.addEventListener("trigger", function(e) { 
          if (e.detail.parent===this.componentId && e.detail.action==="add-t") {
            this.addTransformation();    
          }
        });

        // We listen to changes of the settings of the flow
        this.addEventListener("update-params", function(e) {
          // When we receive a request to update the params
          // If it is inside this component, we update them, and then send all the params at once to the plugin
          if (e.detail.parent===this.componentId) 
          { 
              if (e.detail.param==='repeat') {
                this.repeat=e.detail.data;
                this.register();
              }
          }
  
        });
 }

    setId(val) {
      this.componentId = val;
      this.shadowRoot.querySelector('#title').textContent=val;

      // Setting the parent of the UI elements with actions
      this.shadowRoot.querySelector('#add').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#repeat').setAttribute('parent', this.componentId);
    }

    setRepeat(val) {
      if (val) {
        this.repeat = val;
        return;
      }
      this.repear=5;
      
    }

    addTransformation(){
      console.log('Adding default transformation');
    }

    initDefault(){
      // Init number of repetitions
      this.shadowRoot.querySelector('#repeat').setAttribute('default-value', this.repeat);

      // Init default transformation
      console.log('add first transformation here');
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
      this.setId(this.getAttribute('id'));
      this.setRepeat(this.getAttribute('repeat'));
      this.initDefault();
  }


}

window.customElements.define('transformations-flow', TransformationsFlow);