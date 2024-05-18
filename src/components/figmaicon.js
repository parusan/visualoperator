// Tests webcomponents

const template = document.createElement("template");
template.innerHTML = /* html */ `
 
  <style>

  :host {
    display: block;
  }

  .icon, .icon svg path, .icon svg {
    width: 12px;
    height: 12px;
    fill: var(--figma-color-text-secondary);
  }
  .icon.visible {
    display: block;
  }

  .icon-container[size="L"], .icon-container[size="L"] .icon, .icon-container[size="L"] .icon svg path, .icon-container[size="L"] .icon svg {  
    width: 14px;
    height: 14px;
  }

  .icon-container[size="XL"], .icon-container[size="XL"] .icon, .icon-container[size="XL"] .icon svg path, .icon-container[size="XL"] .icon svg {  
    width: 16px;
    height: 16px;
  }

  .icon-container[purpose="danger"] .icon svg path, .icon-container[purpose="danger"] .icon#danger svg {
    color: var(--figma-color-icon-danger);
    fill: none;
  }
  .icon-container[purpose="ok"] .icon svg path, .icon-container[purpose="ok"] .icon svg {
    fill: var(--figma-color-bg-brand);
  }
  .icon-container[purpose="highlight"] .icon svg path, .icon-container[purpose="highlight"] .icon svg {
    fill: var(--figma-color-text);
  }

  .icon-container[type="curve"] #curve { display: block;}
  .icon-container[type="horizontal-dots"] #horizontal-dots { display: block;}
  .icon-container[type="vertical-dots"] #vertical-dots { display: block;}
  .icon-container[type="horizontal-arrows"] #horizontal-arrows { display: block;}
  .icon-container[type="vertical-arrows"] #vertical-arrows { display: block;}
  .icon-container[type="fixed-space"] #fixed-space { display: block;}
  .icon-container[type="angle"] #angle { display: block;}
  .icon-container[type="side-to-side"] #side-to-side { display: block;}
  .icon-container[type="center-to-center"] #center-to-center { display: block;}
  .icon-container[type="danger"] #danger { display: block;}
  .icon-container[type="ok"] #ok { display: block;}
  .icon-container[type="chevron-down"] #chevron-down { display: block;}
  .icon-container[type="check"] #check { display: block;}
  .icon-container[type="translation-horizontal"] #translation-horizontal { display: block;}
  .icon-container[type="close"] #close { display: block;}
  .icon-container[type="add"] #add { display: block;}
  .icon-container[type="remove"] #remove { display: block;}
  .icon-container[type="repeat"] #repeat { display: block;}

  </style>
  <div class="icon-container" size="M" type="curve" purpose="default">
    <div class="icon">
      </div>  
  </div>
`; 


class FigmaIcon extends HTMLElement {
  static get observedAttributes() {return ['size', 'type', 'purpose']; }
    constructor() {
      super();
      this.type=''; // The name of the icon
      this.size=''; // The size - M, L or XL
      this.purpose=''; // The styles used - default, ok, danger

      this.standard=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>`;

      this.caution=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>`;
    this.horizontalDots=`<svg viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2" cy="8" r="2"></circle>
    <circle cx="14" cy="8" r="2"></circle>
    <circle cx="8" cy="8" r="2"></circle>
    </svg>`;
    this.verticalDots=`<svg viewBox="0 0 16 16" fill="black" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="2" r="2" transform="rotate(90 8 2)"></circle>
    <circle cx="8" cy="14" r="2" transform="rotate(90 8 14)"></circle>
    <circle cx="8" cy="8" r="2" transform="rotate(90 8 8)"></circle>
    </svg>`;
    this.horizontalArrows=`<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.08537 4.38891C3.25856 4.2037 3.54676 4.2037 3.71995 4.38891C3.8842 4.56456 3.8842 4.84283 3.71995 5.01848L3.22638 5.54631L8.77362 5.54631L8.28005 5.01848C8.1158 4.84283 8.1158 4.56456 8.28005 4.38891C8.45324 4.2037 8.74144 4.2037 8.91463 4.38891L10.1268 5.68521C10.2911 5.86086 10.2911 6.13914 10.1268 6.31479L8.91463 7.61109C8.74144 7.7963 8.45324 7.7963 8.28005 7.61109C8.1158 7.43544 8.1158 7.15717 8.28005 6.98152L8.77362 6.45369L3.22638 6.45369L3.71995 6.98152C3.8842 7.15717 3.8842 7.43544 3.71995 7.61109C3.54676 7.7963 3.25856 7.7963 3.08537 7.61109L1.87319 6.31479C1.70894 6.13914 1.70894 5.86086 1.87319 5.68521L3.08537 4.38891Z" fill="#2C2C2C"></path>
    </svg>`;
    this.verticalArrows=`  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.61109 3.08537C7.7963 3.25856 7.7963 3.54676 7.61109 3.71995C7.43544 3.8842 7.15717 3.8842 6.98152 3.71995L6.45369 3.22638L6.45369 8.77362L6.98152 8.28005C7.15717 8.1158 7.43544 8.1158 7.61109 8.28005C7.7963 8.45324 7.7963 8.74144 7.61109 8.91463L6.31479 10.1268C6.13914 10.2911 5.86086 10.2911 5.68521 10.1268L4.38891 8.91463C4.2037 8.74144 4.2037 8.45324 4.38891 8.28005C4.56456 8.1158 4.84283 8.1158 5.01848 8.28005L5.5463 8.77362L5.54631 3.22638L5.01848 3.71995C4.84283 3.8842 4.56456 3.8842 4.38891 3.71995C4.2037 3.54676 4.2037 3.25856 4.38891 3.08537L5.68521 1.87319C5.86086 1.70894 6.13914 1.70894 6.31479 1.87319L7.61109 3.08537Z" fill="#2C2C2C"></path>
</svg>`;
this.curve=`    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.998 1.45473C11.023 1.72974 10.8203 1.97295 10.5453 1.99795C8.12125 2.21831 7.22285 4.04194 6.26997 6.20182C6.2441 6.26045 6.21817 6.31936 6.19215 6.37848C5.75553 7.37048 5.2922 8.42317 4.63587 9.26138C3.91971 10.176 2.95967 10.8565 1.54976 10.9975C1.27499 11.025 1.02997 10.8245 1.00249 10.5498C0.975011 10.275 1.17548 10.03 1.45026 10.0025C2.54034 9.89347 3.26781 9.38651 3.84852 8.64487C4.42481 7.90889 4.8414 6.96363 5.2954 5.93348C5.31521 5.88854 5.33508 5.84343 5.35505 5.79818C6.27716 3.70806 7.37876 1.28169 10.4547 1.00205C10.7297 0.977054 10.973 1.17973 10.998 1.45473Z" fill="black"></path>
</svg>`;
this.fixedSpace=`    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.5C1 4.22386 1.22386 4 1.5 4C1.77614 4 2 4.22386 2 4.5V5.5H10V4.5C10 4.22386 10.2239 4 10.5 4C10.7761 4 11 4.22386 11 4.5V7.5C11 7.77614 10.7761 8 10.5 8C10.2239 8 10 7.77614 10 7.5V6.5H2V7.5C2 7.77614 1.77614 8 1.5 8C1.22386 8 1 7.77614 1 7.5V4.5Z" fill="black"></path>
</svg>`;
this.angle=`    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.83788 2.86858C8.04144 2.68198 8.05519 2.3657 7.8686 2.16214C7.682 1.95858 7.36572 1.94483 7.16216 2.13143L1.16216 7.63143C1.01016 7.77075 0.959283 7.9891 1.03403 8.18126C1.10878 8.37343 1.29383 8.5 1.50002 8.5H9.50002C9.77616 8.5 10 8.27614 10 8C10 7.72386 9.77616 7.5 9.50002 7.5H7.73209C7.64321 6.26327 7.22328 5.05029 6.45899 4.13256L7.83788 2.86858ZM6.08991 4.47089L2.78542 7.5H7.23076C7.14333 6.36903 6.75883 5.28371 6.08991 4.47089Z" fill="#2C2C2C"></path>
</svg>`;
this.sideToSide=`  <svg viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.33537 4.38891C7.50856 4.2037 7.79676 4.2037 7.96995 4.38891C8.1342 4.56456 8.1342 4.84283 7.96995 5.01848L7.47638 5.54631H12.0236V6.45369H7.47638L7.96995 6.98152C8.1342 7.15717 8.1342 7.43544 7.96995 7.61109C7.79676 7.7963 7.50856 7.7963 7.33537 7.61109L6.12319 6.31479C5.95894 6.13914 5.95894 5.86086 6.12319 5.68521L7.33537 4.38891Z" fill="#2C2C2C"/>
<path d="M3 0H4V12H3V0Z" fill="#2C2C2C"/>
</svg>`;
this.centerToCenter=`  <svg viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.33537 4.38891C7.50856 4.2037 7.79676 4.2037 7.96995 4.38891C8.1342 4.56456 8.1342 4.84283 7.96995 5.01848L7.47638 5.54631H12.0236V6.45369H7.47638L7.96995 6.98152C8.1342 7.15717 8.1342 7.43544 7.96995 7.61109C7.79676 7.7963 7.50856 7.7963 7.33537 7.61109L6.12319 6.31479C5.95894 6.13914 5.95894 5.86086 6.12319 5.68521L7.33537 4.38891Z" fill="#2C2C2C"/>
<path d="M4 6C4 6.55228 3.55228 7 3 7C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5C3.55228 5 4 5.44772 4 6Z" fill="#2C2C2C"/>
<path d="M8 9H9V12H8V9Z" fill="#2C2C2C"/>
<path d="M8 0H9V3H8V0Z" fill="#2C2C2C"/>
</svg>`;
this.danger=`      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path>
</svg>`;
this.ok=`    <svg viewBox="0 0 12 12" fill="#0C8CE9" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 11.25C8.8995 11.25 11.25 8.8995 11.25 6C11.25 3.10051 8.8995 0.75 6 0.75C3.10051 0.75 0.75 3.10051 0.75 6C0.75 8.8995 3.10051 11.25 6 11.25ZM8.8826 4.65644C9.07255 4.41062 9.02726 4.05735 8.78144 3.8674C8.53562 3.67745 8.18235 3.72274 7.9924 3.96856L5.21711 7.56011L3.9806 6.18621C3.77278 5.9553 3.41712 5.93658 3.18621 6.1444C2.9553 6.35222 2.93658 6.70788 3.1444 6.93879L4.8319 8.81379C4.94349 8.93779 5.10437 9.00585 5.27107 8.99961C5.43777 8.99336 5.5931 8.91344 5.6951 8.78144L8.8826 4.65644Z"></path>
</svg>`;
this.chevronDown=`    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.6159 4.67991C2.79268 4.46777 3.10797 4.4391 3.3201 4.61589L6.00001 6.84914L8.67992 4.61589C8.89206 4.4391 9.20734 4.46777 9.38412 4.67991C9.5609 4.89204 9.53224 5.20733 9.3201 5.38411L6.3201 7.88411C6.13468 8.03863 5.86534 8.03863 5.67992 7.88411L2.67992 5.38411C2.46778 5.20733 2.43912 4.89204 2.6159 4.67991Z" fill="black"/>
</svg>  `;
this.check=`    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.17603 5.57545C1.47649 5.15957 2.0572 5.06601 2.47308 5.36647L4.74762 6.94121L9.42845 2.45808C9.79898 2.1032 10.387 2.11588 10.7419 2.48641C11.0968 2.85694 11.0841 3.445 10.7136 3.79988L5.47367 8.81849C5.1498 9.12868 4.65057 9.16323 4.28707 8.90061L1.38502 6.8725C0.969137 6.57204 0.875571 5.99133 1.17603 5.57545Z" fill="black"/>
</svg>`;
this.translation=`    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11ZM7.03778 7.61109C7.21029 7.7963 7.49735 7.7963 7.66987 7.61109L8.8773 6.31479C9.0409 6.13914 9.0409 5.86086 8.8773 5.68521L7.66987 4.38891C7.49735 4.2037 7.21029 4.2037 7.03778 4.38891C6.87417 4.56456 6.87417 4.84283 7.03778 5.01848L7.52941 5.54631L3.45192 5.5463C3.20233 5.5463 3 5.74943 3 6C3 6.25057 3.20233 6.45369 3.45192 6.45369L7.52941 6.4537L7.03778 6.98152C6.87417 7.15717 6.87417 7.43544 7.03778 7.61109Z" fill="#2C2C2C"/>
</svg>  `;
this.close=`    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.96025 3.16475C3.74058 2.94508 3.38442 2.94508 3.16475 3.16475C2.94508 3.38442 2.94508 3.74058 3.16475 3.96025L5.20451 6L3.16475 8.03975C2.94508 8.25942 2.94508 8.61558 3.16475 8.83525C3.38442 9.05492 3.74058 9.05492 3.96025 8.83525L6 6.79549L8.03975 8.83525C8.25942 9.05492 8.61558 9.05492 8.83525 8.83525C9.05492 8.61558 9.05492 8.25942 8.83525 8.03975L6.79549 6L8.83525 3.96025C9.05492 3.74058 9.05492 3.38442 8.83525 3.16475C8.61558 2.94508 8.25942 2.94508 8.03975 3.16475L6 5.20451L3.96025 3.16475Z" fill="#0F172A"/>
</svg>`; 
this.add=`  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 6C2 5.72386 2.22386 5.5 2.5 5.5H9.5C9.77614 5.5 10 5.72386 10 6C10 6.27614 9.77614 6.5 9.5 6.5H2.5C2.22386 6.5 2 6.27614 2 6Z" fill="#C3C3C3"/>
<path d="M6 10C5.72386 10 5.5 9.77614 5.5 9.5L5.5 2.5C5.5 2.22386 5.72386 2 6 2C6.27614 2 6.5 2.22386 6.5 2.5L6.5 9.5C6.5 9.77614 6.27614 10 6 10Z" fill="#C3C3C3"/>
</svg>`; 
this.remove=`  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 6C2 5.72386 2.22386 5.5 2.5 5.5H9.5C9.77614 5.5 10 5.72386 10 6C10 6.27614 9.77614 6.5 9.5 6.5H2.5C2.22386 6.5 2 6.27614 2 6Z" fill="#C3C3C3"/>
</svg>`; 
this.repeat=`  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.93821 2.49777C6.3235 2.33309 5.67627 2.33314 5.06159 2.49791C4.4469 2.66268 3.88642 2.98637 3.4365 3.43643C2.98658 3.8865 2.66306 4.44707 2.49848 5.06181C2.42707 5.32856 2.15293 5.48691 1.88618 5.41549C1.61944 5.34408 1.46109 5.06994 1.5325 4.80319C1.74249 4.01887 2.15524 3.30365 2.72928 2.72944C3.30332 2.15522 4.01841 1.74224 4.80267 1.53201C5.58692 1.32179 6.4127 1.32173 7.19698 1.53183C7.98127 1.74194 8.69642 2.15482 9.27055 2.72895L10.0075 3.46636V2.178C10.0075 1.90186 10.2314 1.678 10.5075 1.678C10.7836 1.678 11.0075 1.90186 11.0075 2.178V4.674C11.0075 4.95014 10.7836 5.174 10.5075 5.174H8.01149C7.73535 5.174 7.51149 4.95014 7.51149 4.674C7.51149 4.39786 7.73535 4.174 8.01149 4.174H9.30092L8.56344 3.43605C8.11345 2.98606 7.55292 2.66245 6.93821 2.49777ZM10.1133 6.58451C10.3801 6.65593 10.5384 6.93006 10.467 7.19681C10.257 7.98113 9.84424 8.69635 9.2702 9.27057C8.69616 9.84478 7.98107 10.2578 7.19682 10.468C6.41256 10.6782 5.58679 10.6783 4.8025 10.4682C4.01821 10.2581 3.30306 9.84518 2.72894 9.27105L1.99249 8.53391V9.822C1.99249 10.0981 1.76864 10.322 1.49249 10.322C1.21635 10.322 0.992493 10.0981 0.992493 9.822V7.326C0.992493 7.04986 1.21635 6.826 1.49249 6.826H3.98849C4.26464 6.826 4.48849 7.04986 4.48849 7.326C4.48849 7.60214 4.26464 7.826 3.98849 7.826H2.6988L3.43605 8.56395C3.4361 8.564 3.43599 8.56389 3.43605 8.56395C3.88601 9.01386 4.44664 9.33757 5.06127 9.50223C5.67598 9.66691 6.32321 9.66686 6.9379 9.50209C7.55258 9.33732 8.11306 9.01363 8.56298 8.56357C9.01291 8.11351 9.33642 7.55293 9.501 6.93819C9.57242 6.67144 9.84655 6.5131 10.1133 6.58451Z" fill="#C3C3C3"/>
</svg>`; 


      // Attach a shadow root to <bezier-input>.
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

  }

  setSize(size){
    this.size=size;
    this.shadowRoot.querySelector('.icon-container').setAttribute('size',size);
  }
  setType(type){
    this.type=type;
    this.shadowRoot.querySelector('.icon-container').setAttribute('type',type);
    this.shadowRoot.querySelector('.icon').innerHTML='';
    // We then inject the SVG into the icon

    const iconTemplate = document.createElement('template');
    iconTemplate.innerHTML = this.getTemplate(type);
    this.shadowRoot.querySelector('.icon').append(...iconTemplate.content.children); 
  }

  getTemplate(type){
    if (type==='caution') return this.standard;
    if (type==='horizontal-dots') return this.horizontalDots;
    if (type==='vertical-dots') return this.verticalDots;
    if (type==='horizontal-arrows') return this.horizontalArrows;
    if (type==='vertical-arrows') return this.verticalArrows;
    if (type==='curve') return this.curve;
    if (type==='fixed-space') return this.fixedSpace;
    if (type==='angle') return this.angle;
    if (type==='side-to-side') return this.sideToSide;
    if (type==='center-to-center') return this.centerToCenter;
    if (type==='danger') return this.danger;
    if (type==='ok') return this.ok;
    if (type==='chevron-down') return this.chevronDown;
    if (type==='check') return this.check;
    if (type==='translation') return this.translation;
    if (type==='close') return this.close;
    if (type==='add') return this.add;
    if (type==='remove') return this.remove;
    if (type==='repeat') return this.repeat;

    return this.standard;
  }

  setPurpose(purp){
    this.purpose=purp;
    this.shadowRoot.querySelector('.icon-container').setAttribute('purpose',purp);
    this.shadowRoot.querySelector('.icon-container').setAttribute('purpose',purp);
  }

    connectedCallback(){ // Called when inserted into DOM
        this.setSize(this.getAttribute('size'));
        this.setPurpose(this.getAttribute('purpose'));
        this.setType(this.getAttribute('type'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if(name==='size') {this.setSize(newValue);}
      if(name==='type') {this.setType(newValue);}
      if(name==='purpose') {this.setPurpose(newValue);}
   }

}


window.customElements.define('figma-icon', FigmaIcon);