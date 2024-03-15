// Tests webcomponents

const template = document.createElement("template");
template.innerHTML = /* html */ `
 
  <style>
  .icon, .icon svg path, .icon svg {
    width: 12px;
    height: 12px;
    fill: var(--figma-color-text-secondary);
  }
  .icon {
    display: none;
  }
  .icon.visible {
    display: block;
  }

  :host([size="L"]) .icon, :host([size="L"]) .icon svg path, :host([size="L"]) .icon svg {  
    width: 14px;
    height: 14px;
  }
  :host([purpose="danger"]) .icon svg path, :host([purpose="danger"]) .icon#danger svg {
    color: var(--figma-color-icon-danger);
    fill: none;
  }
  :host([purpose="ok"]) .icon svg path, :host([purpose="ok"]) .icon svg {
    fill: var(--figma-color-bg-brand);
  }
  :host([purpose="highlight"]) .icon svg path, :host([purpose="highlight"]) .icon svg {
    fill: var(--figma-color-text);
  }

  :host([type="curve"]) #curve { display: block;}
  :host([type="horizontal-dots"]) #horizontal-dots { display: block;}
  :host([type="vertical-dots"]) #vertical-dots { display: block;}
  :host([type="horizontal-arrows"]) #horizontal-arrows { display: block;}
  :host([type="vertical-arrows"]) #vertical-arrows { display: block;}
  :host([type="fixed-space"]) #fixed-space { display: block;}
  :host([type="angle"]) #angle { display: block;}
  :host([type="side-to-side"]) #side-to-side { display: block;}
  :host([type="center-to-center"]) #center-to-center { display: block;}
  :host([type="danger"]) #danger { display: block;}
  :host([type="ok"]) #ok { display: block;}
  :host([type="chevron-down"]) #chevron-down { display: block;}
  :host([type="check"]) #check { display: block;}
  :host([type="translation-horizontal"]) #translation-horizontal { display: block;}
  :host([type="close"]) #close { display: block;}
  :host([type="add"]) #add { display: block;}
  :host([type="remove"]) #remove { display: block;}
  :host([type="repeat"]) #repeat { display: block;}

  </style>
  <div class="icon-container" size="M" type="curve" purpose="default">
    <div class="icon" id="caution">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>  
    </div>
    <div class="icon" id="horizontal-dots">
      <svg viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="8" r="2"></circle>
      <circle cx="14" cy="8" r="2"></circle>
      <circle cx="8" cy="8" r="2"></circle>
      </svg>
    </div>
    <div class="icon" id="vertical-dots">
      <svg viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="2" r="2" transform="rotate(90 8 2)"></circle>
      <circle cx="8" cy="14" r="2" transform="rotate(90 8 14)"></circle>
      <circle cx="8" cy="8" r="2" transform="rotate(90 8 8)"></circle>
      </svg>
    </div>
    <div class="icon" id="horizontal-arrows">
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.08537 4.38891C3.25856 4.2037 3.54676 4.2037 3.71995 4.38891C3.8842 4.56456 3.8842 4.84283 3.71995 5.01848L3.22638 5.54631L8.77362 5.54631L8.28005 5.01848C8.1158 4.84283 8.1158 4.56456 8.28005 4.38891C8.45324 4.2037 8.74144 4.2037 8.91463 4.38891L10.1268 5.68521C10.2911 5.86086 10.2911 6.13914 10.1268 6.31479L8.91463 7.61109C8.74144 7.7963 8.45324 7.7963 8.28005 7.61109C8.1158 7.43544 8.1158 7.15717 8.28005 6.98152L8.77362 6.45369L3.22638 6.45369L3.71995 6.98152C3.8842 7.15717 3.8842 7.43544 3.71995 7.61109C3.54676 7.7963 3.25856 7.7963 3.08537 7.61109L1.87319 6.31479C1.70894 6.13914 1.70894 5.86086 1.87319 5.68521L3.08537 4.38891Z" fill="#2C2C2C"></path>
      </svg>
    </div>
    <div class="icon" id="vertical-arrows">
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.61109 3.08537C7.7963 3.25856 7.7963 3.54676 7.61109 3.71995C7.43544 3.8842 7.15717 3.8842 6.98152 3.71995L6.45369 3.22638L6.45369 8.77362L6.98152 8.28005C7.15717 8.1158 7.43544 8.1158 7.61109 8.28005C7.7963 8.45324 7.7963 8.74144 7.61109 8.91463L6.31479 10.1268C6.13914 10.2911 5.86086 10.2911 5.68521 10.1268L4.38891 8.91463C4.2037 8.74144 4.2037 8.45324 4.38891 8.28005C4.56456 8.1158 4.84283 8.1158 5.01848 8.28005L5.5463 8.77362L5.54631 3.22638L5.01848 3.71995C4.84283 3.8842 4.56456 3.8842 4.38891 3.71995C4.2037 3.54676 4.2037 3.25856 4.38891 3.08537L5.68521 1.87319C5.86086 1.70894 6.13914 1.70894 6.31479 1.87319L7.61109 3.08537Z" fill="#2C2C2C"></path>
      </svg>
      </div>
      <div class="icon" id="curve">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.998 1.45473C11.023 1.72974 10.8203 1.97295 10.5453 1.99795C8.12125 2.21831 7.22285 4.04194 6.26997 6.20182C6.2441 6.26045 6.21817 6.31936 6.19215 6.37848C5.75553 7.37048 5.2922 8.42317 4.63587 9.26138C3.91971 10.176 2.95967 10.8565 1.54976 10.9975C1.27499 11.025 1.02997 10.8245 1.00249 10.5498C0.975011 10.275 1.17548 10.03 1.45026 10.0025C2.54034 9.89347 3.26781 9.38651 3.84852 8.64487C4.42481 7.90889 4.8414 6.96363 5.2954 5.93348C5.31521 5.88854 5.33508 5.84343 5.35505 5.79818C6.27716 3.70806 7.37876 1.28169 10.4547 1.00205C10.7297 0.977054 10.973 1.17973 10.998 1.45473Z" fill="black"></path>
        </svg>
      </div>    
      <div class="icon" id="fixed-space">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.5C1 4.22386 1.22386 4 1.5 4C1.77614 4 2 4.22386 2 4.5V5.5H10V4.5C10 4.22386 10.2239 4 10.5 4C10.7761 4 11 4.22386 11 4.5V7.5C11 7.77614 10.7761 8 10.5 8C10.2239 8 10 7.77614 10 7.5V6.5H2V7.5C2 7.77614 1.77614 8 1.5 8C1.22386 8 1 7.77614 1 7.5V4.5Z" fill="black"></path>
        </svg>
      </div>    
      <div class="icon" id="angle">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.83788 2.86858C8.04144 2.68198 8.05519 2.3657 7.8686 2.16214C7.682 1.95858 7.36572 1.94483 7.16216 2.13143L1.16216 7.63143C1.01016 7.77075 0.959283 7.9891 1.03403 8.18126C1.10878 8.37343 1.29383 8.5 1.50002 8.5H9.50002C9.77616 8.5 10 8.27614 10 8C10 7.72386 9.77616 7.5 9.50002 7.5H7.73209C7.64321 6.26327 7.22328 5.05029 6.45899 4.13256L7.83788 2.86858ZM6.08991 4.47089L2.78542 7.5H7.23076C7.14333 6.36903 6.75883 5.28371 6.08991 4.47089Z" fill="#2C2C2C"></path>
        </svg>
      </div>   
      <div class="icon" id="side-to-side">
      <svg viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33537 4.38891C7.50856 4.2037 7.79676 4.2037 7.96995 4.38891C8.1342 4.56456 8.1342 4.84283 7.96995 5.01848L7.47638 5.54631H12.0236V6.45369H7.47638L7.96995 6.98152C8.1342 7.15717 8.1342 7.43544 7.96995 7.61109C7.79676 7.7963 7.50856 7.7963 7.33537 7.61109L6.12319 6.31479C5.95894 6.13914 5.95894 5.86086 6.12319 5.68521L7.33537 4.38891Z" fill="#2C2C2C"/>
      <path d="M3 0H4V12H3V0Z" fill="#2C2C2C"/>
      </svg>
      
      </div>   
      <div class="icon" id="center-to-center">
      <svg viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33537 4.38891C7.50856 4.2037 7.79676 4.2037 7.96995 4.38891C8.1342 4.56456 8.1342 4.84283 7.96995 5.01848L7.47638 5.54631H12.0236V6.45369H7.47638L7.96995 6.98152C8.1342 7.15717 8.1342 7.43544 7.96995 7.61109C7.79676 7.7963 7.50856 7.7963 7.33537 7.61109L6.12319 6.31479C5.95894 6.13914 5.95894 5.86086 6.12319 5.68521L7.33537 4.38891Z" fill="#2C2C2C"/>
      <path d="M4 6C4 6.55228 3.55228 7 3 7C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5C3.55228 5 4 5.44772 4 6Z" fill="#2C2C2C"/>
      <path d="M8 9H9V12H8V9Z" fill="#2C2C2C"/>
      <path d="M8 0H9V3H8V0Z" fill="#2C2C2C"/>
      </svg>
      
      </div>   
      <div class="icon" id="danger">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path>
        </svg>
      </div>   
      <div class="icon" id="ok">
        <svg viewBox="0 0 12 12" fill="#0C8CE9" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 11.25C8.8995 11.25 11.25 8.8995 11.25 6C11.25 3.10051 8.8995 0.75 6 0.75C3.10051 0.75 0.75 3.10051 0.75 6C0.75 8.8995 3.10051 11.25 6 11.25ZM8.8826 4.65644C9.07255 4.41062 9.02726 4.05735 8.78144 3.8674C8.53562 3.67745 8.18235 3.72274 7.9924 3.96856L5.21711 7.56011L3.9806 6.18621C3.77278 5.9553 3.41712 5.93658 3.18621 6.1444C2.9553 6.35222 2.93658 6.70788 3.1444 6.93879L4.8319 8.81379C4.94349 8.93779 5.10437 9.00585 5.27107 8.99961C5.43777 8.99336 5.5931 8.91344 5.6951 8.78144L8.8826 4.65644Z"></path>
        </svg>
      </div>   
      <div class="icon" id="chevron-down">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.6159 4.67991C2.79268 4.46777 3.10797 4.4391 3.3201 4.61589L6.00001 6.84914L8.67992 4.61589C8.89206 4.4391 9.20734 4.46777 9.38412 4.67991C9.5609 4.89204 9.53224 5.20733 9.3201 5.38411L6.3201 7.88411C6.13468 8.03863 5.86534 8.03863 5.67992 7.88411L2.67992 5.38411C2.46778 5.20733 2.43912 4.89204 2.6159 4.67991Z" fill="black"/>
        </svg>   
      </div>   
      <div class="icon" id="check">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.17603 5.57545C1.47649 5.15957 2.0572 5.06601 2.47308 5.36647L4.74762 6.94121L9.42845 2.45808C9.79898 2.1032 10.387 2.11588 10.7419 2.48641C11.0968 2.85694 11.0841 3.445 10.7136 3.79988L5.47367 8.81849C5.1498 9.12868 4.65057 9.16323 4.28707 8.90061L1.38502 6.8725C0.969137 6.57204 0.875571 5.99133 1.17603 5.57545Z" fill="black"/>
        </svg>
      </div>  
      <div class="icon" id="translation-horizontal">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11ZM7.03778 7.61109C7.21029 7.7963 7.49735 7.7963 7.66987 7.61109L8.8773 6.31479C9.0409 6.13914 9.0409 5.86086 8.8773 5.68521L7.66987 4.38891C7.49735 4.2037 7.21029 4.2037 7.03778 4.38891C6.87417 4.56456 6.87417 4.84283 7.03778 5.01848L7.52941 5.54631L3.45192 5.5463C3.20233 5.5463 3 5.74943 3 6C3 6.25057 3.20233 6.45369 3.45192 6.45369L7.52941 6.4537L7.03778 6.98152C6.87417 7.15717 6.87417 7.43544 7.03778 7.61109Z" fill="#2C2C2C"/>
        </svg>      
      </div>   
      <div class="icon" id="close">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.96025 3.16475C3.74058 2.94508 3.38442 2.94508 3.16475 3.16475C2.94508 3.38442 2.94508 3.74058 3.16475 3.96025L5.20451 6L3.16475 8.03975C2.94508 8.25942 2.94508 8.61558 3.16475 8.83525C3.38442 9.05492 3.74058 9.05492 3.96025 8.83525L6 6.79549L8.03975 8.83525C8.25942 9.05492 8.61558 9.05492 8.83525 8.83525C9.05492 8.61558 9.05492 8.25942 8.83525 8.03975L6.79549 6L8.83525 3.96025C9.05492 3.74058 9.05492 3.38442 8.83525 3.16475C8.61558 2.94508 8.25942 2.94508 8.03975 3.16475L6 5.20451L3.96025 3.16475Z" fill="#0F172A"/>
        </svg>
      </div>   
      <div class="icon" id="add">
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6C2 5.72386 2.22386 5.5 2.5 5.5H9.5C9.77614 5.5 10 5.72386 10 6C10 6.27614 9.77614 6.5 9.5 6.5H2.5C2.22386 6.5 2 6.27614 2 6Z" fill="#C3C3C3"/>
      <path d="M6 10C5.72386 10 5.5 9.77614 5.5 9.5L5.5 2.5C5.5 2.22386 5.72386 2 6 2C6.27614 2 6.5 2.22386 6.5 2.5L6.5 9.5C6.5 9.77614 6.27614 10 6 10Z" fill="#C3C3C3"/>
      </svg>
      
      </div>   
      <div class="icon" id="remove">
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6C2 5.72386 2.22386 5.5 2.5 5.5H9.5C9.77614 5.5 10 5.72386 10 6C10 6.27614 9.77614 6.5 9.5 6.5H2.5C2.22386 6.5 2 6.27614 2 6Z" fill="#C3C3C3"/>
      </svg>
      
      </div>   
      <div class="icon" id="repeat">
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.01149 4.674H10.5075L8.91699 3.0825C8.40493 2.57044 7.7671 2.2022 7.0676 2.0148C6.3681 1.82741 5.6316 1.82746 4.93213 2.01496C4.23266 2.20246 3.59487 2.57079 3.08289 3.08293C2.57091 3.59507 2.20277 4.23297 2.01549 4.9325M1.49249 9.822V7.326M1.49249 7.326H3.98849M1.49249 7.326L3.08249 8.9175C3.59455 9.42956 4.23239 9.7978 4.93189 9.9852C5.63138 10.1726 6.36789 10.1725 7.06736 9.98504C7.76683 9.79754 8.40461 9.42921 8.91659 8.91707C9.42857 8.40493 9.79671 7.76703 9.98399 7.0675M10.5075 2.178V4.673" stroke="#C3C3C3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      
      
      </div>  
  </div>
`; 




class FigmaIcon extends HTMLElement {
    constructor() {
      super();
      this.type=''; // The name of the icon
      this.size=''; // The size - M or L
      this.purpose=''; // The styles used - default, ok, danger

      // Attach a shadow root to <bezier-input>.
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

  }




    connectedCallback(){ // Called when inserted into DOM
        // Initialization of the attributes
    }

    // Here we check for changes of values in the parameters
    attributeChangedCallback(name, oldValue, newValue) {
    }

}


window.customElements.define('figma-icon', FigmaIcon);