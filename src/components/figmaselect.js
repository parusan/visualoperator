//
//  Parameters
//  values: the values in the select, separated by "|"
//  default-value: the default value (the label listed in values)
//  values-icons: the labels of the icons corresponding to each value in values. If there are fewer icons defined or parameter is not set
//                then the icons are not shown 
//   tooltip: the tooltip shown on hover
//   size: the size of the component
//   parent: the parent component: important to identify who should be receiving the event fired when the value is selected
//   id: the id of the field. Should represent the parameter set. Will be sent in the event fired on click

// On value selection, the component returns an event "update-param" with a load "detail" containing the following datapoints:
// data: the id (or index) of the option selection
// data-label: the value selected
// parent: the parent (the target of the event in theory)
// param: the parameter updated (the id of the object)



const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
  :host {
    width: 100%;
    min-width: 12px;
    display: block;
  }

  .figma-select {
    display: flex;
    padding: 8px;
    gap: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    position: relative;
    width: 100%;
    min-width: 120px;
    box-sizing: border-box;
  }
  .figma-select:hover {
    border-color: var(--figma-color-border);
  }

  .figma-select.size-S {
    min-width: 40px;
  }

  .select-label {
    flex: 1;
    white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 10px; /* Fix overflow in flex */
  }

  .figma-select-dropdown {
    position: absolute;
    top: 90%;
    left:0;
    background: rgba(16 16 16 / 1);
    border: 1px solid var(--figma-color-border);
    border-radius: 4px;
    width: 90%;
    z-index: 2;
    padding: 8px 8px 8px 4px;
    box-shadow: var(--elevation-500-modal-window, 0px 2px 14px rgba(0, 0, 0, .15), 0px 0px 0px .5px rgba(0, 0, 0, .2));
    visibility: hidden;
  }

  .figma-select-dropdown.open {
    visibility: visible;
  }

  .option {
    padding: 4px;
    cursor: pointer;
    display: flex;
    line-height: 16px;
    gap: 8px;
  }
  .option:hover {
    background: var(--figma-color-bg-brand);
  }
  .option:not(.selected) .select-icon{
    visibility:hidden;
  }
  .icon-slot {
    width: 16px;
    height: 16px;
    padding: 2px;
    box-sizing: border-box;;
  }
  .option-label {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 10px; /* Fix overflow in flex */
  }

  #select-icon {
      display: none;
  }

  #select-icon.show {
    display: block;
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

  </style>
    <div class="figma-select tooltip tooltipLeft" id="select">
        <figma-icon size="M" type="fixed-space" purpose="default" id="select-icon" class="show"></figma-icon>
        <div class="select-label" id="select-label">Value</div>
        <figma-icon size="M" type="chevron-down" purpose="default" id="select-chevron"></figma-icon>
        <span class="tooltiptext" id="tooltip">Tooltip</span>
        <div class="figma-select-dropdown" id="dropdown"></div>
    </div>
`; 


class FigmaSelect extends HTMLElement {
    static get observedAttributes() {return ['parent', 'default-value', 'id']; }
    constructor() {
      super();
      this.value='';
      this.options=[];
      this.icons=[];
      this.componentId='';
      this.type='';
      this.tooltip = '';
      this.parent='default';
      this.isOpen=false;
      this.defaultValue="";

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowSelect = shadowRoot.querySelector("#select");
      this.shadowDropdown = shadowRoot.querySelector("#dropdown");

  }

  set _value(val){
    // If we are here, we know that the type is ok
    this.setValue(val);
  }

  get _value(){
    return this.value;
  }  

    setId(val) {
      this.componentId = val;
    }

    setTooltip(val) {
        this.tooltip = val;
        this.shadowRoot.querySelector('#tooltip').textContent=val;
      }
      settype(val) {
        this.type = val;
      }
      setParameter(val) {
        this.parameter = val;
      }
      setIndex(val) {
        this.index = val;
      }
      setParent(val) {
        // We initialize the selection value the first time we set the parent of the component
        this.parent=val;
      }

    setValue(val) {

      // We only register a change if the value is different
      if (this.value === val) {
        return 0;
      }

      let index = this.options.indexOf(val);

      // if it is different, we check if the value is valid, if not we don't do anything
      if (index < 0) {
        return 0
      }

      this.value=val;

      // We remove the check in front of all the options
      let options = this.shadowRoot.querySelectorAll('.option');
      for (let i=0; i<options.length; i++) {
        options[i].classList.remove('selected'); 
      }
      // We add the check in front of the right option
      this.shadowRoot.querySelector("#option"+index).classList.add('selected');
      // Then we change the icon inside the main component and set the label
      this.shadowRoot.querySelector('#select-label').innerHTML = val;
      this.shadowRoot.querySelector("#select-icon").setAttribute('type', this.icons[index])

    }

    updateValue(value){
      this.setValue(value);
      // Finally we send an event to register the change selected in the main component
      this.register(value);
    }

    setSize(size){
      if (size==="S") this.shadowRoot.querySelector("#select").classList.add('size-S');
    }

    initOptions(opts) { // initiatializes the options in the list
        this.options=[];
        opts = opts?.split('|') ?? '';
        if (opts.length > 0 ) {
            for (let i=0;i<opts.length; i++){
                this.options.push(opts[i]);
                const optionTemplate = document.createElement('template');
                let isSelected = i===0 ? 'selected' : '' ; // If this is the first element we tag it as selected
                let thisId =  'option' + i;
                optionTemplate.innerHTML = `<div class="option ${isSelected}" id="${thisId}">
                <div class="icon-slot"><figma-icon size="M" type="check" purpose="default" class="select-icon"></figma-icon></div>
                  <div class="option-label">${opts[i]}</div> 
              </div>`;
              this.shadowDropdown.append(...optionTemplate.content.children);
              this.shadowRoot.querySelector("#"+thisId).onmouseup = (e) => this.optionUp(e, i, opts[i], i);
            }
            // Then we set the current value to the first value
            // We check first if there is a default option
            // We add the check in front of the right option
            this.shadowRoot.querySelector("#option"+0).classList.add('selected');
            // Then we change the icon inside the main component and set the label
            this.shadowRoot.querySelector('#select-label').innerHTML = opts[0];
            this.shadowRoot.querySelector("#select-icon").setAttribute('type', this.icons[0])
        }
      }

    initIcons(val) { // initiatializes the icons corresponding to the values
      if(val){
        let nbIcons = val.split('|');
        let nbOptions = this.options.length;
        if (nbIcons === nbOptions){
          this.shadowRoot.querySelector('#select-icon').classList.add("show");
          val = val?.split('|') ?? '';
          for (let i=0; i<nbOptions; i++) {
              if (val.length>i) {
                  this.icons.push(val[i])
              } else {
                  this.icons.push('default');
              }
              if (i===0) this.shadowRoot.querySelector('#select-icon').setAttribute('type',val[i]); // If it is the first icon we initialize the component
          }
        }
      }
      this.shadowRoot.querySelector('#select-icon').classList.remove("show");
    }

    closeOrNot(e, id){
        e.stopPropagation();
        let inComponent = false;
        // We checked if we clicked on one of the elemets that component the select
        let idsList = ['select', 'select-icon', 'select-label', 'select-chevron']
        if (idsList.includes(e.composedPath()[0].id)) { 
            // And then, if we clicked on a select, if the select is contained of the parent slot of the select
            // By checking the IDs of all the parent elements
            for (let i=0; i<e.composedPath().length; i++) {
                if (e.composedPath()[i].id === id) inComponent = true; 
                
            }
            if (inComponent && !this.isOpen) {this.openDropdown(); return 0}
            if (inComponent && this.isOpen) {this.closeDropdown(); return 0}
        }
        this.closeDropdown();
    }

    optionUp(e, index, value, id) {
        e.stopPropagation();
        this.updateValue(value, id);
        this.closeDropdown();
    }

    openDropdown() {
        this.shadowDropdown.classList.add('open');
        this.isOpen=true;
    }

    closeDropdown() {
        this.shadowDropdown.classList.remove('open');
        this.isOpen=false;
    }

    register(val){
        this.val=val;
        this.shadowRoot.dispatchEvent(new CustomEvent("update-param", {
            detail: { "data-index": val, data:val, target: this.parent, param:this.type},
            composed: true,
            bubbles: true
        }));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name==='parent') {this.setParent(newValue);}
        if(name==='id') {this.setId(newValue);}
     }

     connectedCallback(){ // Called when inserted into DOM
      // Initialization of the attributes
      this.setId(this.getAttribute('id'));
      this.initOptions(this.getAttribute('values'));
      document.addEventListener("mouseup", (e) => this.closeOrNot(e, this.componentId)) ;
      this.initIcons(this.getAttribute('values-icons'));  
      this.setTooltip(this.getAttribute('tooltip'));
      this.setSize(this.getAttribute('size'));
      this.defaultValue=this.getAttribute('default-value');
      this.type=this.getAttribute('role');
  }



}

window.customElements.define('figma-select', FigmaSelect);