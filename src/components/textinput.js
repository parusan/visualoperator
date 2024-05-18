
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>

  :host *{
    font-family: Inter, sans-serif;
    font-size: 11px;
    color: var(--figma-color-text);
  }

  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
  }

  .input.size-S{
    height: 32px;
    line-height: 32px; 
    padding: 0;
  }

  input {
    background: transparent;
    color: var(--figma-color-text);
    font-size: 11px;
    font-family: Inter, sans-serif;
    border:1px solid transparent;
    border-radius: 0;
    outline: none;
    padding: 4px;
    width: 40px;
  }

  .input.size-S input{
    width: 24px;
  }

  input:hover {
    border-color: var(--figma-color-border);
  }
  input:active, input:focus{
    border-color: var(--figma-color-border-selected);
  }

  .tooltip {
    position: relative;
  }
  .tooltip .tooltiptext {
  visibility: hidden;
  font-size: 10px;
  line-height: 12px;
  background-color: rgba(0 0 0 / 0.6);
  color: var(--figma-color-text-secondary);
  text-align: center;
  padding: 6px;
  border-radius: 4px;
  position: absolute;
  top: 140%;
  left: 0;
  z-index: 1;
  min-width: 96px;

}
.tooltip .tooltiptext.tooltipLeft {
  transform: translateX(90%);
}
.tooltip .tooltiptext.tooltipRight {
  transform: translateX(-90%);
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  animation: fadeIn 1s forwards;
  visibility: visible;
}

@keyframes fadeIn {
    0% { opacity: 0;visibility: hidden; }
    1% { opacity: 0;visibility: visible; }
    85% { opacity: 0; }
    100% { opacity: 1; }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
:host .label {
  color: var(--figma-color-text-secondary)
}
:host .unit {
  color: var(--figma-color-text-secondary)
}

  </style>
  <div class="input scopped-settings" id="input">
  <label class="label tooltip tooltipLeft" for="value-input">
    <figma-icon size="M" type="horizontal-dots" purpose="default" id="icon"></figma-icon>
      <span class="tooltiptext" id="tooltip">Number of horizontal clones</span>
    </label>
  <input id="value-input" value="5" min="1" type="number" step="1">
  <div class="unit" id="unit"></div>
  </div> 
`; 

class TextInput extends HTMLElement {
  static get observedAttributes() {return ['parent', 'default-value']; }
    constructor() {
      super();
      this.componentId='';
      this.val=5;
      this.tooltip="";
      this.parent="";
      this.size="M"

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

  }

    setValue(val) {
      this.shadowRoot.querySelector('#value-input').value = val;
      this.val=val;
      this.register(this.val); 
    }
    setTooltip(val) {
      this.tooltip=val;
      this.shadowRoot.querySelector('#tooltip').textContent=val;
    }
    setIcon(val) {
      this.shadowRoot.querySelector('#icon').setAttribute('type', val);
    }
    setUnit(val) {
      this.shadowRoot.querySelector('#unit').textContent=val;
    }
    setParent(val) {
      // We initialize the selection value the first time we set the parent of the component
        this.parent=val;
          // We register the component a first time in the whole plugin
          this.register(this.val); 
    }
    setSize(size){
      if(size){
        if (size==="S"){
          this.size=size;
          this.shadowRoot.querySelector("#input").classList.add("size-"+size);
        }
      }
    }

    register(val){
      // First we need to check the value and do some clean up
      if (val<1){
        this.setValue(1);
        return;
      }
      if (!Number.isInteger(val)) {
        this.setValue(Math.floor(val));
        return;       
      }
      this.val=val; 
      this.shadowRoot.dispatchEvent(new CustomEvent("update-params", {
        detail: { data: val, "data-label":'', parent: this.parent, param:this.id},
        composed: true,
        bubbles: true
    }));
    } 

    connectedCallback(){ // Called when inserted into DOM
      // Initialization of the attributes
      this.componentId=this.getAttribute('id');
      this.shadowRoot.querySelector('#value-input').addEventListener('change', () => {
        this.register(this.shadowRoot.querySelector('#value-input').value);
      });
      this.setTooltip(this.getAttribute('tooltip'));
      this.setIcon(this.getAttribute('icon'));
      this.setUnit(this.getAttribute('unit'));
      this.setValue(this.getAttribute('default-value'));
      this.setSize(this.getAttribute('size'));      
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if(name==='parent') { this.setParent(newValue);}
    if(name==='default-value') { this.setValue(newValue);}
 }



}

window.customElements.define('text-input', TextInput);