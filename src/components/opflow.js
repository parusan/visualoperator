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
  #add-op-container {
    display: flex;
    flex-direction: row;
    gap: 12px;
    padding: 0 8px 0 16px;
    align-items: center;
    opacity: 0.6;
  }
  </style>
  <div class="flow-container">
    <div class="label-row">
      <div class="label label-main" id="title">Target</div>
      <text-input id="repeat" tooltip="Number of repetitions" default-value="5" icon="repeat" size="S">
      </text-input>
      <icon-button class="small-flex" id="del" action='del-flow' icon="remove" tooltip="Delete flow"></icon-button>
   </div>
    <div id="ops-container">
    </div>
    <div id="add-op-container">
     <icon-button class="small-flex" id="add" action='add-op' icon="add" tooltip="Add operation to flow"></icon-button>
     <div class="label" id="title">Add operation</div>
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

        // We listen for events from buttons
        this.addEventListener("trigger", function(e) { 
          if (e.detail.parent===this.componentId && e.detail.action==="add-op") {
            this.addOperation();    
          }
          if (e.detail.parent===this.componentId && e.detail.action.includes("del-op")){
            if(e.detail.action.split("|").length===2) {
              this.removeOperation(e.detail.action.split("|")[1]);
            }
          }
        });

        // We listen to changes of the change to the parameters of the operations in the flow
        this.addEventListener("update-flow", function(e) {
          // When we receive a request to update the type
          // If we find the operation in the flow, we update it
          let index = this.ops.findIndex(x => x.id === e.detail.id);
          if (index>=0) this.updateFlowParams(index, e.detail.data, e.detail.type);
        });

        // We listen to changes of the number of repeat coming directly from the text input
        this.addEventListener("update-param", function(e) {
          if (e.detail.param==='repeat' && e.detail.target===this.componentId)
          {
            this.updateRepeat(e.detail.data);
          }

        });
    }

    set _ops(newops){
        // if this is not empty, we now go through the list and create all the necessary components
        if (Array.isArray(newops) && newops.length>0) {
          this.ops=[];
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

    set _repeat(repeat){
      this.initRepeat(repeat);
    }

    get _repeat() {
      return this.repeat;
    }

    updateFlowParams(index, params, type){
      this.ops[index].params={...params};
      this.ops[index].type=type;
      this.register();
    }

    register(){
      this.shadowRoot.dispatchEvent(new CustomEvent("update-settings", {
        detail: { data: this.ops, type:'flow', id: this.componentId, target:'root', repeat: this.repeat},
      composed: true,
      bubbles: true
    }));
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

    initRepeat(val) {
      if (val) {
        this.repeat = val;
      }
      this.shadowRoot.querySelector('#repeat')._val=this.repeat;
    }

    updateRepeat(repeat){
      this.repeat=repeat;
      this.register();
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
      // And we update the data at the plugin level
      this.register();
    }

    addOpToView(op){
      // console.log('adding to view ' + JSON.stringify(op))
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
        // Once deleted, we let the plugin know
        this.register();
      }
      else {
        console.log('Element not found');
      }
   }


    connectedCallback(){ // Called when inserted into DOM
      // Initialization of the attributes
      this.setId(this.getAttribute('id'));
      this.setTitle(this.getAttribute('name'));
  }


}

window.customElements.define('op-flow', OpFlow);