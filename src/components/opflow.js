import * as refs from '../res/refs.js';
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
    color: var(--figma-color-text-secondary);
    white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  }
  .label-main {
    font-weight: 600;
    line-height: 32px;
  }
  </style>
  <div class="flow-container">
    <div class="label-row">
      <div class="label label-main" id="title">Target</div>
      <text-input id="repeat" tooltip="Number of repetitions" default-value="5" icon="repeat" size="S">
      </text-input>
      <icon-button class="small-flex" id="del" action='del-flow' icon="remove" tooltip="Delete flow"></icon-button>
      <icon-button class="small-flex" id="add" action='add-op' icon="add" tooltip="Add operation to flow"></icon-button>
    </div>
    <div id="ops-container">
    </div>
  </div>
`; 

class OpFlow extends HTMLElement {
    constructor() {
      super();
      this.componentId='';
      this.ops=[];
      this.repeat=0;
      this.name="";

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
          if (e.detail.parent===this.componentId && e.detail.action==="add-op") {
            this.addOperation();    
          }
          console.log(e.detail.action);
          if (e.detail.parent===this.componentId && e.detail.action.includes("del-op")){
            if(e.detail.action.split("|").length===2) {
              this.removeOperation(e.detail.action.split("|")[1]);
            }
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

    set _ops(newops){
        // if this is not empty, we now go through the list and create all the necessary components
        if (Array.isArray(newops) && newops.length>0) {
          this.ops=[];
          console.log(this.ops);
          for (let i=0; i<newops.length; i++){
            let op = newops[i];
            // First we check if the type is a correct type or we don't add it
            if (refs.types.findIndex(type => type===op.type)>=0) {
              op.flow=this.componentId;
              op.id=this.getID();
              // Then we add to actual data of the flow
              this.ops.push(op);
              // And finally we add it to the view and create the component
              this.addOpToView(op);
            }
          }
        }
    }

    get _ops(){ 
      return this.ops;
    }

    setTitle(title){
      this.name=title;
      this.shadowRoot.querySelector('#title').textContent=title;
    }

    setId(val) {
      this.componentId = val;
      // Setting the parent of the UI elements with actions
      this.shadowRoot.querySelector('#add').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#del').setAttribute('parent', this.componentId);
      this.shadowRoot.querySelector('#repeat').setAttribute('parent', this.componentId);
    }

    setRepeat(val) {
      if (val) {
        this.repeat = val;
        return;
      }
      this.repeat=5;
      this.shadowRoot.querySelector('#repeat').setAttribute('default-value', this.repeat);
    }

    // Generates a new default Transformation. Sets the default parameters
    getOperation() {
      // Then set that in a default flow object and go
      let translation={
        id: this.getID(),
        flow: this.componentId,
        type:"Translation",
        params: {...refs.translationDefault}
      };
      return translation;
    }

    addOperation(){
      console.log('Adding default transformation');
      let op={...this.getOperation()};
      this.ops.push(op);
      console.log(op);
      // Then we add it to the UI
      this.addOpToView(op);
    }

    addOpToView(op){
      console.log('adding to view ' + JSON.stringify(op))
      const opTemplate = document.createElement('template');
      opTemplate.innerHTML = `<op-details class="tf" id="${op.id}" flow="${op.flow}"></op-details>`;
      this.shadowRoot.getElementById('ops-container').append(...opTemplate.content.children);

      let details = {
        type: op.type,
        params: op.params
      }

      customElements.whenDefined("op-details").then(() => {
        this.shadowRoot.getElementById(op.id)._details=details;
     });     
    }

    getID(){
      let id=Date.now();  
      let id2=Math.floor(Math.random()*1000);
      return id+"-"+id2
    }

    removeOperation(id){
      let index=this.ops.findIndex( op => op.id === id);
      // Remove from the dom and from the parameters if we find the element
      if (index>=0) {
        this.ops.splice(index, 1);
        this.shadowRoot.getElementById(id).remove();
      }
      else {
        console.log('Element not found');
      }
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
      this.setTitle(this.getAttribute('name'));
  }


}

window.customElements.define('op-flow', OpFlow);