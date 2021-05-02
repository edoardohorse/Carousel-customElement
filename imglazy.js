'use strict';

const OPTIONS_OBSERVER =  {
    root: null,
    rootMargin: '0px',
    threshold: .25
}

const observer = new IntersectionObserver( function(entries, observer){
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.load()
                // debugger
            }
        })
    }
    , OPTIONS_OBSERVER);

class ImgLazy extends HTMLElement{

    static get observedAttributes(){
        return ['src','lazy','placeholder','width', 'height','alt', 'size']
    }

    static get TEXT_FAILED_LOADING(){return "Image not found 😢"}

    static get ATTR_LAZY(){return new Set(['true', 'false', ''])}
    static get ATTR_PLACEHOLDER(){return new Set(['true', 'false', ''])}
    static get ATTR_SIZE(){return new Set(['fill', 'contain', 'cover','none','scale-down'])}

    get lazy(){ return this.getAttribute("lazy")}
    set lazy(v){this.setAttribute("lazy", v)}
    
    get placeholder(){ return this.getAttribute("placeholder")}
    set placeholder(v){this.setAttribute("placeholder", v)}
    
    get src(){ return this.getAttribute("src")}
    set src(v){this.setAttribute("src", v)}
  
    get width(){ return this.getAttribute("width")}
    set width(v){ this.setAttribute("width", v)}
    
    get height(){ return this.getAttribute("height")}
    set height(v){ this.setAttribute("height", v)}
    
    get alt(){ return this.getAttribute("alt")}
    set alt(v){ this.setAttribute("alt", v)}
    
    get size(){ return this.getAttribute("size")}
    set size(v){ this.setAttribute("size", v)}
    

     constructor(){
        super()

        //#region Root
        this.root       = this.attachShadow({mode: 'open'})
        this.root.placeholder = new Placeholder()               // zIndex 20
        this.root.image = new Image()                           // zIndex 10
        this.root.altText = document.createElement('p')
        this.root.style = document.createElement('link')

        //style
        this.root.style.setAttribute('rel','stylesheet')
        this.root.style.setAttribute('href','img.css')

        this.root.appendChild(this.root.style)


        //placeholder
        this.root.appendChild(this.root.placeholder)

        //img
        this.root.image.classList.add('hidden')
        this.root.appendChild(this.root.image)

        //altText
        this.root.altText.textContent = ImgLazy.TEXT_FAILED_LOADING
        this.root.appendChild(this.root.altText)
        
        //#endregion

        //#region Fields        
            this._src = this.src
            this._isLoaded = false
            this._isLoading = false
            this._isLazy = true
            this._isPlaceholderShowable = true
                    
        //#endregion
        
        
    }

    connectedCallback(){
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case 'src':{
                this._src = newValue
                if(this._isLazy)
                    setTimeout( _=>{observer.observe(this)}, 50)
                break
            }

            case 'lazy':{
                if(!ImgLazy.ATTR_LAZY.has(newValue)) return console.error('Can be setted only value: ', ImgLazy.ATTR_LAZY)

                if(newValue == "true" || newValue == ""){
                    this._isLazy = true
                    observer.observe(this)
                }
                else if(newValue == "false"){
                    this._isLazy = false
                    observer.unobserve(this)
                }


                break
            }
            
            case 'placeholder':{
                if(!ImgLazy.ATTR_PLACEHOLDER.has(newValue)) return console.error('Can be setted only value: ', ImgLazy.ATTR_PLACEHOLDER)

                if(newValue == "true" || newValue == ""){
                    this._isPlaceholderShowable = this.root.placeholder.loading = true
                }
                else if(newValue == "false"){
                    this._isPlaceholderShowable = this.root.placeholder.loading = false
                }


                break
            }
            case 'width':{
                if(newValue){
                    this.style.setProperty('--img-width', newValue+'px');
                    this.root.image.width = newValue
                }
                else
                    this.style.removeProperty('--img-width')
                    
                
                break
            }
            
            case 'height':{
                if(newValue){
                    this.style.setProperty('--img-height', newValue+'px');
                    this.root.image.height = newValue
                }
                else
                    this.style.removeProperty('--img-height')
                break
            }

            case 'alt':{
                // if it's an image
                if(newValue.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi))
                    this.src = newValue
                else if(newValue != "")
                    this.root.altText.textContent = newValue
                else
                this.root.altText.textContent = ImgLazy.TEXT_FAILED_LOADING
                break
            }

            case 'size':{
                if(!ImgLazy.ATTR_SIZE.has(newValue)) return console.error('Can be setted only value: ', ImgLazy.ATTR_SIZE)

                this.root.image.style.objectFit = newValue

                break
            }
           
        }
    }

    //#region Private
    

        load(){
            if(this._isLoaded || this._isLoading)
                return 
            
            this._isLoading = true
            this.showPlaceholder()
            this.root.image.src = this._src
            this.root.image.decode()
                .then(this.loaded.bind(this))
                .catch(this.failed.bind(this));
            
            console.debug('Loading image...',this.root)
        }

        loaded(){
            if(!this.root.image.complete)
                return

            console.debug('Image loaded',this.root)
            this._isLoaded = true
            this._isLoading = false
            
            this.style.removeProperty('--img-width')
            this.style.removeProperty('--img-height')
            this.root.image.classList.remove('hidden')
            this.classList.remove('failed')
            observer.unobserve(this)

            this.hidePlaceholder()
        }

        failed(){
            console.debug('Failed load img', this.root)
            
            this._isLoading = this._isLoaded = false
            this.classList.add('failed')
            observer.unobserve(this)

            this.hidePlaceholder()
            
        }


        showPlaceholder(){
            if(!this._isPlaceholderShowable)
                return

            console.debug('Show placeholder',this.root)
            this.root.placeholder.loading = true
        }

        hidePlaceholder(){
            if(!this._isPlaceholderShowable)
                return

            console.debug('Hide placeholder',this.root)
            this.root.placeholder.loading = false
        }

    //#endregion

    //#region Methods
    //#endregion
}

    
customElements.define('img-lazy', ImgLazy)
