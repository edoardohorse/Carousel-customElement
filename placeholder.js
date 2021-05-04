'use strict';
class Placeholder extends HTMLElement{

    static get observedAttributes(){
        return ['width', 'height']
    }

    static get ATTR_LOADING(){return new Set(['true', 'false', ''])}

    get loading(){ return this.getAttribute("loading")}
    set loading(v){this.setAttribute("loading", v)}
  
    get width(){ return this.getAttribute("width")}
    set width(v){ this.setAttribute("width", v)}
    
    get height(){ return this.getAttribute("height")}
    set height(v){ this.setAttribute("height", v)}

     constructor(){
        super()

        //#region Root
        this.root = this.attachShadow({mode: 'open'})

        this.root.style = document.createElement('link')

         //style
        this.root.style.setAttribute('rel','stylesheet')
        this.root.style.setAttribute('href','placeholder.css')

        this.root.appendChild(this.root.style)
        
        //#endregion

        //#region Fields         
                    
        //#endregion
        
        
    }

    connectedCallback(){
        // this.addEventListener()
        this.loading = true
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case 'width':{
                if(newValue)
                    this.style.setProperty('--placeholder-width', newValue+'px');
                else
                    this.style.removeProperty('--placeholder-width')

                break
            }
            
            case 'height':{
                if(newValue)
                    this.style.setProperty('--placeholder-height', newValue+'px');
                else
                    this.style.removeProperty('--placeholder-height')
                break
            }
        }
    }


    //#region Private
    //#endregion

    //#region Methods
    //#endregion
}

    
customElements.define('placeholder-loading', Placeholder)
