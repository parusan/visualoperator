
const template = document.createElement("template");
template.innerHTML = /* html */ `
  <style>

  .icon-toggle {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    position: relative;
    cursor: pointer;
    border: none;
    cursor: pointer;
    border: 1px solid transparent;
    background: var(--figma-color-bg);
    border-radius: 4px;
  }

  .button-icon.active {
    background: var(--figma-color-bg-secondary);
    border-color: var(--figma-color-border-selected);
    display: block;
  }

  .button-icon:hover {
    background: var(--figma-color-bg-secondary);
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
  <div class="icon-button" id="icon-button">
    <button class="button-icon tooltip" id="button">
      <figma-icon size="XL" type="side-to-side" purpose="default" id="icon"></figma-icon>
      <span class="tooltiptext" id="tooltip">Side to side</span>
    </button>
  </div>
`; 


class IconButton extends HTMLElement {
    static get observedAttributes() {return ['parent', 'action', 'icon']; }
    constructor() {
      super();
      this.parent='';
      this.icon='';
      this.componentId='';
      this.tooltip = '';
      this.action='';
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
  }


    setTooltip(tooltip) {
      this.tooltip = tooltip;
        this.shadowRoot.querySelector('#tooltip').textContent=tooltip;
      }

    setIcon(icon) {
      // Then we change the icon inside the main component
      this.icon = icon;   
      this.shadowRoot.querySelector("#icon").setAttribute('type', icon)
    }

    setAction(val) {
      this.action = val;   
    }

    setParent(val) {
        // We initialize the selection value the first time we set the parent of the component
          this.parent=val;
      }

      setSize(val) {
        if (val==="S") {
          this.shadowRoot.querySelector("#icon-button").classList.add('size-S');
          this.shadowRoot.querySelector("#icon").setAttribute("size", "L");
        } 
      }

    trigger(){
      this.shadowRoot.dispatchEvent(new CustomEvent("trigger", {
        detail: {action: this.action, parent: this.parent, param:this.componentId},
        composed: true,
        bubbles: true
      }));
    }

    connectedCallback(){ // Called when inserted into DOM
        // Initialization of the attributes
        this.componentId=this.getAttribute('id');
        this.setIcon(this.getAttribute('icon'));
        this.setTooltip(this.getAttribute('tooltip'));
        this.setAction(this.getAttribute('action'));
        this.setSize(this.getAttribute('size'));
        this.shadowRoot.querySelector("#button").onmouseup = (e) => this.trigger();

    }
    attributeChangedCallback(name, oldValue, newValue) {
        if(name==='parent') { this.setParent(newValue);}
        if(name==='action') { this.setAction(newValue);}
        if(name==='icon') { this.setIcon(newValue);}
     }



}

window.customElements.define('icon-button', IconButton);