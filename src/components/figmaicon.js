// Tests webcomponents

const template = document.createElement("template");
template.innerHTML = /* html */ `
 
  <style>

  :host {
    display: block;
  }

  .icon, .icon svg, .icon path {
    width: 12px;
    height: 12px;
    fill: var(--figma-color-text-secondary);
  }
  .icon.visible {
    display: block;
  }

  .icon-container[type="translation"] .icon svg, .icon-container[type="translation"] path {
    fill: var(--color-accent1);
  }
  .icon-container[type="translationv"] .icon svg, .icon-container[type="translationv"] path {
    fill: var(--color-accent1);
  }
  .icon-container[type="rotation"] .icon svg, .icon-container[type="rotation"] path {
    fill: var(--color-accent6);
  }
  .icon-container[type="scale"] .icon svg, .icon-container[type="scale"] path {
    fill: var(--color-accent4);
  }
   .icon-container[type="opacity"] .icon svg, .icon-container[type="opacity"] path {
    fill: var(--color-accent2);
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
this.diagonalArrows=`<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.79983 6.92174C2.79133 6.66831 2.99511 6.46452 3.24854 6.47302C3.48889 6.48108 3.68566 6.67785 3.69372 6.9182L3.71794 7.64043L7.64043 3.71794L6.9182 3.69372C6.67785 3.68566 6.48108 3.48888 6.47302 3.24854C6.46452 2.99511 6.66831 2.79133 6.92174 2.79983L8.69551 2.85931C8.93585 2.86737 9.13262 3.06414 9.14068 3.30448L9.20016 5.07825C9.20866 5.33168 9.00488 5.53547 8.75145 5.52697C8.51111 5.51891 8.31433 5.32214 8.30627 5.08179L8.28205 4.35956L4.35956 8.28205L5.08179 8.30627C5.32214 8.31433 5.51891 8.5111 5.52697 8.75145C5.53547 9.00488 5.33168 9.20866 5.07825 9.20016L3.30449 9.14068C3.06414 9.13262 2.86737 8.93585 2.85931 8.6955L2.79983 6.92174Z" fill="#2C2C2C"/>
</svg>
`;
this.alpha=`<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.35808 2.51328C8.56134 2.56874 8.68207 2.7819 8.62775 2.98939C8.54242 3.3153 8.45784 3.6566 8.37177 4.00389C8.18358 4.76329 7.98827 5.55136 7.76256 6.26988C7.88003 6.91145 8.01536 7.49133 8.19259 7.91132C8.39357 8.38756 8.56716 8.47566 8.6675 8.47566C8.8338 8.47566 8.92198 8.43992 8.96996 8.40874C9.01703 8.37814 9.05599 8.33213 9.09051 8.25586C9.12732 8.17454 9.15346 8.07133 9.17667 7.94028C9.18341 7.90226 9.19115 7.85276 9.19952 7.79927C9.21394 7.70712 9.23021 7.60313 9.24636 7.52562C9.29014 7.31554 9.49245 7.18147 9.69823 7.22616C9.90402 7.27084 10.0354 7.47737 9.99158 7.68744C9.97753 7.75489 9.96875 7.81282 9.95838 7.8812C9.94998 7.93662 9.94054 7.99891 9.92641 8.07869C9.89971 8.22938 9.86001 8.4101 9.78213 8.58213C9.70197 8.75921 9.57739 8.93597 9.37916 9.06481C9.18184 9.19306 8.94295 9.25342 8.6675 9.25342C8.05423 9.25342 7.70111 8.71251 7.49286 8.21904C7.4105 8.02386 7.33785 7.80628 7.27282 7.57507C7.11856 7.91052 6.9465 8.21893 6.75132 8.48537C6.33126 9.05882 5.77703 9.47138 5.04495 9.4978C3.93666 9.53779 3.15716 9.02947 2.66961 8.33086C2.19412 7.64954 2 6.79736 2 6.1039C2 5.098 2.25325 4.20376 2.74618 3.55131C3.24616 2.88953 3.97702 2.5001 4.86159 2.5001C5.85459 2.5001 6.51812 3.33314 6.9308 4.08865C7.09029 4.38064 7.22594 4.68605 7.33948 4.97361C7.43747 4.60225 7.53123 4.22377 7.62501 3.84522C7.71274 3.49112 7.80047 3.13698 7.89169 2.78857C7.94601 2.58108 8.15482 2.45783 8.35808 2.51328ZM6.96972 6.24155C6.83727 5.81834 6.61287 5.10362 6.26536 4.46742C5.86681 3.73778 5.39774 3.27786 4.86159 3.27786C4.21699 3.27786 3.70753 3.55239 3.34949 4.0263C2.98438 4.50956 2.7619 5.22279 2.7619 6.1039C2.7619 6.6704 2.92458 7.35578 3.29013 7.87957C3.64362 8.38608 4.18939 8.75041 5.01804 8.72051C5.44619 8.70506 5.80836 8.47391 6.14116 8.01959C6.46241 7.58104 6.73023 6.96697 6.96972 6.24155Z" fill="black"/>
</svg>

`;


this.translation=`<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.84615C0 0.826551 0.826552 0 1.84615 0H14.1538C15.1734 0 16 0.826552 16 1.84615V14.1538C16 15.1734 15.1734 16 14.1538 16H1.84615C0.826551 16 0 15.1734 0 14.1538V1.84615ZM1.84615 1.23077C1.50629 1.23077 1.23077 1.50629 1.23077 1.84615V14.1538C1.23077 14.4937 1.50629 14.7692 1.84615 14.7692H14.1538C14.4937 14.7692 14.7692 14.4937 14.7692 14.1538V1.84615C14.7692 1.50629 14.4937 1.23077 14.1538 1.23077H1.84615Z" fill="#007BE5"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.21507 4.13487C9.48044 3.92253 9.8677 3.96553 10.08 4.2309L12.7882 7.61552C12.968 7.84028 12.968 8.15969 12.7882 8.38445L10.08 11.7691C9.8677 12.0344 9.48044 12.0774 9.21507 11.8651C8.94969 11.6528 8.9067 11.2655 9.11903 11.0001L11.0272 8.61537H3.69231C3.35244 8.61537 3.07692 8.33985 3.07692 7.99999C3.07692 7.66012 3.35244 7.3846 3.69231 7.3846H11.0272L9.11903 4.99984C8.9067 4.73446 8.94969 4.3472 9.21507 4.13487Z" fill="#007BE5"/>
</svg>
 `;
 this.translationv=`<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" clip-rule="evenodd" d="M1.84615 16C0.826551 16 5.82555e-07 15.1734 5.37986e-07 14.1538L0 1.84615C-4.45682e-08 0.826551 0.826551 5.82555e-07 1.84615 5.37986e-07L14.1538 0C15.1734 -4.45683e-08 16 0.82655 16 1.84615V14.1538C16 15.1734 15.1735 16 14.1538 16H1.84615ZM1.23077 14.1538C1.23077 14.4937 1.50629 14.7692 1.84615 14.7692H14.1538C14.4937 14.7692 14.7692 14.4937 14.7692 14.1538L14.7692 1.84615C14.7692 1.50629 14.4937 1.23077 14.1538 1.23077L1.84615 1.23077C1.50629 1.23077 1.23077 1.50629 1.23077 1.84615L1.23077 14.1538Z" fill="#007BE5"/>
 <path fill-rule="evenodd" clip-rule="evenodd" d="M4.13487 6.78493C3.92253 6.51956 3.96553 6.1323 4.2309 5.91996L7.61552 3.21181C7.84028 3.03196 8.15969 3.03196 8.38445 3.21181L11.7691 5.91996C12.0344 6.1323 12.0774 6.51956 11.8651 6.78493C11.6528 7.05031 11.2655 7.0933 11.0001 6.88097L8.61537 4.97283V12.3077C8.61537 12.6476 8.33985 12.9231 7.99999 12.9231C7.66012 12.9231 7.3846 12.6476 7.3846 12.3077L7.3846 4.97283L4.99984 6.88097C4.73446 7.0933 4.3472 7.05031 4.13487 6.78493Z" fill="#007BE5"/>
 </svg>
 
 `;
this.rotation=`<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.84615C0 0.826551 0.826552 0 1.84615 0H14.1538C15.1734 0 16 0.826552 16 1.84615V14.1538C16 15.1734 15.1734 16 14.1538 16H1.84615C0.826551 16 0 15.1734 0 14.1538V1.84615ZM1.84615 1.23077C1.50629 1.23077 1.23077 1.50629 1.23077 1.84615V14.1538C1.23077 14.4937 1.50629 14.7692 1.84615 14.7692H14.1538C14.4937 14.7692 14.7692 14.4937 14.7692 14.1538V1.84615C14.7692 1.50629 14.4937 1.23077 14.1538 1.23077H1.84615Z" fill="#14AE5C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.38462 3.69231C7.38462 3.35244 7.66013 3.07692 8 3.07692C10.7189 3.07692 12.9231 5.28106 12.9231 8C12.9231 10.7189 10.7189 12.9231 8 12.9231C5.28106 12.9231 3.07692 10.7189 3.07692 8C3.07692 7.66013 3.35244 7.38462 3.69231 7.38462C4.03218 7.38462 4.30769 7.66013 4.30769 8C4.30769 10.0392 5.96079 11.6923 8 11.6923C10.0392 11.6923 11.6923 10.0392 11.6923 8C11.6923 5.96079 10.0392 4.30769 8 4.30769C7.66013 4.30769 7.38462 4.03218 7.38462 3.69231Z" fill="#14AE5C"/>
</svg>
`;
this.scale=`<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.84615C0 0.826551 0.826552 0 1.84615 0H14.1538C15.1734 0 16 0.826552 16 1.84615V14.1538C16 15.1734 15.1734 16 14.1538 16H1.84615C0.826551 16 0 15.1734 0 14.1538V1.84615ZM1.84615 1.23077C1.50629 1.23077 1.23077 1.50629 1.23077 1.84615V14.1538C1.23077 14.4937 1.50629 14.7692 1.84615 14.7692H14.1538C14.4937 14.7692 14.7692 14.4937 14.7692 14.1538V1.84615C14.7692 1.50629 14.4937 1.23077 14.1538 1.23077H1.84615Z" fill="#F24822"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.69231 7.38462C4.03217 7.38462 4.30769 7.66013 4.30769 8V10.822L10.822 4.30769L8 4.30769C7.66013 4.30769 7.38461 4.03218 7.38461 3.69231C7.38461 3.35244 7.66013 3.07692 8 3.07692L12.3077 3.07692C12.4709 3.07692 12.6274 3.14176 12.7428 3.25717C12.8582 3.37257 12.9231 3.5291 12.9231 3.69231L12.9231 8C12.9231 8.33987 12.6476 8.61538 12.3077 8.61538C11.9678 8.61539 11.6923 8.33987 11.6923 8V5.17798L5.17798 11.6923L8 11.6923C8.33987 11.6923 8.61538 11.9678 8.61538 12.3077C8.61538 12.6476 8.33987 12.9231 8 12.9231L3.69231 12.9231C3.5291 12.9231 3.37257 12.8582 3.25716 12.7428C3.14176 12.6274 3.07692 12.4709 3.07692 12.3077V8C3.07692 7.66013 3.35244 7.38462 3.69231 7.38462Z" fill="#F24822"/>
</svg>
`;
this.opacity=`<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.84615 1.23077C1.50629 1.23077 1.23077 1.50629 1.23077 1.84615V14.1538C1.23077 14.4937 1.50629 14.7692 1.84615 14.7692H7.38462V1.23077H1.84615ZM8.61538 1.23077V2.82202L10.2066 1.23077H8.61538ZM11.9472 1.23077L8.61538 4.56259V6.51433L13.8989 1.23077H11.9472ZM14.7692 2.10105L8.61538 8.2549V10.2066L14.7692 4.05279V2.10105ZM14.7692 5.79336L8.61538 11.9472V13.8989L14.7692 7.7451V5.79336ZM14.7692 9.48567L9.48567 14.7692H11.4374L14.7692 11.4374V9.48567ZM14.7692 13.178L13.178 14.7692H14.1538C14.4937 14.7692 14.7692 14.4937 14.7692 14.1538V13.178ZM0 1.84615C0 0.826551 0.826552 0 1.84615 0H14.1538C15.1734 0 16 0.826551 16 1.84615V14.1538C16 15.1734 15.1734 16 14.1538 16H1.84615C0.826551 16 0 15.1734 0 14.1538V1.84615Z" fill="#9747FF"/>
</svg>
`;



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
this.load=`  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 10C2 9.72386 2.22386 9.5 2.5 9.5H9.5C9.77614 9.5 10 9.72386 10 10V10C10 10.2761 9.77614 10.5 9.5 10.5H2.5C2.22386 10.5 2 10.2761 2 10V10Z" fill="#C3C3C3"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 8.5C5.72386 8.5 5.5 8.27614 5.5 8L5.5 3.20711L4.35355 4.35355C4.15829 4.54882 3.84171 4.54882 3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645L5.64645 1.64645C5.84171 1.45118 6.15829 1.45118 6.35355 1.64645L8.35355 3.64645C8.54882 3.84171 8.54882 4.15829 8.35355 4.35355C8.15829 4.54882 7.84171 4.54882 7.64645 4.35355L6.5 3.20711L6.5 8C6.5 8.27614 6.27614 8.5 6 8.5Z" fill="#C3C3C3"/>
</svg>
`; 
this.save=`  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 10C2 9.72386 2.22386 9.5 2.5 9.5H9.5C9.77614 9.5 10 9.72386 10 10V10C10 10.2761 9.77614 10.5 9.5 10.5H2.5C2.22386 10.5 2 10.2761 2 10V10Z" fill="#C3C3C3"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 1.5C6.27614 1.5 6.5 1.72386 6.5 2V6.79289L7.64645 5.64645C7.84171 5.45118 8.15829 5.45118 8.35355 5.64645C8.54882 5.84171 8.54882 6.15829 8.35355 6.35355L6.35355 8.35355C6.15829 8.54882 5.84171 8.54882 5.64645 8.35355L3.64645 6.35355C3.45118 6.15829 3.45118 5.84171 3.64645 5.64645C3.84171 5.45118 4.15829 5.45118 4.35355 5.64645L5.5 6.79289V2C5.5 1.72386 5.72386 1.5 6 1.5Z" fill="#C3C3C3"/>
</svg>
`; 
this.clone=`<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 7H8C7.44772 7 7 7.44772 7 8V12C7 12.5523 7.44772 13 8 13H12C12.5523 13 13 12.5523 13 12V8C13 7.44772 12.5523 7 12 7ZM8 6C6.89543 6 6 6.89543 6 8V12C6 13.1046 6.89543 14 8 14H12C13.1046 14 14 13.1046 14 12V8C14 6.89543 13.1046 6 12 6H8Z" fill="#C3C3C3"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 3H8C8.55228 3 9 3.44772 9 4V6H10V4C10 2.89543 9.10457 2 8 2H4C2.89543 2 2 2.89543 2 4V8C2 9.10457 2.89543 10 4 10H7V9H4C3.44772 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3Z" fill="#C3C3C3"/>
</svg>

`; 


      // Attach a shadow root to <bezier-input>.
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

  }

  get translationSvg() {
    return this.translation;
  }

  get rotationSvg() {
    return this.rotation;
  }

  get scaleSvg() {
    return this.scale;
  }

  get opacitySvg() {
    return this.opacity;
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
    if (type==='diagonal-arrows') return this.diagonalArrows;
    if (type==='vertical-arrows') return this.verticalArrows;
    if (type==='curve') return this.curve;
    if (type==='fixed-space') return this.fixedSpace;
    if (type==='angle') return this.angle;
    if (type==='side-to-side') return this.sideToSide;
    if (type==='center-to-center') return this.centerToCenter;
    if (type==='danger') return this.danger;
    if (type==='ok') return this.ok;
    if (type==='alpha') return this.alpha;
    if (type==='chevron-down') return this.chevronDown;
    if (type==='check') return this.check;
    if (type==='translation') return this.translation;
    if (type==='translationv') return this.translationv;
    if (type==='rotation') return this.rotation;
    if (type==='scale') return this.scale;
    if (type==='opacity') return this.opacity;
    if (type==='close') return this.close;
    if (type==='add') return this.add;
    if (type==='remove') return this.remove;
    if (type==='repeat') return this.repeat;
    if (type==='load') return this.load;
    if (type==='save') return this.save;
    if (type==='clone') return this.clone;
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