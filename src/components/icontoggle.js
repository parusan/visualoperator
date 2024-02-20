
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>

  .icon-toggle {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .button-icon {
    font-size: 11px;
    color: var(--figma-color-text);
    position: relative;
    cursor: pointer;
    padding: 4px;
    border: none;
    cursor: pointer;
    border: 1px solid transparent;
    background: var(--figma-color-bg);
    border-radius: 4px;
  }

  .button-icon.active {
    background: var(--figma-color-bg-secondary);
    display: block;
  }

  .button-icon:hover {
    border-color: var(--figma-color-border);
  }

  .button-icon:active {
    border-color: var(--figma-color-border-selected);
  }
  .icon-toggle .button-icon:not(.active) {
    display: none;
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
  <div class="icon-toggle">
  <button class="button-icon tooltip active" id="button-0">
    <figma-icon size="L" type="side-to-side" purpose="default" id="icon-0"></figma-icon>
    <span class="tooltiptext tooltipRight" id="tooltip-0">Side to side</span>
  </button>
  <button class="button-icon tooltip" id="button-1">
    <figma-icon size="L" type="center-to-center" purpose="default" id="icon-1"></figma-icon>
    <span class="tooltiptext tooltipRight" id="tooltip-1">Center to center</span>
  </button>
</div>
`; 


class IconToggle extends HTMLElement {
    static get observedAttributes() {return ['parent']; }
    constructor() {
      super();
      this.value=''; // Value will always be either 0 or 1
      this.parent='';
      this.icon0='';
      this.icon1='';
      this.componentId='';
      this.tooltip0 = '';
      this.tooltip1 = '';
      this.value=[];

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

  }


    setTooltip(val, tooltip) {
        if (val===0) this.tooltip0 = tooltip;
        if (val===1) this.tooltip1 = tooltip;
        this.shadowRoot.querySelector('#tooltip-'+val).textContent=tooltip;
      }

    setIcon(val, icon) {
      // Then we change the icon inside the main component
      if (val===0) this.icon0 = icon;
      if (val===1) this.icon1 = icon;     
      this.shadowRoot.querySelector("#icon-"+val).setAttribute('type', icon)
    }

    setParent(val) {
        // We initialize the selection value the first time we set the parent of the component
          this.parent=val;
            // We register the component a first time in the whole plugin
            this.register(0); 
      }

      setValues(val){
        let values = val.split("|")
        if (values.length===2) this.values=[]; this.values=[...values];
      }

    update(id){
        // We hide all the buttons and show the right one
        let buttons = this.shadowRoot.querySelectorAll('.button-icon');
        for (let i=0; i<buttons.length; i++) {
            buttons[i].classList.remove('active');
        }      
        this.shadowRoot.querySelector('#button-'+id).classList.add('active');
        this.register(id);
    }

    register(val){
      this.val=val;
      this.shadowRoot.dispatchEvent(new CustomEvent("update-params", {
        detail: { data: val, "data-label":this.values[val], parent: this.parent, param:this.id},
        composed: true,
        bubbles: true
    }));
    }

    connectedCallback(){ // Called when inserted into DOM
        // Initialization of the attributes
        this.componentId=this.getAttribute('id');
        this.type=this.getAttribute('type');
        this.parameter=this.getAttribute('parameter');
        this.setIcon(0, this.getAttribute('icon-0'));
        this.setIcon(1, this.getAttribute('icon-1'));
        this.setTooltip(0, this.getAttribute('tooltip-0'));
        this.setTooltip(1, this.getAttribute('tooltip-1'));
        this.setValues(this.getAttribute('values'));
        this.index=this.getAttribute('index'); 

        this.shadowRoot.querySelector("#button-0").onmouseup = (e) => this.update(1);
        this.shadowRoot.querySelector("#button-1").onmouseup = (e) => this.update(0);

    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(name==='parent') { this.setParent(newValue);}
     }



}

window.customElements.define('icon-toggle', IconToggle);