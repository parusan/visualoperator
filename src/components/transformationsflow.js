
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
 }

    setId(val) {
      this.componentId = val;
      this.shadowRoot.querySelector('#title').textContent=val;

      // Setting the parent of the UI elements with actions
      this.shadowRoot.querySelector('#add').setAttribute('parent', this.componentId);
    }

    addTransformation(){
      console.log('Adding default transformation');
    }

    initDefaul(){
      console.log('add first transformation here');
    }

    connectedCallback(){ // Called when inserted into DOM
      // Initialization of the attributes
      this.setId(this.getAttribute('id'));
      this.initDefaul();
  }


}

window.customElements.define('transformations-flow', TransformationsFlow);