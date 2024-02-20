
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>
    :host {
        width: 100%;
        min-width: 120px;
    }
  .figma-select {
    display: flex;
    padding: 8px;
    gap: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    position: relative;
  }
  .figma-select:hover {
    border-color: var(--figma-color-border);
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
  <div>
    <div class="figma-select tooltip tooltipLeft" id="select">
        <figma-icon size="M" type="fixed-space" purpose="default" id="select-icon"></figma-icon>
        <div class="select-label" id="select-label">Value</div>
        <figma-icon size="M" type="chevron-down" purpose="default" id="select-chevron"></figma-icon>
        <span class="tooltiptext" id="tooltip">Tooltip</span>
        <div class="figma-select-dropdown" id="dropdown"></div>
    </div>
    </div>
`; 


class FigmaSelect extends HTMLElement {
    static get observedAttributes() {return ['parent']; }
    constructor() {
      super();
      this.value='';
      this.options=[];
      this.icons=[];
      this.componentId='';
      this.tooltip = '';
      this.parent='default';
      this.isOpen=false;

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowSelect = shadowRoot.querySelector("#select");
      this.shadowDropdown = shadowRoot.querySelector("#dropdown");

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
        this.setValue(0, this.options[0], 0); 
      }

    setValue(index, val, optionId) {

      // We remove the check in front of all the options
      let options = this.shadowRoot.querySelectorAll('.option');
      for (let i=0; i<options.length; i++) {
        options[i].classList.remove('selected'); 
      }
      // We add the check in front of the right option
      this.shadowRoot.querySelector("#option"+optionId).classList.add('selected');
      // Then we change the icon inside the main component and set the label
      this.shadowRoot.querySelector('#select-label').innerHTML = val;
      this.shadowRoot.querySelector("#select-icon").setAttribute('type', this.icons[index])
 
    // Finally we send an event to register the value selected in the main component
        this.register(index);

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
              this.shadowRoot.querySelector("#"+thisId).onmouseup = (e) => this.optionUp(e, i, opts[i], i)
              
            }
        }
      }

      initIcons(val) { // initiatializes the icons corresponding to the values
        let nbOptions = this.options.length;
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


    connectedCallback(){ // Called when inserted into DOM
        // Initialization of the attributes
        this.setId(this.getAttribute('id'));
        document.addEventListener("mouseup", (e) => this.closeOrNot(e, this.selectId)) ;
        this.initOptions(this.getAttribute('values'));
        this.initIcons(this.getAttribute('values-icons'));
        this.componentId=this.getAttribute('id');
        this.setTooltip(this.getAttribute('tooltip'));
        this.type=this.getAttribute('type');
        this.parameter=this.getAttribute('parameter');
        this.index=this.getAttribute('index');     

    }

    closeOrNot(e, id){
        e.stopPropagation();
        let inComponent = false;
        // We checked if we clicked on one of the elemets that component the select
        let idsList = ['select', 'select-icon', 'select-label', 'select-chevron']
        if (idsList.includes(e.composedPath()[0].id)) { 
            // And then, if we clicked on a select, if the select in contained of the parent slot of the select
            // By checking the IDs of all the parent elements
            for (let i=0; i<e.composedPath().length; i++) {
                if (e.composedPath()[i].id === this.parent) inComponent = true; 
                
            }
            if (inComponent && !this.isOpen) {this.openDropdown(); return 0}
            if (inComponent && this.isOpen) {this.closeDropdown(); return 0}
        }
        this.closeDropdown();
    }

    optionUp(e, index, value, id) {
        e.stopPropagation();
        this.setValue(index, value, id);
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
        this.shadowRoot.dispatchEvent(new CustomEvent("update-params", {
            detail: { data: val, "data-label":this.options[val], parent: this.parent, param:this.id  },
            composed: true,
            bubbles: true
        }));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name==='parent') { this.setParent(newValue);}
     }


}

window.customElements.define('figma-select', FigmaSelect);